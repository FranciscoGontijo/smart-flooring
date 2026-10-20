import { z } from "zod";

/** User roles. See docs/definicao-do-projeto.md, section 2. */
export const papelSchema = z.enum(["inspetor", "pm", "admin"]);
export type Papel = z.infer<typeof papelSchema>;

export const idiomaSchema = z.enum(["pt", "en"]);
export type Idioma = z.infer<typeof idiomaSchema>;
