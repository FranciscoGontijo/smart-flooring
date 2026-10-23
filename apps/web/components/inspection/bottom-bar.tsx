import type { ReactNode } from "react";

/** Fixed action bar within thumb reach, above the iPhone home indicator. */
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/80 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur">
      <div className="mx-auto grid max-w-md gap-2 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        {children}
      </div>
    </div>
  );
}
