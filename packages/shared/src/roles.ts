import { z } from "zod";

/** User roles. See docs/definicao-do-projeto.md, section 2. */
export const roleSchema = z.enum(["inspector", "pm", "admin"]);
export type Role = z.infer<typeof roleSchema>;

export const languageSchema = z.enum(["pt", "en"]);
export type Language = z.infer<typeof languageSchema>;
