"use client";

import { ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, getService } from "@/lib/inspection/catalog";
import { formatQuantity, newId } from "@/lib/inspection/format";
import { EXAMPLE_LINES, type Line } from "@/lib/inspection/lines";
import { BottomBar } from "./bottom-bar";
import { LineEditor, type LineDraft } from "./line-editor";
import { ProjectHeader } from "./project-header";
import { SummaryDrawer } from "./summary-drawer";

const NO_AREA = "Sem área";

export function LinesForm() {
  const [lines, setLines] = useState<Line[]>(EXAMPLE_LINES);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const editing = lines.find((l) => l.id === editingId) ?? null;
  const knownAreas = [...new Set(lines.map((l) => l.area).filter((a): a is string => !!a))];
  const lastArea = lines.at(-1)?.area;

  // Lines grouped by area, in the order the areas first appear.
  const groups = new Map<string, Line[]>();
  for (const line of lines) {
    const key = line.area ?? NO_AREA;
    groups.set(key, [...(groups.get(key) ?? []), line]);
  }

  const openNew = () => {
    setEditingId(null);
    setEditorOpen(true);
  };

  const save = (draft: LineDraft, addAnother: boolean) => {
    if (editingId) {
      setLines((ls) => ls.map((l) => (l.id === editingId ? { ...draft, id: editingId } : l)));
    } else {
      setLines((ls) => [...ls, { ...draft, id: newId() }]);
    }
    if (!addAnother) setEditorOpen(false);
  };

  return (
    <div className="bg-muted/40 min-h-dvh">
      <ProjectHeader pattern="Linha por linha" />

      <main className="mx-auto grid max-w-md gap-5 px-4 pt-4 pb-44">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Serviços</h2>
          <button
            type="button"
            className="text-muted-foreground text-sm underline-offset-2 hover:underline"
            onClick={() => setLines(lines.length ? [] : EXAMPLE_LINES)}
          >
            {lines.length ? "Recomeçar vazio" : "Carregar exemplo"}
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="bg-background grid justify-items-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center">
            <ClipboardList className="text-muted-foreground size-8" />
            <p className="font-medium">Nenhuma linha ainda</p>
            <p className="text-muted-foreground text-sm">
              Adicione cada trabalho com a quantidade. Ex.: &quot;Remove carpet &amp; pad · 320 sq
              ft&quot;.
            </p>
          </div>
        ) : (
          [...groups].map(([area, areaLines]) => (
            <section key={area} className="grid gap-2">
              <h3 className="text-muted-foreground px-1 text-xs font-semibold tracking-wide uppercase">
                {area}
              </h3>
              <ul className="bg-background divide-y overflow-hidden rounded-2xl border">
                {areaLines.map((line) => {
                  const service = getService(line.serviceId);
                  return (
                    <li key={line.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(line.id);
                          setEditorOpen(true);
                        }}
                        className="hover:bg-muted/60 active:bg-muted flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] leading-snug font-medium">{service.name}</p>
                          <p className="text-muted-foreground truncate text-xs">
                            {CATEGORY_LABEL[service.category]}
                            {line.note ? ` · ${line.note}` : ""}
                          </p>
                        </div>
                        <span className="shrink-0 text-[15px] font-semibold tabular-nums">
                          {formatQuantity(line.quantity, service.unit)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </main>

      <BottomBar>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-12 flex-1 text-base"
            onClick={() => setSummaryOpen(true)}
          >
            Resumo · {lines.length}
          </Button>
          <Button className="h-12 flex-[2] text-base" onClick={openNew}>
            <Plus className="size-5" /> Adicionar linha
          </Button>
        </div>
      </BottomBar>

      <LineEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initial={editing}
        lastArea={lastArea}
        knownAreas={knownAreas}
        onSave={save}
        onDelete={() => {
          setLines((ls) => ls.filter((l) => l.id !== editingId));
          setEditorOpen(false);
        }}
      />
      <SummaryDrawer open={summaryOpen} onOpenChange={setSummaryOpen} lines={lines} />
    </div>
  );
}
