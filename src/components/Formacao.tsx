import AnimatedSection from "./AnimatedSection";
import type { ComissoesContent, FormacaoContent } from "@/lib/types";

interface FormacaoProps {
  formacao: FormacaoContent;
  comissoes: ComissoesContent;
}

/**
 * Formacao e comissoes, lado a lado — ou uma coluna so, quando falta uma das
 * duas, para nao sobrar meia secao vazia.
 *
 * `formacao/paragrafo` (prosa) substitui a lista de formacao quando existe:
 * ha trajetoria que o cliente escreve como texto corrido, fundindo formacao e
 * comissoes, e nao cabe em `tipo|curso|instituicao|ano`. Sem ela, a lista.
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
  const temProsa = formacao.paragraphs.length > 0;
  const temFormacao =
    temProsa || formacao.items.length > 0 || Boolean(formacao.idiomas);
  const temComissoes = comissoes.items.length > 0;

  if (!temFormacao && !temComissoes) return null;

  const duasColunas = temFormacao && temComissoes;

  return (
    <section id="formacao" className="bg-secondary-soft py-28 sm:py-36">
      <div className="container-wide">
        <div
          className={
            duasColunas
              ? "grid gap-16 lg:grid-cols-2 lg:gap-20 [&>*]:min-w-0"
              : "max-w-4xl"
          }
        >
          {temFormacao && (
            <AnimatedSection>
              <p className="eyebrow">Trajetória</p>
              <h2 className="titulo-secao">
                {formacao.title}
              </h2>

              {temProsa && (
                <div className="mt-10 space-y-6">
                  {formacao.paragraphs.map((paragraph, index) => (
                    <p key={index} className="texto-corpo">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {!temProsa && formacao.items.length > 0 && (
                <ul className="mt-10 flex flex-col">
                  {formacao.items.map((item, index) => {
                    const meta = detalhe(item.instituicao, item.ano);
                    return (
                      <li
                        key={`${item.curso}-${index}`}
                        className="border-t border-line py-6 first:border-t-0 first:pt-0"
                      >
                        {item.tipo && (
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-strong">
                            {item.tipo}
                          </p>
                        )}
                        {item.curso && (
                          <p className="mt-2 text-lg leading-snug text-ink">
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
                  <span className="mt-1.5 block text-lg text-ink">
                    {formacao.idiomas}
                  </span>
                </p>
              )}
            </AnimatedSection>
          )}

          {temComissoes && (
            <AnimatedSection delay={0.12}>
              <p className="eyebrow">Participação</p>
              <h2 className="titulo-secao">
                {comissoes.title}
              </h2>

              <ul className="mt-10 flex flex-col">
                {comissoes.items.map((item, index) => (
                  <li
                    key={`${item.nome}-${index}`}
                    className="border-t border-line py-5 first:border-t-0 first:pt-0"
                  >
                    <p className="text-lg leading-snug text-ink">
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
