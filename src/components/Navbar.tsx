"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { NavLink } from "@/lib/types";

interface NavbarProps {
  companyName: string;
  logoUrl: string | null;
  /** so as ancoras de secoes que realmente renderizaram. */
  links: NavLink[];
}

/**
 * Navbar fixa para um hero claro: transparente no topo, ganha fundo de papel
 * com blur ao rolar. O texto e sempre escuro. Inclui menu mobile animado.
 */
export default function Navbar({ companyName, logoUrl, links }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava a rolagem do body enquanto o menu mobile esta aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-wide flex h-20 items-center justify-between">
        <a
          href="#inicio"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5"
          aria-label={`${companyName} — ir para o topo`}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={companyName}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              {companyName}
            </span>
          )}
        </a>

        {/* Links — desktop */}
        <div className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="#contato"
            className="bg-primary px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-on-primary transition-colors hover:bg-primary-strong"
          >
            Entrar em contato
          </a>
        </div>

        {/* Hamburguer — mobile */}
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
        >
          <div className="flex flex-col items-end gap-[5px]">
            <span
              className={`block h-0.5 rounded-full bg-ink transition-all duration-300 ${
                open ? "w-6 translate-y-[7px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`block h-0.5 w-4 rounded-full bg-ink transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 rounded-full bg-ink transition-all duration-300 ${
                open ? "w-6 -translate-y-[7px] -rotate-45" : "w-5"
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Painel — mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-paper md:hidden"
          >
            <div className="container-wide flex flex-col py-4">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * index + 0.08 }}
                  className="border-b border-line/70 py-3.5 font-display text-lg font-normal text-ink"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contato"
                onClick={() => setOpen(false)}
                className="mt-4 bg-primary px-5 py-3.5 text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-on-primary"
              >
                Entrar em contato
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
