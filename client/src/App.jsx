import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Journey from "./components/Journey.jsx";
import Strip from "./components/Strip.jsx";
import Dores from "./components/Dores.jsx";
import Metodo from "./components/Metodo.jsx";
import Especialidades from "./components/Especialidades.jsx";
import ComoFunciona from "./components/ComoFunciona.jsx";
import Sobre from "./components/Sobre.jsx";
import Depoimentos from "./components/Depoimentos.jsx";
import Contato from "./components/Contato.jsx";
import CtaBand from "./components/CtaBand.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import ChatWidget from "./components/ChatWidget.jsx";

export default function App() {
  // Smooth scroll (Lenis) — desligado se o usuário pediu "reduzir movimento".
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.6 });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Animação de revelação ao rolar — aplicada globalmente para não tocar cada seção.
  useLayoutEffect(() => {
    const sel =
      ".sec-head, .dor, .card, .metodo-card, .passo, .depo, .sobre-grid > *, .cta-band, .faq-list details, .strip span";
    const els = Array.from(document.querySelectorAll(sel));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Journey />
        <Strip />
        <Dores />
        <Metodo />
        <Especialidades />
        <ComoFunciona />
        <Sobre />
        <Depoimentos />
        <Contato />
        <CtaBand />
        <Faq />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ChatWidget />
    </>
  );
}
