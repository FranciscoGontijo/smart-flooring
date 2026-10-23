"use client";

import { DEFAULT_WASTE, quantityWithWaste } from "@smart-flooring/shared";
import { Camera, Plus, Trash2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { areaSqFt, suggestedPerimeter, type Area, type Rect } from "@/lib/inspection/areas";
import {
  BASEBOARD_LABEL,
  CURRENT_FLOOR_LABEL,
  getService,
  installServiceId,
  MOISTURE_METHOD_LABEL,
  NEW_FLOOR_LABEL,
  PATTERN_LABEL,
  SUBFLOOR_LABEL,
} from "@/lib/inspection/catalog";
import { formatNumber, newId } from "@/lib/inspection/format";
import { ChipGroup, optionsFrom } from "./chip-group";
import { DecimalInput } from "./decimal-input";
import { Section } from "./section";
import { Stepper } from "./stepper";

const YES_NO = [
  { value: "yes", label: "Sim" },
  { value: "no", label: "Não" },
] as const;

export function AreaEditor({ area, onChange }: { area: Area; onChange: (area: Area) => void }) {
  const set = <K extends keyof Area>(key: K, value: Area[K]) => onChange({ ...area, [key]: value });
  const sqft = areaSqFt(area);
  const perimeter = suggestedPerimeter(area);

  const install = area.newFloor ? getService(installServiceId(area.newFloor, area.pattern)) : null;
  const waste = install?.waste ? DEFAULT_WASTE[install.waste] : null;

  return (
    <div className="grid gap-7">
      <Section title="Medidas" hint={sqft > 0 ? `${formatNumber(sqft)} sq ft` : undefined}>
        <ChipGroup
          size="sm"
          label="Como medir"
          options={[
            { value: "rects", label: "Comprimento × largura" },
            { value: "total", label: "Digitar sq ft" },
          ]}
          value={area.measureMode}
          onChange={(v) => v && set("measureMode", v)}
        />
        {area.measureMode === "rects" ? (
          <RectList rects={area.rects} onChange={(rects) => set("rects", rects)} />
        ) : (
          <DecimalInput
            label="Área total"
            unit="sq ft"
            value={area.totalSqFt}
            onChange={(v) => set("totalSqFt", v)}
          />
        )}
      </Section>

      <Section title="Piso atual">
        <ChipGroup
          label="Piso atual"
          options={optionsFrom(CURRENT_FLOOR_LABEL)}
          value={area.currentFloor}
          onChange={(v) => set("currentFloor", v)}
        />
        {area.currentFloor && area.currentFloor !== "concrete" && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px]">Remover o piso atual?</span>
            <ChipGroup
              size="sm"
              label="Remover o piso atual"
              options={[...YES_NO]}
              value={area.removeCurrent ? "yes" : "no"}
              onChange={(v) => set("removeCurrent", v === "yes")}
            />
          </div>
        )}
      </Section>

      <Section
        title="Piso novo"
        hint={
          waste !== null && sqft > 0
            ? `${formatNumber(waste * 100)}% waste → ${formatNumber(quantityWithWaste(sqft, waste))} sq ft`
            : undefined
        }
      >
        <ChipGroup
          label="Piso novo"
          options={optionsFrom(NEW_FLOOR_LABEL)}
          value={area.newFloor}
          onChange={(v) => set("newFloor", v)}
        />
        {area.newFloor && (
          <ChipGroup
            size="sm"
            label="Paginação"
            options={optionsFrom(PATTERN_LABEL)}
            value={area.pattern}
            onChange={(v) => v && set("pattern", v)}
          />
        )}
      </Section>

      <Section title="Contrapiso">
        <ChipGroup
          label="Contrapiso"
          options={optionsFrom(SUBFLOOR_LABEL)}
          value={area.subfloor}
          onChange={(v) => set("subfloor", v)}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15px]">Precisa nivelar?</span>
          <ChipGroup
            size="sm"
            label="Precisa nivelar"
            options={[...YES_NO]}
            value={area.leveling ? "yes" : "no"}
            onChange={(v) => set("leveling", v === "yes")}
          />
        </div>
        {area.leveling && (
          <DecimalInput
            label="Área a nivelar"
            unit="sq ft a nivelar"
            placeholder={sqft > 0 ? formatNumber(sqft) : "0"}
            value={area.levelingSqFt}
            onChange={(v) => set("levelingSqFt", v)}
          />
        )}
      </Section>

      <Section title="Acabamento">
        <div className="grid gap-2">
          <span className="text-[15px]">Rodapé (baseboard)</span>
          <ChipGroup
            size="sm"
            label="Rodapé"
            options={optionsFrom(BASEBOARD_LABEL)}
            value={area.baseboard}
            onChange={(v) => v && set("baseboard", v)}
          />
          {area.baseboard !== "keep" && (
            <LinearField
              label="Rodapé"
              value={area.baseboardLf}
              suggestion={perimeter}
              onChange={(v) => set("baseboardLf", v)}
            />
          )}
        </div>
        <div className="grid gap-2">
          <span className="text-[15px]">Quarter round</span>
          <LinearField
            label="Quarter round"
            value={area.quarterRoundLf}
            suggestion={perimeter}
            onChange={(v) => set("quarterRoundLf", v)}
          />
        </div>
        <Stepper
          label="Transições"
          value={area.transitions}
          onChange={(v) => set("transitions", v)}
        />
        <Stepper label="Degraus" value={area.stairs} onChange={(v) => set("stairs", v)} />
      </Section>

      <Section title="Umidade" hint="opcional">
        <ChipGroup
          size="sm"
          label="Método"
          allowDeselect
          options={optionsFrom(MOISTURE_METHOD_LABEL)}
          value={area.moistureMethod}
          onChange={(v) => set("moistureMethod", v)}
        />
        {area.moistureMethod && (
          <DecimalInput
            label="Leitura"
            unit={area.moistureMethod === "calcium" ? "lbs" : "%"}
            value={area.moistureReading}
            onChange={(v) => set("moistureReading", v)}
          />
        )}
      </Section>

      <Section title="Fotos" hint={area.photos.length ? `${area.photos.length}` : undefined}>
        <Photos photos={area.photos} onChange={(photos) => set("photos", photos)} />
      </Section>

      <Section title="Observações">
        <Textarea
          value={area.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="O que o PM ou o instalador precisa saber"
          className="min-h-20 text-base"
        />
      </Section>
    </div>
  );
}

function RectList({ rects, onChange }: { rects: Rect[]; onChange: (rects: Rect[]) => void }) {
  const update = (id: string, patch: Partial<Rect>) =>
    onChange(rects.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="grid gap-2">
      {rects.map((rect, index) => (
        <div key={rect.id} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
          <DecimalInput
            label={`Comprimento ${index + 1}`}
            unit="ft"
            value={rect.length}
            onChange={(v) => update(rect.id, { length: v })}
          />
          <span className="text-muted-foreground">×</span>
          <DecimalInput
            label={`Largura ${index + 1}`}
            unit="ft"
            value={rect.width}
            onChange={(v) => update(rect.id, { width: v })}
          />
          {rects.length > 1 ? (
            <button
              type="button"
              aria-label={`Remover retângulo ${index + 1}`}
              onClick={() => onChange(rects.filter((r) => r.id !== rect.id))}
              className="text-muted-foreground hover:bg-muted flex size-11 items-center justify-center rounded-full"
            >
              <X className="size-4" />
            </button>
          ) : (
            <span className="w-0" />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rects, { id: newId(), length: null, width: null }])}
        className="text-primary flex w-max items-center gap-1 text-sm font-medium"
      >
        <Plus className="size-4" /> Somar outro retângulo (área em L)
      </button>
    </div>
  );
}

function LinearField({
  label,
  value,
  suggestion,
  onChange,
}: {
  label: string;
  value: number | null;
  suggestion: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <DecimalInput label={label} unit="lf" value={value} onChange={onChange} />
      {suggestion !== null && value !== suggestion && (
        <button
          type="button"
          onClick={() => onChange(suggestion)}
          className="text-primary w-max text-sm font-medium"
        >
          Usar perímetro: {formatNumber(suggestion)} lf
        </button>
      )}
    </div>
  );
}

function Photos({ photos, onChange }: { photos: string[]; onChange: (photos: string[]) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((url) => (
        <div key={url} className="relative aspect-square overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL, nothing to optimize */}
          <img src={url} alt="" className="size-full object-cover" />
          <button
            type="button"
            aria-label="Remover foto"
            onClick={() => {
              URL.revokeObjectURL(url);
              onChange(photos.filter((p) => p !== url));
            }}
            className="absolute top-1 right-1 flex size-8 items-center justify-center rounded-full bg-black/60 text-white"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <label className="text-muted-foreground hover:bg-muted flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed text-xs">
        <Camera className="size-6" />
        Tirar foto
        <input
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="sr-only"
          onChange={(e) => {
            const files = [...(e.target.files ?? [])];
            onChange([...photos, ...files.map((f) => URL.createObjectURL(f))]);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
