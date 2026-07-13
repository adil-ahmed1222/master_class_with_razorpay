import { NextResponse } from "next/server";
import { z } from "zod";
import { isPaymentsConfigured } from "@/lib/env";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import {
  getRegistrationById,
  updateRegistration,
} from "@/lib/nocodb/registrations";

const verifyPaymentSchema = z.object({
  registrationId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  if (!isPaymentsConfigured()) {
    return NextResponse.json(
      { error: "Payment system is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = verifyPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payment response." },
      { status: 400 },
    );
  }

  const {
    registrationId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = parsed.data;

  const valid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );

  if (!valid) {
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 400 },
    );
  }

  let registration;
  try {
    registration = await getRegistrationById(registrationId);
  } catch (error) {
    console.error("NocoDB fetch failed:", error);
    return NextResponse.json(
      { error: "Could not load registration." },
      { status: 500 },
    );
  }

  if (!registration) {
    return NextResponse.json(
      { error: "Registration not found." },
      { status: 404 },
    );
  }

  if (registration.order_id && registration.order_id !== razorpay_order_id) {
    return NextResponse.json(
      { error: "Order mismatch." },
      { status: 400 },
    );
  }

  if (registration.payment_status === "paid") {
    return NextResponse.json({ ok: true });
  }

  try {
    await updateRegistration(registrationId, {
      payment_status: "paid",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      payment_signature: razorpay_signature,
    });
  } catch (error) {
    console.error("NocoDB payment update failed:", error);
    return NextResponse.json(
      { error: "Could not confirm payment." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
