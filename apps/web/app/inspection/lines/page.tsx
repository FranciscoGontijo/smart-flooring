import type { Metadata } from "next";
import { LinesForm } from "@/components/inspection/lines-form";

export const metadata: Metadata = { title: "Assessment · Linha por linha" };

export default function Page() {
  return <LinesForm />;
}
