import { z } from "zod";

export const healthSchema = z.object({
  status: z.literal("ok"),
  database: z.enum(["ok", "error"]),
});
export type Health = z.infer<typeof healthSchema>;
