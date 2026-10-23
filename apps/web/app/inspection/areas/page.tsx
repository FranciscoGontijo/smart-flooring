import type { Metadata } from "next";
import { AreasForm } from "@/components/inspection/areas-form";

export const metadata: Metadata = { title: "Assessment · Por área" };

export default function Page() {
  return <AreasForm />;
}
