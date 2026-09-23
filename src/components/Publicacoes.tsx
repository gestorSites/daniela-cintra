import AnimatedSection from "./AnimatedSection";
import { IconArrowUpRight } from "./Icons";
import type { PublicacoesContent } from "@/lib/types";

interface PublicacoesProps {
  publicacoes: PublicacoesContent;
}

/**
 * Artigos e palestras. Nao renderiza nada enquanto as duas listas estiverem
 * vazias — que e como elas nascem. Cada coluna some sozinha se a outra tiver
 * conteudo. A linha de detalhe junta so os campos preenchidos.
 */
function detalhe(...partes: string[]): string {
  return partes.filter(Boolean).join(" · ");
}

export default function Publicacoes({ publicacoes }: PublicacoesProps) {
  const { artigos, palestras } = publicacoes;
  if (artigos.length === 0 && palestras.length === 0) return null;

  return (
    <section id="publicacoes" className="py-28 sm:py-36">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Produção</p>
          <h2 className="titulo-secao">
            {publicacoes.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-20 [&>*]:min-w-0">
          {artigos.length > 0 && (
            <AnimatedSection>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Artigos
              </p>
              <ul className="mt-8 flex flex-col">
                {artigos.map((item, index) => {
                  const meta = detalhe(item.veiculo, item.ano);
                  return (
                    <li
                      key={`${item.titulo}-${index}`}
                      className="border-t border-line py-6 first:border-t-0 first:pt-0"
                    >
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-start gap-2 text-lg leading-snug text-ink underline decoration-secondary/40 underline-offset-[5px] transition-colors hover:decoration-secondary"
                        >
                          {item.titulo}
                          <IconArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-secondary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      ) : (
                        <p className="text-lg leading-snug text-ink">
                          {item.titulo}
                        </p>
                      )}
                      {meta && (
                        <p className="mt-1.5 text-sm text-ink-soft">{meta}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </AnimatedSection>
          )}

          {palestras.length > 0 && (
            <AnimatedSection delay={0.12}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Palestras
              </p>
              <ul className="mt-8 flex flex-col">
                {palestras.map((item, index) => {
                  const meta = detalhe(item.evento, item.ano);
                  return (
                    <li
                      key={`${item.tema}-${index}`}
                      className="border-t border-line py-6 first:border-t-0 first:pt-0"
                    >
                      <p className="text-lg leading-snug text-ink">
                        {item.tema}
                      </p>
                      {meta && (
                        <p className="mt-1.5 text-sm text-ink-soft">{meta}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
}
