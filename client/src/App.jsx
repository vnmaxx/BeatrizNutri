import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Strip from "./components/Strip.jsx";
import Dores from "./components/Dores.jsx";
import Servicos from "./components/Servicos.jsx";
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
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Strip />
        <Dores />
        <Servicos />
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
