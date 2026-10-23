"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js, which keeps the inspector's form working with a weak or no signal
 * at the job site. Production only: in development it would cache stale dev bundles.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((err) => console.error("Service worker registration failed", err));
  }, []);

  return null;
}
