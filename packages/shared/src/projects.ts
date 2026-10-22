import { z } from "zod";

/** Project stages (the PM's funnel). See docs/definicao-do-projeto.md, section 3.1. */
export const projectStageSchema = z.enum([
  "new_lead",
  "assessment_scheduled",
  "in_sales",
  "sale_confirmed",
  "installation_scheduled",
  "completed",
  "closed",
]);
export type ProjectStage = z.infer<typeof projectStageSchema>;

/** Inspection status, only during the assessment_scheduled stage. Section 3.5. */
export const inspectionStatusSchema = z.enum([
  "scheduled",
  "in_inspection",
  "generating",
  "in_review",
  "under_analysis",
  "returned",
  "accepted",
]);
export type InspectionStatus = z.infer<typeof inspectionStatusSchema>;

/** Fixed list of closing reasons. Section 3.3. */
export const closeReasonSchema = z.enum([
  "price",
  "competitor",
  "customer_gave_up",
  "no_response",
  "other",
]);
export type CloseReason = z.infer<typeof closeReasonSchema>;

export const closeProjectSchema = z
  .object({
    reason: closeReasonSchema,
    note: z.string().trim().max(1000).optional(),
  })
  .refine((v) => v.reason !== "other" || (v.note?.length ?? 0) > 0, {
    message: "A nota é obrigatória quando o motivo é 'outro'.",
    path: ["note"],
  });
export type CloseProject = z.infer<typeof closeProjectSchema>;
