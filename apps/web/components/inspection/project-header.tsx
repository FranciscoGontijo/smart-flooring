import { CalendarClock, ChevronLeft, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { MOCK_PROJECT } from "@/lib/inspection/project";

export function ProjectHeader({ pattern }: { pattern: string }) {
  const project = MOCK_PROJECT;
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex max-w-md items-center gap-2 px-2 pt-[max(env(safe-area-inset-top),0.5rem)] pb-2">
        <Link
          href="/inspection"
          aria-label="Voltar"
          className="hover:bg-muted flex size-11 shrink-0 items-center justify-center rounded-full"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs">Assessment · {pattern}</p>
          <h1 className="truncate text-base leading-tight font-semibold">{project.customer}</h1>
        </div>
      </div>
      <details className="group mx-auto max-w-md px-4 pb-3">
        <summary className="text-muted-foreground flex cursor-pointer list-none items-center gap-1.5 text-sm [&::-webkit-details-marker]:hidden">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{project.address}</span>
          <span className="text-primary ml-auto shrink-0 text-xs font-medium group-open:hidden">
            mais
          </span>
        </summary>
        <dl className="mt-3 grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarClock className="text-muted-foreground size-4" />
            <dd>{project.scheduledAt}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-muted-foreground size-4" />
            <dd>
              <a
                className="text-primary underline-offset-2 hover:underline"
                href={`tel:${project.phone}`}
              >
                {project.phone}
              </a>{" "}
              · {project.kind}
            </dd>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <dt className="text-muted-foreground text-xs">Nota do PM ({project.pm})</dt>
            <dd className="mt-0.5">{project.pmNote}</dd>
          </div>
        </dl>
      </details>
    </header>
  );
}
