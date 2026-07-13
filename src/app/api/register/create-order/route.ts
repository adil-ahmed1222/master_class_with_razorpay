import { NextResponse } from "next/server";
import { z } from "zod";
import { event } from "@/content/event";
import { isPaymentsConfigured } from "@/lib/env";
import { getRazorpay, getRazorpayKeyId } from "@/lib/razorpay";
import {
  asRecordId,
  createRegistration,
  updateRegistration,
} from "@/lib/nocodb/registrations";
import { registrationSchema } from "@/lib/validation";

const createOrderSchema = registrationSchema.extend({
  source: z.enum(["hero", "registration"]),
});

const courseName = `${event.brand} ${event.series} — ${event.title}`;

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

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid registration." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const amountPaise = event.priceInINR * 100;
  const phoneNumber = data.phoneNumber.replace(/\D/g, "");

  let registrationId: string;

  try {
    const registration = await createRegistration({
      full_name: data.name,
      email: data.email,
      phone_number: phoneNumber,
      country_code: data.phoneCountry,
      city: data.city,
      user_role: data.currentRole,
      amount_paid: event.priceInINR,
      payment_status: "unpaid",
      course_name: courseName,
    });
    registrationId = asRecordId(registration.Id);
  } catch (error) {
    console.error("NocoDB insert failed:", error);
    const isAuth =
      error instanceof Error &&
      (error.message.toLowerCase().includes("invalid token") ||
        error.message.toLowerCase().includes("authentication") ||
        ("status" in error && (error as { status?: number }).status === 401));

    return NextResponse.json(
      {
        error: isAuth
          ? "NocoDB API token is invalid. Create a new token in NocoDB and update NOCODB_API_TOKEN in .env.local."
          : "Could not save registration. Try again.",
      },
      { status: isAuth ? 401 : 500 },
    );
  }

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `reg_${registrationId}`.slice(0, 40),
      notes: {
        registration_id: registrationId,
        email: data.email,
        source: data.source,
      },
    });

    try {
      await updateRegistration(registrationId, { order_id: order.id });
    } catch (updateError) {
      console.error("NocoDB order update failed:", updateError);
    }

    return NextResponse.json({
      registrationId,
      orderId: order.id,
      amount: amountPaise,
      currency: "INR",
      keyId: getRazorpayKeyId(),
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);

    try {
      await updateRegistration(registrationId, { payment_status: "failed" });
    } catch (updateError) {
      console.error("NocoDB failed-status update failed:", updateError);
    }

    return NextResponse.json(
      { error: "Could not start payment. Try again." },
      { status: 502 },
    );
  }
}
