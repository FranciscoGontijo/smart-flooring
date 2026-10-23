"use client";

import { ChevronRight, Ruler, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import {
  AREA_PRESETS,
  CATEGORY_LABEL,
  FREQUENT_SERVICE_IDS,
  getService,
  SERVICES,
  UNIT_LABEL,
  type Service,
  type ServiceCategory,
} from "@/lib/inspection/catalog";
import { formatNumber } from "@/lib/inspection/format";
import type { Line } from "@/lib/inspection/lines";
import { ChipGroup, optionsFrom } from "./chip-group";
import { DecimalInput } from "./decimal-input";

export type LineDraft = Omit<Line, "id">;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null: new line. */
  initial: Line | null;
  /** Area of the last saved line, so a sequence of lines in the same room is fast. */
  lastArea?: string;
  knownAreas: string[];
  onSave: (draft: LineDraft, addAnother: boolean) => void;
  onDelete?: () => void;
};

export function LineEditor(props: Props) {
  // Remount on every open so the form starts clean (or from the line being edited).
  const [session, setSession] = useState(0);
  const [wasOpen, setWasOpen] = useState(props.open);
  if (props.open !== wasOpen) {
    setWasOpen(props.open);
    if (props.open) setSession((s) => s + 1);
  }

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange} showSwipeHandle>
      <DrawerContent>
        <LineEditorBody key={session} {...props} />
      </DrawerContent>
    </Drawer>
  );
}

function LineEditorBody({ initial, lastArea, knownAreas, onSave, onDelete }: Props) {
  const [serviceId, setServiceId] = useState<string | null>(initial?.serviceId ?? null);
  const [picking, setPicking] = useState(initial === null);
  const [area, setArea] = useState<string | null>(initial?.area ?? lastArea ?? null);
  const [quantity, setQuantity] = useState<number | null>(initial?.quantity ?? null);
  const [note, setNote] = useState(initial?.note ?? "");
  // Bump to reset the form for "save and add another" without closing the drawer.
  const [round, setRound] = useState(0);

  if (picking || !serviceId) {
    return (
      <ServicePicker
        onPick={(id) => {
          setServiceId(id);
          setPicking(false);
        }}
      />
    );
  }

  const service = getService(serviceId);
  const canSave = quantity !== null && quantity > 0;

  const save = (addAnother: boolean) => {
    if (!canSave) return;
    onSave(
      { serviceId, area: area ?? undefined, quantity, note: note.trim() || undefined },
      addAnother,
    );
    if (addAnother) {
      setServiceId(null);
      setPicking(true);
      setQuantity(null);
      setNote("");
      setRound((r) => r + 1);
    }
  };

  return (
    <>
      <DrawerHeader className="text-left">
        <DrawerTitle className="text-lg">{initial ? "Editar linha" : "Nova linha"}</DrawerTitle>
      </DrawerHeader>
      <div key={round} className="grid gap-6 overflow-y-auto px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="hover:bg-muted flex items-center gap-3 rounded-xl border p-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-xs">{CATEGORY_LABEL[service.category]}</p>
            <p className="font-semibold">{service.name}</p>
          </div>
          <span className="text-primary text-sm font-medium">Trocar</span>
        </button>

        <div className="grid gap-2">
          <span className="text-sm font-semibold">Quantidade</span>
          <DecimalInput
            size="lg"
            label="Quantidade"
            unit={UNIT_LABEL[service.unit]}
            value={quantity}
            onChange={setQuantity}
          />
          {service.unit === "sq_ft" && <AreaCalculator onUse={setQuantity} />}
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-semibold">Área</span>
          <AreaPicker value={area} onChange={setArea} knownAreas={knownAreas} />
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            Observação <span className="text-muted-foreground font-normal">(opcional)</span>
          </span>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex.: desnível perto da porta"
            className="min-h-20 text-base"
          />
        </label>
      </div>
      <div className="grid gap-2 border-t px-4 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {initial ? (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="h-12 px-4"
              onClick={onDelete}
              aria-label="Excluir linha"
            >
              <Trash2 />
            </Button>
            <Button
              className="h-12 flex-1 text-base"
              disabled={!canSave}
              onClick={() => save(false)}
            >
              Salvar
            </Button>
          </div>
        ) : (
          <>
            <Button className="h-12 text-base" disabled={!canSave} onClick={() => save(true)}>
              Salvar e adicionar outra
            </Button>
            <Button
              variant="ghost"
              className="h-11 text-base"
              disabled={!canSave}
              onClick={() => save(false)}
            >
              Salvar e fechar
            </Button>
          </>
        )}
      </div>
    </>
  );
}

function ServicePicker({ onPick }: { onPick: (serviceId: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ServiceCategory | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = SERVICES.filter(
    (s) => (!category || s.category === category) && (!q || s.name.toLowerCase().includes(q)),
  );
  const showFrequent = !q && !category;
  const frequent = FREQUENT_SERVICE_IDS.map(getService);

  return (
    <>
      <DrawerHeader className="text-left">
        <DrawerTitle className="text-lg">Qual serviço?</DrawerTitle>
      </DrawerHeader>
      <div className="grid gap-3 px-4 pt-3">
        <label className="bg-muted flex h-12 items-center gap-2 rounded-xl px-3">
          <Search className="text-muted-foreground size-5" />
          <span className="sr-only">Buscar serviço</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar: carpet, tile, quarter…"
            className="w-full bg-transparent text-base outline-none"
            enterKeyHint="search"
          />
        </label>
        <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          <div className="w-max">
            <ChipGroup
              size="sm"
              label="Categoria"
              allowDeselect
              options={optionsFrom(CATEGORY_LABEL)}
              value={category}
              onChange={setCategory}
            />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto px-4 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {showFrequent && <ServiceList title="Mais usados" services={frequent} onPick={onPick} />}
        <ServiceList
          title={showFrequent ? "Todos" : `${filtered.length} resultado(s)`}
          services={showFrequent ? SERVICES : filtered}
          onPick={onPick}
        />
      </div>
    </>
  );
}

function ServiceList({
  title,
  services,
  onPick,
}: {
  title: string;
  services: Service[];
  onPick: (id: string) => void;
}) {
  return (
    <section className="mb-4">
      <h3 className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
        {title}
      </h3>
      <ul className="divide-y">
        {services.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onPick(s.id)}
              className="hover:bg-muted flex min-h-12 w-full items-center gap-3 py-2 text-left"
            >
              <span className="flex-1 text-[15px]">{s.name}</span>
              <span className="text-muted-foreground text-xs">{UNIT_LABEL[s.unit]}</span>
              <ChevronRight className="text-muted-foreground size-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AreaPicker({
  value,
  onChange,
  knownAreas,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  knownAreas: string[];
}) {
  const [showAll, setShowAll] = useState(false);
  const [custom, setCustom] = useState("");
  const options = showAll
    ? [...new Set([...knownAreas, ...AREA_PRESETS, ...(value ? [value] : [])])]
    : [...new Set([...knownAreas, ...(value ? [value] : [])])];

  return (
    <div className="grid gap-2">
      <ChipGroup
        size="sm"
        label="Área"
        allowDeselect
        options={options.map((a) => ({ value: a, label: a }))}
        value={value}
        onChange={onChange}
      />
      {!showAll ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-primary w-max text-sm font-medium"
        >
          + Outra área
        </button>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (custom.trim()) {
              onChange(custom.trim());
              setCustom("");
            }
          }}
        >
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Nome da área"
            className="bg-background h-11 flex-1 rounded-xl border px-3 text-base outline-none"
          />
          <Button type="submit" variant="outline" className="h-11">
            Usar
          </Button>
        </form>
      )}
    </div>
  );
}

/** Length × width helper so the inspector doesn't do the math by hand. */
function AreaCalculator({ onUse }: { onUse: (sqft: number) => void }) {
  const [open, setOpen] = useState(false);
  const [length, setLength] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const result = length && width ? Math.round(length * width * 10) / 10 : null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-primary flex w-max items-center gap-1.5 text-sm font-medium"
      >
        <Ruler className="size-4" /> Calcular comprimento × largura
      </button>
    );
  }
  return (
    <div className="bg-muted/60 grid gap-2 rounded-xl p-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <DecimalInput label="Comprimento" unit="ft" value={length} onChange={setLength} />
        <span className="text-muted-foreground">×</span>
        <DecimalInput label="Largura" unit="ft" value={width} onChange={setWidth} />
      </div>
      <Button
        variant="outline"
        className="h-11"
        disabled={!result}
        onClick={() => {
          if (!result) return;
          onUse(result);
          setOpen(false);
        }}
      >
        {result ? `Usar ${formatNumber(result)} sq ft` : "Informe as duas medidas"}
      </Button>
    </div>
  );
}
