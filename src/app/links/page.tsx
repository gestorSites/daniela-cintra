import type { Metadata } from "next";
import ThemeStyle from "@/components/ThemeStyle";
import LinkTree from "@/components/LinkTree";
import Footer from "@/components/Footer";
import { fetchContent } from "@/lib/fetchContent";

// Revalida o conteudo vindo do Supabase a cada 60 segundos.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await fetchContent();
  return {
    title: "Links",
    description: `Canais de contato de ${meta.companyName}.`,
    alternates: { canonical: "/links" },
    openGraph: { url: "/links" },
  };
}

export default async function LinksPage() {
  const { links, meta, rodape, contato } = await fetchContent();

  return (
    <>
      <ThemeStyle meta={meta} />

      <LinkTree links={links} meta={meta} />
      {/* O bloco legal com a OAB é requisito em TODAS as páginas. */}
      <Footer meta={meta} rodape={rodape} endereco={contato.endereco} />
    </>
  );
}
