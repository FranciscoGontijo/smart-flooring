import { healthSchema, type Health } from "@smart-flooring/shared";
import { connection } from "next/server";
import { API_URL } from "@/lib/api";

async function lerHealth(): Promise<Health | null> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    return healthSchema.parse(await res.json());
  } catch {
    return null;
  }
}

export default async function Home() {
  await connection();
  const health = await lerHealth();

  const linhas = [
    { rotulo: "API", ok: health !== null },
    { rotulo: "Banco de dados", ok: health?.db === "ok" },
  ];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold">Smart Flooring</h1>
        <p className="text-muted-foreground text-sm">Esqueleto do monorepo: web, api e shared.</p>
      </div>
      <ul className="divide-border divide-y rounded-lg border">
        {linhas.map(({ rotulo, ok }) => (
          <li key={rotulo} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{rotulo}</span>
            <span className={ok ? "text-green-600" : "text-destructive"}>
              {ok ? "ok" : "indisponível"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
