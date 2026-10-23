"use client";

import { Share, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** iPhone in Safari, not installed yet: iOS has no install prompt, so we explain the steps. */
function isIosBrowser(): boolean {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true);
  return ios && !standalone;
}

export function InstallHint() {
  const show = useSyncExternalStore(subscribe, isIosBrowser, () => false);
  const [dismissed, setDismissed] = useState(false);
  if (!show || dismissed) return null;

  return (
    <div className="bg-muted relative grid gap-1 rounded-2xl p-4 pr-12 text-sm">
      <p className="font-semibold">Instale no iPhone</p>
      <p className="text-muted-foreground">
        Toque em <Share className="inline size-4 align-text-bottom" aria-label="Compartilhar" /> e
        depois em <strong className="text-foreground">Adicionar à Tela de Início</strong>. Assim o
        formulário abre em tela cheia, como um app.
      </p>
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => setDismissed(true)}
        className="hover:bg-background absolute top-2 right-2 flex size-10 items-center justify-center rounded-full"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
