"use client";

import { useCallback, useRef, useState } from "react";
import { Button, EventPrice, Input, Select } from "@/components/ui";
import { PhoneField } from "@/components/forms/PhoneField";
import { currentRoles } from "@/content/current-roles";
import { defaultPhoneCountryCode } from "@/content/phone-countries";
import {
  fieldErrors,
  registrationSchema,
  type RegistrationInput,
} from "@/lib/validation";
import { track, type RegistrationFieldKey } from "@/lib/analytics";
import { formMicrocopy } from "@/content/registration";
import { cn } from "@/lib/utils";
import { formatRegistrationPhone } from "@/lib/validation";
import {
  createRegistrationOrder,
  openRazorpayCheckout,
  verifyRegistrationPayment,
} from "@/lib/razorpay-checkout";

type FormStatus = "idle" | "submitting" | "success" | "error";

const emptyValues: RegistrationInput = {
  name: "",
  email: "",
  phoneCountry: defaultPhoneCountryCode,
  phoneNumber: "",
  city: "",
  currentRole: "Student",
};

type RegistrationFormProps = {
  /** Prefix for input ids when multiple forms exist on one page. */
  formId?: string;
  className?: string;
  /** Analytics source label (no PII). */
  source: "hero" | "registration";
};

export function RegistrationForm({ formId = "register", className, source }: RegistrationFormProps) {
  const statusId = `${formId}-status`;
  const focusedRef = useRef(false);
  const completedFields = useRef(new Set<RegistrationFieldKey>());

  const [values, setValues] = useState<RegistrationInput>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationInput, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const phoneError = errors.phoneNumber ?? errors.phoneCountry;

  const markFieldComplete = useCallback((field: RegistrationFieldKey, valid: boolean) => {
    if (!valid || completedFields.current.has(field)) return;
    completedFields.current.add(field);
    track("registration_field_completed", { field, source });
  }, [source]);

  const onFirstFocus = useCallback(() => {
    if (focusedRef.current) return;
    focusedRef.current = true;
    track("registration_form_focus", { source });
  }, [source]);

  const validateField = useCallback(
    (field: keyof RegistrationInput) => {
      const result = registrationSchema.safeParse(values);
      if (result.success) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          if (field === "phoneNumber" || field === "phoneCountry") {
            delete next.phoneNumber;
            delete next.phoneCountry;
          }
          return next;
        });
        return true;
      }
      const fe = fieldErrors(result.error);
      const message = fe[field];
      setErrors((prev) => ({ ...prev, [field]: message }));
      return !message;
    },
    [values],
  );

  const validatePhone = useCallback(() => {
    const countryOk = validateField("phoneCountry");
    const numberOk = validateField("phoneNumber");
    const valid = countryOk && numberOk;
    if (valid) {
      markFieldComplete("phone", true);
    }
    return valid;
  }, [markFieldComplete, validateField]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsed = registrationSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      const firstKey = parsed.error.issues[0]?.path[0];
      if (typeof firstKey === "string") {
        const focusId =
          firstKey === "phoneCountry" || firstKey === "phoneNumber"
            ? `${formId}-phoneNumber`
            : `${formId}-${firstKey}`;
        document.getElementById(focusId)?.focus();
      }
      return;
    }

    setErrors({});
    setStatus("submitting");
    track("registration_submit", { source });

    try {
      const order = await createRegistrationOrder({ ...parsed.data, source });
      const payment = await openRazorpayCheckout(order, {
        name: parsed.data.name,
        email: parsed.data.email,
        contact: formatRegistrationPhone(parsed.data),
      });
      await verifyRegistrationPayment(payment);
      setStatus("success");
      track("registration_success", { source });
    } catch (error) {
      setStatus("idle");
      const message =
        error instanceof Error ? error.message : formMicrocopy.errorBody;
      if (message === "Payment cancelled.") {
        setFormError("Payment was cancelled. Your details are saved — try again when ready.");
      } else {
        setFormError(message || formMicrocopy.errorBody);
        track("registration_error", { source });
      }
    }
  };

  if (status === "success") {
    return (
      <div
        className={cn("flex flex-col gap-3 rounded-lg border border-success/30 bg-success/10 p-6", className)}
        role="status"
        aria-live="polite"
      >
        <p className="font-display text-h3 text-success">{formMicrocopy.successTitle}</p>
        <p className="font-sans text-body text-text">{formMicrocopy.successBody}</p>
      </div>
    );
  }

  return (
    <form
      id={formId}
      className={cn("flex flex-col gap-5 sm:gap-6", className)}
      onSubmit={onSubmit}
      onFocus={onFirstFocus}
      noValidate
    >
      <div id={statusId} className="sr-only" aria-live="polite">
        {status === "submitting" ? formMicrocopy.pending : formError ?? ""}
      </div>

      <Input
        id={`${formId}-name`}
        name="name"
        label="Full name"
        autoComplete="name"
        required
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        onBlur={() => markFieldComplete("name", validateField("name"))}
        error={errors.name}
        disabled={status === "submitting"}
      />

      <Input
        id={`${formId}-email`}
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        inputMode="email"
        required
        hint={formMicrocopy.helper}
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        onBlur={() => markFieldComplete("email", validateField("email"))}
        error={errors.email}
        disabled={status === "submitting"}
      />

      <PhoneField
        id={`${formId}-phone`}
        countryId={`${formId}-phoneCountry`}
        numberId={`${formId}-phoneNumber`}
        label="Phone number"
        required
        countryValue={values.phoneCountry}
        numberValue={values.phoneNumber}
        onCountryChange={(code) =>
          setValues((v) => ({
            ...v,
            phoneCountry: code as RegistrationInput["phoneCountry"],
          }))
        }
        onNumberChange={(phoneNumber) => setValues((v) => ({ ...v, phoneNumber }))}
        onBlur={validatePhone}
        error={phoneError}
        disabled={status === "submitting"}
      />

      <Input
        id={`${formId}-city`}
        name="city"
        label="City"
        autoComplete="address-level2"
        value={values.city}
        onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
        onBlur={() => markFieldComplete("city", validateField("city"))}
        error={errors.city}
        disabled={status === "submitting"}
      />

      <Select
        id={`${formId}-currentRole`}
        name="currentRole"
        label="Current role"
        required
        value={values.currentRole}
        onChange={(e) =>
          setValues((v) => ({
            ...v,
            currentRole: e.target.value as RegistrationInput["currentRole"],
          }))
        }
        onBlur={() => markFieldComplete("currentRole", validateField("currentRole"))}
        error={errors.currentRole}
        disabled={status === "submitting"}
        options={currentRoles.map((role) => ({ value: role, label: role }))}
      />

      {formError ? (
        <p className="font-sans text-caption text-[var(--color-danger)]" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" size="lg" fullWidth loading={status === "submitting"}>
        {status === "submitting" ? (
          formMicrocopy.pending
        ) : (
          <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5">
            {formMicrocopy.submitPrefix}
            <EventPrice size="sm" />
          </span>
        )}
      </Button>
    </form>
  );
}
