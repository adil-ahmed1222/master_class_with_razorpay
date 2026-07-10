import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/env";

let razorpayClient: Razorpay | null = null;

/** Server-only Razorpay SDK instance. */
export function getRazorpay(): Razorpay {
  if (razorpayClient) return razorpayClient;

  const keyId = serverEnv.RAZORPAY_KEY_ID;
  const keySecret = serverEnv.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured.");
  }

  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayClient;
}

export function getRazorpayKeyId(): string {
  const keyId = serverEnv.RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error("Razorpay is not configured.");
  }
  return keyId;
}

/** Verify Razorpay payment signature (order_id|payment_id). */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const secret = serverEnv.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8"),
    );
  } catch {
    return false;
  }
}
