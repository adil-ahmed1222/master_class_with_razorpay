"use client";

import { useId, useState } from "react";
import { Button, Input, Select, TextArea } from "@/components/ui";
import {
  experienceLevels,
  feedbackSchema,
  fieldErrors,
  type FeedbackInput,
} from "@/lib/validation";
import { track } from "@/lib/analytics";
import { feedbackMicrocopy } from "@/content/feedback";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "submitting" | "success" | "error";

const emptyValues: FeedbackInput = {
  heardFrom: "",
  hopingToLearn: "",
  currentRole: "",
  aiExperienceLevel: undefined,
  biggestChallenge: "",
};

type FeedbackFormProps = {
  formId?: string;
  className?: string;
};

export function FeedbackForm({ formId = "feedback", className }: FeedbackFormProps) {
  const statusId = useId();
  const [values, setValues] = useState<FeedbackInput>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackInput, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const payload: FeedbackInput = {
      heardFrom: values.heardFrom?.trim() || undefined,
      hopingToLearn: values.hopingToLearn?.trim() || undefined,
      currentRole: values.currentRole?.trim() || undefined,
      aiExperienceLevel: values.aiExperienceLevel || undefined,
      biggestChallenge: values.biggestChallenge?.trim() || undefined,
    };

    const parsed = feedbackSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setStatus("submitting");
    track("feedback_submit");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? feedbackMicrocopy.errorBody);
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setFormError(
        error instanceof Error ? error.message : feedbackMicrocopy.errorBody,
      );
    }
  };

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-success/30 bg-success/10 p-6",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <p className="font-display text-h3 text-success">{feedbackMicrocopy.successTitle}</p>
        <p className="font-sans text-body text-text">{feedbackMicrocopy.successBody}</p>
      </div>
    );
  }

  return (
    <form
      id={formId}
      className={cn("flex flex-col gap-5 sm:gap-6", className)}
      onSubmit={onSubmit}
      noValidate
    >
      <p className="font-sans text-caption text-text-2">{feedbackMicrocopy.optionalNote}</p>

      <div id={statusId} className="sr-only" aria-live="polite">
        {status === "submitting" ? feedbackMicrocopy.pending : formError ?? ""}
      </div>

      <Input
        id={`${formId}-heardFrom`}
        name="heardFrom"
        label="How did you hear about us?"
        autoComplete="off"
        value={values.heardFrom ?? ""}
        onChange={(e) => setValues((v) => ({ ...v, heardFrom: e.target.value }))}
        error={errors.heardFrom}
        disabled={status === "submitting"}
      />

      <TextArea
        id={`${formId}-hopingToLearn`}
        name="hopingToLearn"
        label="What are you hoping to learn?"
        rows={3}
        value={values.hopingToLearn ?? ""}
        onChange={(e) => setValues((v) => ({ ...v, hopingToLearn: e.target.value }))}
        error={errors.hopingToLearn}
        disabled={status === "submitting"}
      />

      <Input
        id={`${formId}-currentRole`}
        name="currentRole"
        label="Current role"
        autoComplete="organization-title"
        value={values.currentRole ?? ""}
        onChange={(e) => setValues((v) => ({ ...v, currentRole: e.target.value }))}
        error={errors.currentRole}
        disabled={status === "submitting"}
      />

      <Select
        id={`${formId}-aiExperienceLevel`}
        name="aiExperienceLevel"
        label="AI experience level"
        value={values.aiExperienceLevel ?? ""}
        onChange={(e) =>
          setValues((v) => ({
            ...v,
            aiExperienceLevel:
              e.target.value === ""
                ? undefined
                : (e.target.value as FeedbackInput["aiExperienceLevel"]),
          }))
        }
        error={errors.aiExperienceLevel}
        disabled={status === "submitting"}
        options={[
          { value: "", label: "Select one (optional)" },
          ...experienceLevels.map((level) => ({ value: level, label: level })),
        ]}
      />

      <TextArea
        id={`${formId}-biggestChallenge`}
        name="biggestChallenge"
        label="Biggest challenge with AI?"
        rows={3}
        value={values.biggestChallenge ?? ""}
        onChange={(e) => setValues((v) => ({ ...v, biggestChallenge: e.target.value }))}
        error={errors.biggestChallenge}
        disabled={status === "submitting"}
      />

      {formError ? (
        <p className="font-sans text-caption text-[var(--color-danger)]" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" size="lg" variant="secondary" fullWidth loading={status === "submitting"}>
        {status === "submitting" ? feedbackMicrocopy.pending : feedbackMicrocopy.submit}
      </Button>
    </form>
  );
}
