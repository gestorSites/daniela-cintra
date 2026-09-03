"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { AreasContent } from "@/lib/types";

interface AreasProps {
  areas: AreasContent;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Areas de atuacao: blocos enumerados, separados por fio. Sem icone e sem
 * cartao — a hierarquia e toda tipografica.
 *
 * A numeracao aqui e indice, nao sequencia: por isso nao ha fio conector
 * entre os blocos, ao contrario da secao de atendimento.
 *
 * "Especialista em" so aparece com a flag afirmativa; o contrario e
 * "Atuacao em". Usar o rotulo sem especializacao real e vedado pela OAB.
 */
export default function Areas({ areas }: AreasProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "0px 0px -12% 0px" });

  if (areas.items.length === 0) return null;

  return (
    <section id="areas" className="bg-primary-soft py-28 sm:py-36">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Atuação</p>
          <h2 className="mt-6 font-display text-4xl font-normal leading-[1.1] tracking-tightest text-balance sm:text-5xl">
            {areas.title}
          </h2>
          {areas.intro && (
            <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft text-pretty">
              {areas.intro}
            </p>
          )}
        </div>

        <div
          ref={gridRef}
          className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-0 [&>*]:min-w-0"
        >
          {areas.items.map((item, index) => (
            <motion.article
              key={`${item.nome}-${index}`}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
              className={`border-t border-line pt-10 lg:border-t-0 lg:pt-0 ${
                index > 0 ? "lg:border-l lg:border-line lg:pl-10" : "lg:pr-10"
              }`}
            >
              <span
                className="block font-display text-2xl font-normal leading-none tabular-nums text-secondary"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <p className="mt-8 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                {item.especialista ? "Especialista em" : "Atuação em"}
              </p>
              <h3 className="mt-2 font-display text-2xl font-normal leading-tight tracking-tight text-ink">
                {item.nome}
              </h3>

              {item.quemProcura && (
                <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-soft text-pretty">
                  {item.quemProcura}
                </p>
              )}
              {item.oQueFaz && (
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft text-pretty">
                  {item.oQueFaz}
                </p>
              )}

              {item.inclui.length > 0 && (
                <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-ink-soft">
                  {item.inclui.join(" · ")}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
