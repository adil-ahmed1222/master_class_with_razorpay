import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSupabaseAdmin,
  REGISTRATIONS_TABLE,
} from "@/lib/supabase/admin";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { isPaymentsConfigured } from "@/lib/env";

const verifyPaymentSchema = z.object({
  registrationId: z.string().uuid(),
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

  const supabase = getSupabaseAdmin();

  const { data: registration, error: fetchError } = await supabase
    .from(REGISTRATIONS_TABLE)
    .select("id, order_id, payment_status")
    .eq("id", registrationId)
    .single();

  if (fetchError || !registration) {
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

  const { error: updateError } = await supabase
    .from(REGISTRATIONS_TABLE)
    .update({
      payment_status: "paid",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      payment_signature: razorpay_signature,
    })
    .eq("id", registrationId);

  if (updateError) {
    console.error("Supabase payment update failed:", updateError);
    return NextResponse.json(
      { error: "Could not confirm payment." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
