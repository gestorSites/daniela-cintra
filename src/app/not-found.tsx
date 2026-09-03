import Link from "next/link";
import type { Metadata } from "next";
import ThemeStyle from "@/components/ThemeStyle";
import Footer from "@/components/Footer";
import { fetchContent } from "@/lib/fetchContent";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404 do site.
 *
 * Existe para o bloco legal do rodapé — razão social, CNPJ, inscrição na OAB,
 * endereço e o aviso do Código de Ética — aparecer em **todas** as páginas,
 * sem exceção. A 404 padrão do Next não tem rodapé, e o número da OAB no
 * rodapé é requisito de publicação.
 */
export default async function NotFound() {
  const { meta, rodape, contato } = await fetchContent();

  return (
    <>
      <ThemeStyle meta={meta} />
      <main className="flex min-h-[60svh] items-center py-32 sm:py-40">
        <div className="container-wide">
          <p className="eyebrow">Erro 404</p>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-normal leading-[1.1] tracking-tightest text-balance sm:text-5xl">
            Esta página não existe
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink-soft text-pretty">
            O endereço pode ter mudado ou o link pode estar incompleto.
          </p>
          <Link
            href="/"
            className="group mt-10 inline-flex items-center gap-3 border-b border-secondary/50 pb-2 text-sm font-semibold uppercase tracking-[0.16em] text-secondary-strong transition-colors hover:border-secondary"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
      <Footer meta={meta} rodape={rodape} endereco={contato.endereco} />
    </>
  );
}
