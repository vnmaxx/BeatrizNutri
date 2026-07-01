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
