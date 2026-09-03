import AnimatedSection from "./AnimatedSection";
import type { ComissoesContent, FormacaoContent } from "@/lib/types";

interface FormacaoProps {
  formacao: FormacaoContent;
  comissoes: ComissoesContent;
}

/**
 * Formacao e comissoes, lado a lado.
 *
 * Item de formacao pode chegar sem `instituicao` e sem `ano` — e o estado em
 * que os dados nascem. A linha de detalhe so e montada com os campos que
 * existem e some por inteiro quando nao ha nenhum: nada de hifen solto,
 * parentese vazio ou separador orfao.
 */
function detalhe(...partes: string[]): string {
  return partes.filter(Boolean).join(" · ");
}

export default function Formacao({ formacao, comissoes }: FormacaoProps) {
  const temFormacao = formacao.items.length > 0 || Boolean(formacao.idiomas);
  const temComissoes = comissoes.items.length > 0;

  if (!temFormacao && !temComissoes) return null;

  return (
    <section id="formacao" className="bg-secondary-soft py-28 sm:py-36">
      <div className="container-wide">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 [&>*]:min-w-0">
          {temFormacao && (
            <AnimatedSection>
              <p className="eyebrow">Trajetória</p>
              <h2 className="mt-6 font-display text-3xl font-normal leading-[1.12] tracking-tightest text-balance sm:text-4xl">
                {formacao.title}
              </h2>

              {formacao.items.length > 0 && (
                <ul className="mt-10 flex flex-col">
                  {formacao.items.map((item, index) => {
                    const meta = detalhe(item.instituicao, item.ano);
                    return (
                      <li
                        key={`${item.curso}-${index}`}
                        className="border-t border-line py-6 first:border-t-0 first:pt-0"
                      >
                        {item.tipo && (
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-secondary-strong">
                            {item.tipo}
                          </p>
                        )}
                        {item.curso && (
                          <p className="mt-2 text-[1.05rem] leading-snug text-ink">
                            {item.curso}
                          </p>
                        )}
                        {meta && (
                          <p className="mt-1.5 text-sm text-ink-soft">{meta}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {formacao.idiomas && (
                <p className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">
                  <span className="font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    Idiomas
                  </span>
                  <span className="mt-1.5 block text-[1.05rem] text-ink">
                    {formacao.idiomas}
                  </span>
                </p>
              )}
            </AnimatedSection>
          )}

          {temComissoes && (
            <AnimatedSection delay={0.12}>
              <p className="eyebrow">Participação</p>
              <h2 className="mt-6 font-display text-3xl font-normal leading-[1.12] tracking-tightest text-balance sm:text-4xl">
                {comissoes.title}
              </h2>

              <ul className="mt-10 flex flex-col">
                {comissoes.items.map((item, index) => (
                  <li
                    key={`${item.nome}-${index}`}
                    className="border-t border-line py-5 first:border-t-0 first:pt-0"
                  >
                    <p className="text-[1.05rem] leading-snug text-ink">
                      {item.nome}
                    </p>
                    {item.detalhe && (
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft text-pretty">
                        {item.detalhe}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
}
