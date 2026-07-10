import { event } from "@/content/event";

export type CheckoutPrefill = {
  name: string;
  email: string;
  contact: string;
};

export type CreateOrderResponse = {
  registrationId: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type VerifyPaymentPayload = {
  registrationId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: CheckoutPrefill;
  theme: { color: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal: { ondismiss: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

const RAZORPAY_SCRIPT_ID = "razorpay-checkout-js";
const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout is only available in the browser."));
  }

  if (window.Razorpay) return Promise.resolve();

  const existing = document.getElementById(RAZORPAY_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Razorpay checkout.")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

export async function createRegistrationOrder(
  registration: Record<string, unknown> & { source: "hero" | "registration" },
): Promise<CreateOrderResponse> {
  const res = await fetch("/api/register/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registration),
  });

  const data = (await res.json()) as CreateOrderResponse & { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "Could not start checkout.");
  }

  return data;
}

export async function verifyRegistrationPayment(
  payload: VerifyPaymentPayload,
): Promise<void> {
  const res = await fetch("/api/register/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "Payment verification failed.");
  }
}

export async function openRazorpayCheckout(
  order: CreateOrderResponse,
  prefill: CheckoutPrefill,
): Promise<VerifyPaymentPayload> {
  await loadRazorpayScript();

  if (!window.Razorpay) {
    throw new Error("Razorpay checkout is unavailable.");
  }

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay!({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: event.brand,
      description: `${event.title} — ${event.mode}`,
      order_id: order.orderId,
      prefill,
      theme: { color: "#2563eb" },
      handler: (response) => {
        resolve({
          registrationId: order.registrationId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled."));
        },
      },
    });

    checkout.on("payment.failed", (response) => {
      reject(new Error(response.error.description || "Payment failed."));
    });

    checkout.open();
  });
}
