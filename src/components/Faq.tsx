"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconPlus } from "./Icons";
import type { FaqContent } from "@/lib/types";

interface FaqProps {
  faq: FaqContent;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Perguntas frequentes — acordeao em fios, uma resposta aberta por vez.
 * Nao renderiza nada enquanto a lista estiver vazia.
 */
export default function Faq({ faq }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faq.items.length === 0) return null;

  return (
    <section id="faq" className="bg-primary-soft py-28 sm:py-36">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 [&>*]:min-w-0">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Dúvidas</p>
            <h2 className="titulo-secao">
              {faq.title}
            </h2>
          </div>

          <div className="flex flex-col">
            {faq.items.map((item, index) => {
              const open = openIndex === index;
              return (
                <div
                  key={`${item.pergunta}-${index}`}
                  className="border-t border-line last:border-b"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-start justify-between gap-8 py-7 text-left"
                  >
                    <span className="font-display text-xl font-normal leading-snug text-ink lg:text-[1.4rem]">
                      {item.pergunta}
                    </span>
                    <span
                      className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center text-secondary transition-transform duration-300 ${
                        open ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <IconPlus className="h-5 w-5" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, ease: EASE }}
                        className="overflow-hidden"
                      >
                        {/* Justificado a pedido da cliente. O que segura os
                            rios: hifenizacao (a pagina e `lang="pt-BR"`),
                            coluna de ~70 caracteres (`max-w-[42rem]`) e
                            entrelinha folgada. Coluna mais larga que isso
                            cansa; mais estreita, abre buraco entre palavras. */}
                        <p className="max-w-[42rem] pb-8 pr-12 text-justify text-lg leading-[1.75] text-ink-soft hyphens-auto">
                          {item.resposta}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
