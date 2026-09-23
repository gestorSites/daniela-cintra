"use client";

import { motion } from "framer-motion";
import { IconArrowRight, IconWhatsapp } from "./Icons";
import { whatsappLink } from "@/lib/whatsapp";
import type { HeroContent } from "@/lib/types";

interface HeroProps {
  hero: HeroContent;
  companyName: string;
  /** numero do cliente; define o destino do CTA. */
  whatsapp: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Hero em duas variantes, escolhidas por `hero/variante`:
 *
 * - `retrato` — texto a esquerda, retrato a direita sobre o papel.
 * - `tipografica` — texto a esquerda sobre a cor primaria, o simbolo da marca
 *   ocupando a coluna da direita.
 *
 * As duas sao completas: `content.ts` ja derruba `retrato` em `tipografica`
 * quando nao ha imagem, entao o site fica apresentavel antes de existir foto
 * e nao precisa de refatoracao quando ela chegar.
 *
 * **Sem logo no corpo do hero**, nas duas: o logo mora so na Navbar, maior.
 * (A cliente pediu; dois logos empilhados no primeiro viewport disputavam o
 * titulo.) As duas colunas existem para o hero ocupar a largura inteira em
 * vez de deixar a metade direita vazia.
 */
export default function Hero({ hero, companyName, whatsapp }: HeroProps) {
  const waLink = whatsappLink(whatsapp, hero.ctaWhatsappMessage);
  const ctaHref = waLink || "#contato";
  const ctaProps = waLink
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  // Botao cheio, grande: e a acao principal da pagina. O icone diz o canal
  // quando ha WhatsApp; sem ele, a seta leva ao #contato.
  const cta = (cores: string) => (
    <a
      href={ctaHref}
      {...ctaProps}
      className={`group mt-12 inline-flex items-center gap-4 px-9 py-5 text-[0.95rem] font-semibold uppercase tracking-[0.14em] transition-colors sm:text-base ${cores}`}
    >
      {waLink && <IconWhatsapp className="h-6 w-6" />}
      {hero.ctaLabel}
      {!waLink && (
        <IconArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </a>
  );

  /* ------------------------------------------------------------------ */
  /* Composicao tipografica sobre a primaria                             */
  /* ------------------------------------------------------------------ */

  if (hero.variante === "tipografica") {
    return (
      <section
        id="inicio"
        className="relative overflow-hidden bg-primary text-on-primary"
      >
        <div className="container-wide pb-24 pt-32 sm:pb-28 sm:pt-36 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-24 lg:pt-32">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative z-10"
            >
              <div className="h-px w-24 bg-secondary" aria-hidden="true" />

              {hero.eyebrow && (
                <p className="mt-10 text-[0.8125rem] font-semibold uppercase tracking-[0.22em] text-secondary sm:text-sm">
                  {hero.eyebrow}
                </p>
              )}

              {/* `text-pretty`, nao `text-balance`: titulo em caixa alta e
                  longo — equilibrar as linhas encurta todas e empurra o CTA
                  para baixo da dobra. */}
              <h1 className="mt-7 font-display text-[2.3rem] font-normal leading-[1.05] tracking-tightest text-pretty sm:text-6xl lg:text-[4.1rem] xl:text-[4.5rem]">
                {hero.title}
              </h1>

              {hero.subtitle && (
                <p className="mt-9 max-w-3xl text-lg leading-relaxed text-on-primary/80 text-pretty sm:text-xl lg:text-[1.35rem]">
                  {hero.subtitle}
                </p>
              )}

              {cta("bg-on-primary text-primary hover:bg-on-primary/90")}
            </motion.div>

            {/* Simbolo da marca na coluna da direita — o unico elemento
                figurativo do hero tipografico, dimensionado pela coluna. A
                versao `-quadrado` e o simbolo recortado justo; a outra tem
                margem transparente e renderizaria menor que a coluna. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
              className="pointer-events-none hidden justify-center lg:flex"
              aria-hidden="true"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marca/simbolo-branco-quadrado.svg"
                alt=""
                className="w-full max-w-[34rem] opacity-[0.16]"
              />
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Retrato a direita                                                   */
  /* ------------------------------------------------------------------ */

  return (
    <section id="inicio" className="bg-paper pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-40">
      <div className="container-wide">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>}

            <h1 className="mt-8 font-display text-[2.3rem] font-normal leading-[1.04] tracking-tightest text-balance text-ink sm:text-6xl lg:text-[4rem] xl:text-[4.4rem]">
              {hero.title}
            </h1>

            {hero.subtitle && (
              <p className="mt-9 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty sm:text-xl lg:text-[1.3rem]">
                {hero.subtitle}
              </p>
            )}

            {cta("bg-primary text-on-primary hover:bg-primary-strong")}
          </motion.div>

          {/* Retrato — moldura reta, com um fio deslocado atrás */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="relative mx-auto w-full max-w-md lg:max-w-xl"
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
