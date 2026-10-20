import { z } from "zod";

/** Project stages (the PM's funnel). See docs/definicao-do-projeto.md, section 3.1. */
export const etapaSchema = z.enum([
  "novo_lead",
  "assessment_marcado",
  "em_venda",
  "venda_confirmada",
  "instalacao_marcada",
  "completo",
  "fechado",
]);
export type Etapa = z.infer<typeof etapaSchema>;

/** Inspection status, only during the assessment_marcado stage. Section 3.5. */
export const statusInspecaoSchema = z.enum([
  "agendado",
  "em_inspecao",
  "gerando",
  "em_revisao",
  "em_analise",
  "devolvido",
  "aceito",
]);
export type StatusInspecao = z.infer<typeof statusInspecaoSchema>;

/** Fixed list of closing reasons. Section 3.3. */
export const motivoFechamentoSchema = z.enum([
  "preco",
  "concorrente",
  "cliente_desistiu",
  "sem_resposta",
  "outro",
]);
export type MotivoFechamento = z.infer<typeof motivoFechamentoSchema>;

export const fecharProjetoSchema = z
  .object({
    motivo: motivoFechamentoSchema,
    nota: z.string().trim().max(1000).optional(),
  })
  .refine((v) => v.motivo !== "outro" || (v.nota?.length ?? 0) > 0, {
    message: "A nota é obrigatória quando o motivo é 'outro'.",
    path: ["nota"],
  });
export type FecharProjeto = z.infer<typeof fecharProjetoSchema>;
