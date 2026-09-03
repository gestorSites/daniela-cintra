"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { AtendimentoContent } from "@/lib/types";

interface AtendimentoProps {
  atendimento: AtendimentoContent;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Passos do primeiro contato. Aqui a numeracao e sequencia de verdade — a
 * ordem carrega informacao —, entao os passos correm sobre um fio continuo,
 * com um risco na cor de acento marcando cada etapa. A secao de areas, cuja
 * ordem e so indice, nao tem esse fio.
 */
export default function Atendimento({ atendimento }: AtendimentoProps) {
  const stepsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stepsRef, { once: true, margin: "0px 0px -14% 0px" });

  if (atendimento.items.length === 0) return null;

  return (
    <section id="atendimento" className="py-28 sm:py-36">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Primeiro contato</p>
          <h2 className="mt-6 font-display text-4xl font-normal leading-[1.1] tracking-tightest text-balance sm:text-5xl">
            {atendimento.title}
          </h2>
          {atendimento.intro && (
            <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft text-pretty">
              {atendimento.intro}
            </p>
          )}
        </div>

        <div ref={stepsRef} className="mt-16">
          <ol className="grid gap-12 sm:grid-cols-3 sm:gap-0 [&>*]:min-w-0">
            {atendimento.items.map((item, index) => (
              <motion.li
                key={`${item.titulo}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
                className={`relative border-t border-line pt-9 ${
                  index > 0 ? "sm:pl-10" : "sm:pr-10"
                }`}
              >
                {/* Risco de acento sobre o fio, marcando a etapa */}
                <span
                  className={`absolute -top-px h-px w-10 bg-secondary ${
                    index > 0 ? "left-0 sm:left-10" : "left-0"
                  }`}
                  aria-hidden="true"
                />

                <span className="block font-display text-2xl font-normal leading-none tabular-nums text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-7 font-display text-xl font-normal leading-tight text-ink">
                  {item.titulo}
                </h3>
                {item.descricao && (
                  <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft text-pretty">
                    {item.descricao}
                  </p>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
