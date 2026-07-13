import { z } from "zod";
import { currentRoles } from "@/content/current-roles";
import {
  defaultPhoneCountryCode,
  dialCodeForCountry,
  phoneCountries,
} from "@/content/phone-countries";

/**
 * Validation architecture — shared schemas for client + server (09-forms, 12-coding-standards).
 * Single source of truth for registration, pre-session feedback, and post-attendance survey.
 */

export const experienceLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;
export type ExperienceLevel = (typeof experienceLevels)[number];

const phoneCountryCodes = phoneCountries.map((c) => c.code) as [string, ...string[]];

/** Registration form — five fields (09-forms). */
export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "That name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email so we can send your link."),
  phoneCountry: z.enum(phoneCountryCodes, {
    message: "Select a country code.",
  }),
  phoneNumber: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number.")
    .max(15, "Enter a valid phone number.")
    .regex(/^[0-9\s()-]+$/, "Enter a valid phone number."),
  city: z.string().trim().max(80, "That city name is too long."),
  currentRole: z.enum(currentRoles, {
    message: "Select your current role.",
  }),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

/** E.164-style full number for APIs (country dial + national number). */
export function formatRegistrationPhone(data: RegistrationInput): string {
  const dial = dialCodeForCountry(data.phoneCountry);
  const national = data.phoneNumber.replace(/\D/g, "");
  return `${dial}${national}`;
}

/** Post-registration feedback survey (09-forms / FeedbackSection). */
export const feedbackSchema = z.object({
  heardFrom: z.string().trim().max(200).optional(),
  hopingToLearn: z.string().trim().max(500).optional(),
  currentRole: z.string().trim().max(120).optional(),
  aiExperienceLevel: z.enum(experienceLevels).optional(),
  biggestChallenge: z.string().trim().max(500).optional(),
});
export type FeedbackInput = z.infer<typeof feedbackSchema>;

export const attendAgainOptions = ["Yes", "No", "Maybe"] as const;
export type AttendAgainOption = (typeof attendAgainOptions)[number];

/**
 * Post-attendance Masterclass Survey — independent of registration storage.
 * Soft-linked via optional email / registrationId only (no hard DB join required).
 */
export const surveySchema = z
  .object({
    fullName: z.string().trim().max(80).optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email.")
      .optional()
      .or(z.literal("")),
    registrationId: z.string().trim().max(80).optional(),
    phoneNumber: z.string().trim().max(20).optional(),
    courseName: z.string().trim().max(200).optional(),
    overallRating: z.number().int().min(1).max(5).optional(),
    contentRating: z.number().int().min(1).max(5).optional(),
    instructorRating: z.number().int().min(1).max(5).optional(),
    recommendationScore: z.number().int().min(0).max(10).optional(),
    mostValuable: z.string().trim().max(2000).optional(),
    whatToImprove: z.string().trim().max(2000).optional(),
    wouldAttendAgain: z.enum(attendAgainOptions).optional(),
    topicsForNext: z.string().trim().max(2000).optional(),
    testimonial: z.string().trim().max(2000).optional(),
    allowTestimonialUse: z.boolean().optional(),
    sessionDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasAnyResponse =
      data.overallRating != null ||
      data.contentRating != null ||
      data.instructorRating != null ||
      data.recommendationScore != null ||
      Boolean(data.mostValuable?.trim()) ||
      Boolean(data.whatToImprove?.trim()) ||
      data.wouldAttendAgain != null ||
      Boolean(data.topicsForNext?.trim()) ||
      Boolean(data.testimonial?.trim());

    if (!hasAnyResponse) {
      ctx.addIssue({
        code: "custom",
        message: "Add at least one survey response before submitting.",
        path: ["overallRating"],
      });
    }
  });
export type SurveyInput = z.infer<typeof surveySchema>;

/** Helper: flatten a ZodError into field → message for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) {
      out[key] = issue.message;
    }
  }
  return out;
}

export { defaultPhoneCountryCode };
