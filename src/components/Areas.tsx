"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { AreasContent } from "@/lib/types";

interface AreasProps {
  areas: AreasContent;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Areas de atuacao: um quadro por area — moldura reta de fio fino sobre o
 * papel, na linguagem de documento do resto da pagina. Nao e cartao: sem
 * canto arredondado, sem sombra.
 *
 * Sem icone, de proposito: o numeral e a ancora visual. Um icone generico de
 * area juridica disputa com a tipografia e nao representa com honestidade
 * uma area que funde varias (Familia, Civel e Previdenciario numa so).
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
        <div className="max-w-3xl">
          <p className="eyebrow">Atuação</p>
          <h2 className="titulo-secao">
            {areas.title}
          </h2>
          {areas.intro && <p className="texto-corpo mt-7">{areas.intro}</p>}
        </div>

        <div
          ref={gridRef}
          className="mt-16 grid gap-6 lg:grid-cols-3 xl:gap-8 [&>*]:min-w-0"
        >
          {areas.items.map((item, index) => (
            <motion.article
              key={`${item.nome}-${index}`}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
              className="flex flex-col border border-secondary/50 bg-paper p-8 sm:p-10 xl:p-12"
            >
              <span
                className="block font-display text-3xl font-normal leading-none tabular-nums text-secondary sm:text-[2.1rem]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <p className="mt-9 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft sm:text-[0.8125rem]">
                {item.especialista ? "Especialista em" : "Atuação em"}
              </p>
              <h3 className="mt-3 font-display text-[1.75rem] font-normal leading-tight tracking-tight text-ink text-balance xl:text-[2rem]">
                {item.nome}
              </h3>

              {item.quemProcura && (
                <p className="mt-7 text-[1.0625rem] leading-relaxed text-ink-soft text-pretty">
                  {item.quemProcura}
                </p>
              )}
              {item.oQueFaz && (
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft text-pretty">
                  {item.oQueFaz}
                </p>
              )}

              {/* mt-auto: a faixa de subareas assenta no pe do quadro, e os
                  tres quadros fecham na mesma linha. */}
              {item.inclui.length > 0 && (
                <div className="mt-auto pt-9">
                  <p className="border-t border-line pt-6 text-[0.95rem] leading-relaxed text-ink-soft">
                    {item.inclui.join(" · ")}
                  </p>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
