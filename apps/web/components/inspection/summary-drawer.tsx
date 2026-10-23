"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { getService } from "@/lib/inspection/catalog";
import { formatNumber, formatQuantity } from "@/lib/inspection/format";
import { deriveMaterials, totalsByService, type WorkLine } from "@/lib/inspection/materials";

/** What the AI/code would hand to the PM: services and the generic material list. */
export function SummaryDrawer({
  open,
  onOpenChange,
  lines,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: WorkLine[];
}) {
  const services = totalsByService(lines);
  const materials = deriveMaterials(lines);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-lg">Resumo do assessment</DrawerTitle>
        </DrawerHeader>
        <div className="grid gap-6 overflow-y-auto px-4 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <section>
            <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Serviços
            </h3>
            {services.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nada preenchido ainda.</p>
            ) : (
              <ul className="divide-y rounded-xl border">
                {services.map(({ serviceId, quantity }) => {
                  const service = getService(serviceId);
                  return (
                    <li key={serviceId} className="flex justify-between gap-3 px-3 py-2.5 text-sm">
                      <span>{service.name}</span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {formatQuantity(quantity, service.unit)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          <section>
            <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Lista de materiais
            </h3>
            {materials.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sem materiais.</p>
            ) : (
              <ul className="divide-y rounded-xl border">
                {materials.map((m) => (
                  <li key={m.key} className="px-3 py-2.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <span>{m.name}</span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {m.pending ? "a definir" : formatQuantity(m.total, m.unit)}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {m.pending
                        ? `${formatQuantity(m.measured, m.unit)} · consumo pelo guia (em aberto)`
                        : m.waste
                          ? `${formatQuantity(m.measured, m.unit)} + ${formatNumber(m.waste * 100)}% waste`
                          : "sem waste"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
