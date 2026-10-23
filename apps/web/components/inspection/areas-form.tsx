"use client";

import { Camera, Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {
  areaSqFt,
  deriveLines,
  emptyArea,
  EXAMPLE_AREAS,
  missingFields,
  type Area,
} from "@/lib/inspection/areas";
import { AREA_PRESETS, CURRENT_FLOOR_LABEL, NEW_FLOOR_LABEL } from "@/lib/inspection/catalog";
import { formatNumber, newId } from "@/lib/inspection/format";
import { AreaEditor } from "./area-editor";
import { BottomBar } from "./bottom-bar";
import { ChipGroup } from "./chip-group";
import { ProjectHeader } from "./project-header";
import { SummaryDrawer } from "./summary-drawer";

export function AreasForm() {
  const [areas, setAreas] = useState<Area[]>(EXAMPLE_AREAS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const totalSqFt = areas.reduce((sum, a) => sum + areaSqFt(a), 0);
  const lines = areas.flatMap(deriveLines);

  const update = (area: Area) => setAreas((as) => as.map((a) => (a.id === area.id ? area : a)));

  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id));

  // Bring the opened card to the top of the screen, after the previous one has collapsed.
  // Waits for the "new area" drawer to close: while it is open the page scroll is locked.
  useEffect(() => {
    if (!openId || addOpen) return;
    const timer = setTimeout(() => {
      document
        .getElementById(`area-${openId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => clearTimeout(timer);
  }, [openId, addOpen]);

  return (
    <div className="bg-muted/40 min-h-dvh">
      <ProjectHeader pattern="Por área" />

      <main className="mx-auto grid max-w-md gap-3 px-4 pt-4 pb-44">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Áreas</h2>
          <button
            type="button"
            className="text-muted-foreground text-sm underline-offset-2 hover:underline"
            onClick={() => {
              setAreas(areas.length ? [] : EXAMPLE_AREAS);
              setOpenId(null);
            }}
          >
            {areas.length ? "Recomeçar vazio" : "Carregar exemplo"}
          </button>
        </div>

        {areas.length === 0 && (
          <div className="bg-background grid justify-items-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center">
            <p className="font-medium">Nenhuma área ainda</p>
            <p className="text-muted-foreground text-sm">
              Comece pela primeira área que vai entrar: sala, cozinha, corredor…
            </p>
          </div>
        )}

        {areas.map((area) => {
          const open = area.id === openId;
          const missing = missingFields(area);
          const sqft = areaSqFt(area);
          return (
            <article
              key={area.id}
              id={`area-${area.id}`}
              className="bg-background scroll-mt-32 overflow-hidden rounded-2xl border"
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => toggle(area.id)}
                className="flex w-full items-start gap-3 p-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{area.name}</h3>
                    {missing.length === 0 ? (
                      <Badge className="bg-emerald-600 text-white">
                        <Check /> Completa
                      </Badge>
                    ) : (
                      <Badge variant="outline">Falta {missing.length}</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {sqft > 0 ? `${formatNumber(sqft)} sq ft` : "sem medida"}
                    {area.currentFloor || area.newFloor
                      ? ` · ${area.currentFloor ? CURRENT_FLOOR_LABEL[area.currentFloor] : "?"} → ${area.newFloor ? NEW_FLOOR_LABEL[area.newFloor] : "?"}`
                      : ""}
                  </p>
                  {!open && missing.length > 0 && (
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                      Falta: {missing.join(", ")}
                    </p>
                  )}
                </div>
                {area.photos.length > 0 && (
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Camera className="size-3.5" />
                    {area.photos.length}
                  </span>
                )}
                <ChevronDown
                  className={`text-muted-foreground mt-0.5 size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="grid gap-6 border-t px-4 pt-5 pb-4">
                  <AreaEditor area={area} onChange={update} />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      className="h-12 px-4"
                      aria-label={`Excluir ${area.name}`}
                      onClick={() => {
                        setAreas((as) => as.filter((a) => a.id !== area.id));
                        setOpenId(null);
                      }}
                    >
                      <Trash2 />
                    </Button>
                    <Button className="h-12 flex-1 text-base" onClick={() => toggle(area.id)}>
                      Concluir {area.name}
                    </Button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </main>

      <BottomBar>
        <p className="text-muted-foreground text-center text-xs">
          {areas.length} área(s) · {formatNumber(totalSqFt)} sq ft no total
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-12 flex-1 text-base"
            onClick={() => setSummaryOpen(true)}
          >
            Itens gerados
          </Button>
          <Button className="h-12 flex-[1.4] text-base" onClick={() => setAddOpen(true)}>
            <Plus className="size-5" /> Nova área
          </Button>
        </div>
      </BottomBar>

      <NewAreaDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        usedNames={areas.map((a) => a.name)}
        onCreate={(name) => {
          const area = emptyArea(newId(), name);
          setAreas((as) => [...as, area]);
          setOpenId(area.id);
          setAddOpen(false);
        }}
      />
      <SummaryDrawer open={summaryOpen} onOpenChange={setSummaryOpen} lines={lines} />
    </div>
  );
}

function NewAreaDrawer({
  open,
  onOpenChange,
  usedNames,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usedNames: string[];
  onCreate: (name: string) => void;
}) {
  const [custom, setCustom] = useState("");
  const presets = AREA_PRESETS.filter((p) => !usedNames.includes(p));

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-lg">Qual área?</DrawerTitle>
        </DrawerHeader>
        <div className="grid gap-4 overflow-y-auto px-4 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <ChipGroup
            label="Área"
            options={presets.map((p) => ({ value: p, label: p }))}
            value={null}
            onChange={(v) => v && onCreate(v)}
          />
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (custom.trim()) {
                onCreate(custom.trim());
                setCustom("");
              }
            }}
          >
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Outro nome"
              className="bg-background h-12 flex-1 rounded-xl border px-3 text-base outline-none"
            />
            <Button type="submit" className="h-12 px-5 text-base" disabled={!custom.trim()}>
              Criar
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
