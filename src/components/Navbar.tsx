"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconWhatsapp } from "./Icons";
import { formatPhoneBR, whatsappLink } from "@/lib/whatsapp";
import type { NavLink } from "@/lib/types";

interface NavbarProps {
  companyName: string;
  logoUrl: string | null;
  logoEscuroUrl: string | null;
  /**
   * O que fica ATRAS da barra no topo e escuro? Verdadeiro com o Hero
   * `tipografica` (`bg-primary`), falso com o `retrato` (`bg-paper`). Sem
   * isso a barra herda as cores de um fundo que pode nao existir.
   */
  topoEscuro: boolean;
  /** so as ancoras de secoes que realmente renderizaram. */
  links: NavLink[];
  /** numero do cliente — vira o CTA da barra (icone + numero). */
  whatsapp: string;
  whatsappMessage: string;
}

/**
 * Navbar fixa: transparente no topo, ganha fundo de papel com blur ao rolar.
 * As cores acompanham o que esta atras dela (`topoEscuro`). Menu em caixa
 * alta distribuido no meio da barra; o CTA e o numero do WhatsApp. Abaixo de
 * `lg` vira hamburguer — com cinco itens, o logo maior e o numero, a linha
 * nao cabe num tablet.
 */
export default function Navbar({
  companyName,
  logoUrl,
  logoEscuroUrl,
  topoEscuro,
  links,
  whatsapp,
  whatsappMessage,
}: NavbarProps) {
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

  // A barra so e escura por tras enquanto esta transparente sobre um topo
  // escuro. Assim que ganha `bg-paper`, o fundo dela e claro — e foi ai que o
  // logo branco sumia.
  const sobreFundoEscuro = !solid && topoEscuro;

  // Logo da vez: claro sobre escuro, escuro sobre claro. Sem a variante certa,
  // texto — nunca a variante errada.
  const logoDaVez = sobreFundoEscuro ? logoUrl : logoEscuroUrl;
  const barra = sobreFundoEscuro ? "bg-on-primary" : "bg-ink";

  // CTA: o proprio numero, com o icone do WhatsApp — e o canal que o
  // visitante vai usar, entao ele aparece em vez de um "entre em contato".
  // Sem numero cadastrado, volta ao rotulo generico apontando para #contato.
  const waLink = whatsappLink(whatsapp, whatsappMessage);
  const numero = formatPhoneBR(whatsapp);
  const cta = waLink
    ? {
        href: waLink,
        external: true,
        label: numero,
        aria: `Conversar pelo WhatsApp: ${numero}`,
      }
    : { href: "#contato", external: false, label: "Entrar em contato", aria: undefined };
  const ctaExterno = cta.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-wide flex h-20 items-center justify-between gap-10 lg:h-24">
        <a
          href="#inicio"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${companyName} — ir para o topo`}
        >
          {logoDaVez ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoDaVez}
              alt={companyName}
              className="h-11 w-auto object-contain sm:h-12 lg:h-16"
            />
          ) : (
            <span
              className={`font-display text-xl font-semibold tracking-tight ${
                sobreFundoEscuro ? "text-on-primary" : "text-ink"
              }`}
            >
              {companyName}
            </span>
          )}
        </a>

        {/* Links — desktop. Ocupam o meio da barra inteiro, distribuidos, em
            vez de se amontoarem ao lado do botao. */}
        <div className="hidden flex-1 items-center justify-center gap-10 lg:flex xl:gap-14">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative text-[0.8125rem] font-medium uppercase tracking-[0.18em] transition-colors xl:text-sm ${
                sobreFundoEscuro
                  ? "text-on-primary/75 hover:text-on-primary"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <a
          href={cta.href}
          {...ctaExterno}
          aria-label={cta.aria}
          className={`hidden shrink-0 items-center gap-3 px-6 py-3.5 text-[0.95rem] font-semibold tabular-nums tracking-[0.04em] transition-colors lg:inline-flex ${
            sobreFundoEscuro
              ? "bg-on-primary text-primary hover:bg-on-primary/90"
              : "bg-primary text-on-primary hover:bg-primary-strong"
          }`}
        >
          {cta.external && <IconWhatsapp className="h-5 w-5" />}
          {cta.label}
        </a>

        {/* Hamburguer — mobile */}
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <div className="flex flex-col items-end gap-[5px]">
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 ${barra} ${
                open ? "w-6 translate-y-[7px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`block h-0.5 w-4 rounded-full transition-all duration-300 ${barra} ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 ${barra} ${
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
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
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
                  className="border-b border-line/70 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ink"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={cta.href}
                {...ctaExterno}
                aria-label={cta.aria}
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex items-center justify-center gap-3 bg-primary px-5 py-4 text-base font-semibold tabular-nums tracking-[0.04em] text-on-primary"
              >
                {cta.external && <IconWhatsapp className="h-5 w-5" />}
                {cta.label}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
