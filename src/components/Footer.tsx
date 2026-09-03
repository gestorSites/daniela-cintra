import Link from "next/link";
import type { MetaContent, NavLink, RodapeContent } from "@/lib/types";

/**
 * Rodapé de todas as páginas.
 *
 * O bloco legal não é decoração: sem o número da OAB no rodapé o site não
 * pode ser publicado. Razão social, CNPJ, inscrição, endereço e o aviso do
 * Código de Ética vêm juntos — o aviso é constante do template, os demais
 * vêm do banco e somem quando não preenchidos.
 */
export default function Footer({
  meta,
  rodape,
  endereco,
  links = [],
}: {
  meta: MetaContent;
  rodape: RodapeContent;
  endereco: string;
  /** âncoras das seções que renderizaram; vazio na /links. */
  links?: NavLink[];
}) {
  const year = new Date().getFullYear();
  const identidade = [rodape.razaoSocial, rodape.cnpj ? `CNPJ ${rodape.cnpj}` : ""]
    .filter(Boolean)
    .join(" · ");

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-wide py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-baseline sm:justify-between">
          <Link
            href="/"
            className="font-display text-xl font-normal tracking-tight text-ink"
          >
            {meta.companyName}
          </Link>

          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink-soft transition-colors hover:text-secondary-strong"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/links"
              className="text-sm text-ink-soft transition-colors hover:text-secondary-strong"
            >
              Links
            </Link>
          </nav>
        </div>

        {/* Bloco legal */}
        <div className="mt-12 border-t border-line pt-8 text-sm leading-relaxed text-ink-soft">
          {identidade && <p>{identidade}</p>}

          {rodape.oabDisplay && (
            <p className="mt-1 font-semibold tracking-[0.14em] text-ink">
              {rodape.oabDisplay}
            </p>
          )}

          {endereco && <p className="mt-3 max-w-xl">{endereco}</p>}

          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-soft">
            {rodape.aviso}
          </p>

          <p className="mt-6 text-xs text-ink-soft">
            © {year} {meta.companyName}
          </p>
        </div>
      </div>
    </footer>
  );
}
