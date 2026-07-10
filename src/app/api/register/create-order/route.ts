import { NextResponse } from "next/server";
import { z } from "zod";
import { event } from "@/content/event";
import { isPaymentsConfigured } from "@/lib/env";
import { getRazorpay, getRazorpayKeyId } from "@/lib/razorpay";
import {
  getSupabaseAdmin,
  REGISTRATIONS_TABLE,
} from "@/lib/supabase/admin";
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

  const supabase = getSupabaseAdmin();

  const { data: registration, error: insertError } = await supabase
    .from(REGISTRATIONS_TABLE)
    .insert({
      full_name: data.name,
      email: data.email,
      phone_number: phoneNumber,
      country_code: data.phoneCountry,
      city: data.city,
      user_role: data.currentRole,
      amount_paid: event.priceInINR,
      payment_status: "unpaid",
      course_name: courseName,
    })
    .select("id")
    .single();

  if (insertError || !registration) {
    console.error("Supabase insert failed:", {
      code: insertError?.code,
      message: insertError?.message,
      details: insertError?.details,
      hint: insertError?.hint,
    });
    return NextResponse.json(
      { error: "Could not save registration. Try again." },
      { status: 500 },
    );
  }

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: registration.id.replace(/-/g, "").slice(0, 40),
      notes: {
        registration_id: registration.id,
        email: data.email,
        source: data.source,
      },
    });

    const { error: updateError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .update({ order_id: order.id })
      .eq("id", registration.id);

    if (updateError) {
      console.error("Supabase order update failed:", updateError);
    }

    return NextResponse.json({
      registrationId: registration.id,
      orderId: order.id,
      amount: amountPaise,
      currency: "INR",
      keyId: getRazorpayKeyId(),
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);

    await supabase
      .from(REGISTRATIONS_TABLE)
      .update({ payment_status: "failed" })
      .eq("id", registration.id);

    return NextResponse.json(
      { error: "Could not start payment. Try again." },
      { status: 502 },
    );
  }
}
