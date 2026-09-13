import { FaWhatsapp } from "react-icons/fa6";
import { getWhatsAppLink } from "@/lib/repository/social";

export async function WhatsAppButton() {
  const whatsapp = await getWhatsAppLink();
  if (!whatsapp) return null;

  return (
    <a
      href={whatsapp.href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(37,211,102,0.35)] transition hover:bg-[#1ebe57] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <FaWhatsapp className="h-5 w-5" aria-hidden />
      WhatsApp
    </a>
  );
}
