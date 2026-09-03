"use client";

import { motion } from "framer-motion";
import { IconArrowRight } from "./Icons";
import { whatsappLink } from "@/lib/whatsapp";
import type { HeroContent } from "@/lib/types";

interface HeroProps {
  hero: HeroContent;
  companyName: string;
  logoUrl: string | null;
  /** numero do cliente; define o destino do CTA. */
  whatsapp: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Hero em duas variantes, escolhidas por `hero/variante`:
 *
 * - `retrato` — texto a esquerda, retrato a direita sobre o papel.
 * - `tipografica` — composicao sobre a cor primaria, ancorada no logo.
 *
 * As duas sao completas: `content.ts` ja derruba `retrato` em `tipografica`
 * quando nao ha imagem, entao o site fica apresentavel antes de existir foto
 * e nao precisa de refatoracao quando ela chegar.
 */
export default function Hero({
  hero,
  companyName,
  logoUrl,
  whatsapp,
}: HeroProps) {
  const waLink = whatsappLink(whatsapp, hero.ctaWhatsappMessage);
  const ctaHref = waLink || "#contato";
  const ctaProps = waLink
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  /* ------------------------------------------------------------------ */
  /* Composicao tipografica sobre a primaria                             */
  /* ------------------------------------------------------------------ */

  if (hero.variante === "tipografica") {
    return (
      <section
        id="inicio"
        className="relative overflow-hidden bg-primary text-on-primary"
      >
        <div className="container-wide py-36 sm:py-44 lg:py-52">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-4xl"
          >
            {/* O logo e o unico elemento simbolico da pagina. */}
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={companyName}
                className="h-16 w-auto object-contain sm:h-20"
              />
            ) : (
              <p className="font-display text-2xl font-medium tracking-tight">
                {companyName}
              </p>
            )}

            <div
              className="mt-12 h-px w-24 bg-secondary"
              aria-hidden="true"
            />

            {hero.eyebrow && (
              <p className="mt-12 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-secondary">
                {hero.eyebrow}
              </p>
            )}

            <h1 className="mt-6 max-w-3xl font-display text-[2.75rem] font-normal leading-[1.06] tracking-tightest text-balance sm:text-6xl lg:text-[4.25rem]">
              {hero.title}
            </h1>

            {hero.subtitle && (
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-on-primary/75 text-pretty">
                {hero.subtitle}
              </p>
            )}

            <a
              href={ctaHref}
              {...ctaProps}
              className="group mt-12 inline-flex items-center gap-3 border-b border-secondary/50 pb-2 text-sm font-semibold uppercase tracking-[0.16em] text-secondary transition-colors hover:border-secondary"
            >
              {hero.ctaLabel}
              <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Retrato a direita                                                   */
  /* ------------------------------------------------------------------ */

  return (
    <section id="inicio" className="bg-paper pt-36 pb-24 sm:pt-44 lg:pb-32">
      <div className="container-wide">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>}

            <h1 className="mt-7 font-display text-[2.75rem] font-normal leading-[1.06] tracking-tightest text-balance text-ink sm:text-5xl lg:text-[3.75rem]">
              {hero.title}
            </h1>

            {hero.subtitle && (
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft text-pretty">
                {hero.subtitle}
              </p>
            )}

            <a
              href={ctaHref}
              {...ctaProps}
              className="group mt-12 inline-flex items-center gap-3 border-b border-secondary/50 pb-2 text-sm font-semibold uppercase tracking-[0.16em] text-secondary-strong transition-colors hover:border-secondary"
            >
              {hero.ctaLabel}
              <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Retrato — moldura reta, com um fio deslocado atrás */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="relative mx-auto w-full max-w-sm lg:max-w-md"
          >
            <div
              className="absolute -bottom-5 -right-5 h-full w-full border border-secondary/40"
              aria-hidden="true"
            />
            {hero.image && (
              <div className="relative overflow-hidden border border-line bg-paper-raised">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.image.url}
                  alt={hero.image.alt || companyName}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
