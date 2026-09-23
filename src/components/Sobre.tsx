import AnimatedSection from "./AnimatedSection";
import type { ExperienciaItem, SobreContent } from "@/lib/types";

interface SobreProps {
  sobre: SobreContent;
  experiencia: ExperienciaItem[];
}

/**
 * Secao "Sobre": retrato (slot `perfil`), apresentacao e os blocos de
 * experiencia.
 *
 * Cada bloco de experiencia fica colado ao campo que ele sustenta, com os
 * rotulos "Experiência em" / "Aplicada a" fixos. Nao e enfeite: e o que
 * impede a leitura de que sao anos de advocacia. "Aplicada" concorda com
 * "experiência", entao a frase fecha com qualquer valor vindo do banco.
 */
function BlocoExperiencia({ item }: { item: ExperienciaItem }) {
  return (
    <div>
      <p className="font-display text-[3.25rem] font-normal leading-none tracking-tightest text-secondary sm:text-[4rem]">
        {item.anos}
      </p>
      <div className="mt-6 h-px w-12 bg-secondary/50" aria-hidden="true" />
      <dl className="mt-6 space-y-4">
        {item.campo && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
              Experiência em
            </dt>
            <dd className="mt-1 text-lg leading-snug text-ink">
              {item.campo}
            </dd>
          </div>
        )}
        {item.aplicacao && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
              Aplicada a
            </dt>
            <dd className="mt-1 text-lg leading-snug text-ink">
              {item.aplicacao}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export default function Sobre({ sobre, experiencia }: SobreProps) {
  const temTexto = sobre.paragraphs.length > 0;

  return (
    <section id="sobre" className="py-28 sm:py-36">
      <div className="container-wide">
        <div
          className={
            sobre.image
              ? "grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 [&>*]:min-w-0"
              : "grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 [&>*]:min-w-0"
          }
        >
          {/* Retrato — só quando existe. Sem moldura vazia de reserva. */}
          {sobre.image && (
            <AnimatedSection className="relative order-last lg:order-first">
              <div
                className="absolute -bottom-5 -left-5 h-full w-full border border-secondary/40"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden border border-line bg-paper-raised">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sobre.image.url}
                  alt={sobre.image.alt || sobre.nome}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={sobre.image ? 0.12 : 0}>
            <p className="eyebrow">Sobre</p>
            <h2 className="titulo-secao">
              {sobre.title}
            </h2>

            {temTexto && (
              <div className="mt-9 max-w-3xl space-y-6">
                {sobre.paragraphs.map((paragraph, index) => (
                  <p key={index} className="texto-corpo">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>

        {/* Experiência — o número colado ao campo que ele sustenta */}
        {experiencia.length > 0 && (
          <AnimatedSection className="mt-20 border-t border-line pt-14 sm:mt-24">
            <div className="grid gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-20 [&>*]:min-w-0">
              {experiencia.map((item, index) => (
                <BlocoExperiencia key={`${item.anos}-${index}`} item={item} />
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
