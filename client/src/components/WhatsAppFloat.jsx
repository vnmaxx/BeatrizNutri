import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { whatsappLink } from "../config.js";

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={whatsappLink()}
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
}
