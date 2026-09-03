"use client";

import { motion } from "framer-motion";
import { IconWhatsapp } from "./Icons";
import { whatsappLink } from "@/lib/whatsapp";

interface WhatsappButtonProps {
  whatsapp: string;
  message: string;
}

/**
 * Botao flutuante de WhatsApp, fixo no canto inferior direito.
 * Nao renderiza nada quando o cliente nao tem numero cadastrado.
 */
export default function WhatsappButton({
  whatsapp,
  message,
}: WhatsappButtonProps) {
  const link = whatsappLink(whatsapp, message);
  if (!link) return null;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[#25d366] py-3.5 pl-3.5 pr-4 text-white shadow-lift transition-transform duration-200 hover:-translate-y-0.5"
    >
      <span className="relative flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/40 [animation-duration:2.4s]" />
        <IconWhatsapp className="relative h-7 w-7" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[12rem] group-hover:opacity-100">
        Falar no WhatsApp
      </span>
    </motion.a>
  );
}
