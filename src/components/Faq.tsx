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
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 [&>*]:min-w-0">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Dúvidas</p>
            <h2 className="mt-6 font-display text-4xl font-normal leading-[1.1] tracking-tightest text-balance sm:text-[2.9rem]">
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
                    className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-lg font-normal leading-snug text-ink">
                      {item.pergunta}
                    </span>
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-secondary transition-transform duration-300 ${
                        open ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <IconPlus className="h-4 w-4" />
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
                        <p className="max-w-xl pb-7 pr-10 text-[0.97rem] leading-relaxed text-ink-soft text-pretty">
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
