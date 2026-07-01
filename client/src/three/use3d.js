import { useEffect, useRef, useState } from "react";

// Pode renderizar WebGL? (suporte + respeita "reduzir movimento")
export function useCanRender3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setOk(!!gl && !reduced);
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

// Desktop? (WebGL pesado só no desktop — no mobile/3G usamos fallback 2D)
export function useIsDesktop(min = 820) {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${min}px)`);
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [min]);
  return desktop;
}

// Dispara uma vez quando o elemento entra (ou se aproxima) da viewport.
export function useInView(rootMargin = "240px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
}
