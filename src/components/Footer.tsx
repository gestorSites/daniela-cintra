import Link from "next/link";
import type { MetaContent, NavLink, RodapeContent } from "@/lib/types";

/**
 * Rodapé de todas as páginas — centralizado: menu primeiro, depois a marca,
 * depois o bloco legal.
 *
 * O bloco legal não é decoração. Razão social, CNPJ, inscrição, endereço e o
 * aviso do Código de Ética vêm juntos — o aviso é constante do template, os
 * demais vêm do banco e somem quando não preenchidos.
 *
 * **A linha da OAB só sai com `ocultarOab`**, e só a home passa isso, quando
 * o hero já mostra o número (pedido da cliente: não repetir). A `/links` e a
 * 404 não têm hero — nelas o rodapé é o único lugar da inscrição, e o padrão
 * é mantê-la. Quem chama sem pensar recebe a linha.
 *
 * O slogan entra como **assinatura de marca**, sob o nome do escritório: em
 * `ink-soft`, o mesmo tom secundário do bloco legal e da `.eyebrow`.
 * Deliberadamente não é a cor `secondary` — uma frase inteira em dourado
 * leria como chamada, e o Provimento 205/2021 é justamente sobre não fazer
 * chamada.
 */
export default function Footer({
  meta,
  rodape,
  endereco,
  links = [],
  ocultarOab = false,
}: {
  meta: MetaContent;
  rodape: RodapeContent;
  endereco: string;
  /** âncoras das seções que renderizaram; vazio na /links. */
  links?: NavLink[];
  /** só a home, e só quando o hero já traz a inscrição. */
  ocultarOab?: boolean;
}) {
  const year = new Date().getFullYear();
  const identidade = [rodape.razaoSocial, rodape.cnpj ? `CNPJ ${rodape.cnpj}` : ""]
    .filter(Boolean)
    .join(" · ");
  const linkMenu =
    "text-sm font-medium uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-secondary-strong sm:text-[0.95rem]";

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-wide flex flex-col items-center py-20 text-center">
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} className={linkMenu}>
              {link.label}
            </a>
          ))}
          <Link href="/links" className={linkMenu}>
            Links
          </Link>
        </nav>

        <div className="mt-14 h-px w-16 bg-secondary" aria-hidden="true" />

        <Link
          href="/"
          className="mt-10 font-display text-2xl font-normal tracking-tight text-ink text-balance sm:text-[1.75rem]"
        >
          {meta.companyName}
        </Link>

        {/*
          Slogan vazio não deixa rastro: a margem mora no próprio <p>, e
          não há separador entre ele e o nome.
        */}
        {meta.slogan && (
          <p className="mt-3 max-w-3xl text-balance text-base leading-relaxed text-ink-soft">
            {meta.slogan}
          </p>
        )}

        {/* Bloco legal */}
        <div className="mt-12 flex w-full flex-col items-center border-t border-line pt-10 text-[0.95rem] leading-relaxed text-ink-soft">
          {identidade && <p>{identidade}</p>}

          {rodape.oabDisplay && !ocultarOab && (
            <p className="mt-1 font-semibold tracking-[0.14em] text-ink">
              {rodape.oabDisplay}
            </p>
          )}

          {endereco && <p className="mt-3 max-w-2xl">{endereco}</p>}

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft text-balance">
            {rodape.aviso}
          </p>

          <p className="mt-6 text-sm text-ink-soft">
            © {year} {meta.companyName}
          </p>
        </div>
      </div>
    </footer>
  );
}
