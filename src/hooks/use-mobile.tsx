import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Server-side rendering safe default
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // single handler that uses the event's matches value
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : (e as MediaQueryList).matches;
      setIsMobile(Boolean(matches));
    };

    // initialize from the MediaQueryList (more accurate than window.innerWidth on some platforms)
    setIsMobile(mql.matches);

    // add listener with modern / legacy fallbacks
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler as (ev: Event) => void);
    } else if (typeof (mql as any).addListener === "function") {
      (mql as any).addListener(handler);
    }

    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", handler as (ev: Event) => void);
      } else if (typeof (mql as any).removeListener === "function") {
        (mql as any).removeListener(handler);
      }
    };
  }, []);

  return isMobile;
}
