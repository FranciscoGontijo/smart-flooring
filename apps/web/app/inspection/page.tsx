import { ChevronRight, LayoutGrid, ListPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { InstallHint } from "@/components/pwa/install-hint";
import { MOCK_PROJECT } from "@/lib/inspection/project";

export const metadata: Metadata = { title: "Assessment · Protótipos" };

const PATTERNS = [
  {
    href: "/inspection/lines",
    icon: ListPlus,
    title: "Linha por linha",
    description:
      "Estilo QuickBooks: cada trabalho vira uma linha com quantidade. Rápido e livre; o inspetor decide o que anotar.",
  },
  {
    href: "/inspection/areas",
    icon: LayoutGrid,
    title: "Por área",
    description:
      "Um formulário completo para cada cômodo: medidas, piso atual, piso novo, contrapiso, acabamento, umidade e fotos. As linhas saem sozinhas.",
  },
];

export default function Page() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-md content-start gap-6 px-4 pt-[max(env(safe-area-inset-top),2rem)] pb-10">
      <div>
        <p className="text-muted-foreground text-sm">Protótipo · dados de exemplo</p>
        <h1 className="mt-1 text-2xl font-semibold">Formulário do assessment</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Dois jeitos de preencher o mesmo assessment de {MOCK_PROJECT.customer}. Nada é salvo: dá
          para testar à vontade com os inspetores.
        </p>
      </div>
      <InstallHint />
      <ul className="grid gap-3">
        {PATTERNS.map(({ href, icon: Icon, title, description }) => (
          <li key={href}>
            <Link
              href={href}
              className="bg-background hover:bg-muted/60 active:bg-muted flex items-center gap-4 rounded-2xl border p-4"
            >
              <span className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
                <Icon className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{title}</span>
                <span className="text-muted-foreground mt-0.5 block text-sm">{description}</span>
              </span>
              <ChevronRight className="text-muted-foreground size-5 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
