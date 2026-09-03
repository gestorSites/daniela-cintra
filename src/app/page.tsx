import type { Metadata } from "next";
import ThemeStyle from "@/components/ThemeStyle";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Areas from "@/components/Areas";
import Atendimento from "@/components/Atendimento";
import Formacao from "@/components/Formacao";
import Publicacoes from "@/components/Publicacoes";
import Galeria from "@/components/Galeria";
import Faq from "@/components/Faq";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import { fetchContent } from "@/lib/fetchContent";

// Revalida o conteudo vindo do Supabase a cada 60 segundos.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await fetchContent();
  return {
    // `absolute` para a home não virar "Nome · Nome" pelo template do layout.
    title: { absolute: meta.companyName },
    alternates: { canonical: "/" },
    openGraph: { url: "/" },
  };
}

export default async function HomePage() {
  const content = await fetchContent();
  const { meta } = content;

  // Uma secao vazia nao renderiza. As condicoes ficam aqui, calculadas uma
  // vez, e servem a tres coisas: a ancora do menu, a ancora do rodape e a
  // montagem da secao. Componentes client como Areas, Atendimento e Faq
  // guardam o `return null` por dentro, mas nao basta: as props deles vao
  // para o payload RSC mesmo quando nao renderizam nada. Nao e rastro
  // visual, e byte gasto a toa — melhor nem montar.
  const temAreas = content.areas.items.length > 0;
  const temAtendimento = content.atendimento.items.length > 0;
  const temFormacao =
    content.formacao.items.length > 0 ||
    Boolean(content.formacao.idiomas) ||
    content.comissoes.items.length > 0;
  const temPublicacoes =
    content.publicacoes.artigos.length > 0 ||
    content.publicacoes.palestras.length > 0;
  const temGaleria = content.galeria.images.length > 0;
  const temFaq = content.faq.items.length > 0;

  // `nav` limita o menu do topo as ancoras principais — o rodape lista todas.
  const ancoras = [
    { label: "Início", href: "#inicio", show: true, nav: true },
    { label: "Sobre", href: "#sobre", show: true, nav: true },
    { label: "Áreas", href: "#areas", show: temAreas, nav: true },
    { label: "Atendimento", href: "#atendimento", show: temAtendimento, nav: true },
    { label: "Formação", href: "#formacao", show: temFormacao, nav: false },
    { label: "Publicações", href: "#publicacoes", show: temPublicacoes, nav: false },
    { label: "Perguntas", href: "#faq", show: temFaq, nav: false },
    { label: "Contato", href: "#contato", show: true, nav: true },
  ].filter((a) => a.show);

  const footerLinks = ancoras.map(({ label, href }) => ({ label, href }));
  const navLinks = ancoras
    .filter((a) => a.nav)
    .map(({ label, href }) => ({ label, href }));

  return (
    <>
      <ThemeStyle meta={meta} />

      <Navbar
        companyName={meta.companyName}
        logoUrl={meta.logoUrl}
        links={navLinks}
      />
      <main>
        <Hero
          hero={content.hero}
          companyName={meta.companyName}
          logoUrl={meta.logoUrl}
          whatsapp={content.contato.whatsapp}
        />
        <Sobre sobre={content.sobre} experiencia={content.experiencia} />
        {temAreas && <Areas areas={content.areas} />}
        {temAtendimento && <Atendimento atendimento={content.atendimento} />}
        {temFormacao && (
          <Formacao formacao={content.formacao} comissoes={content.comissoes} />
        )}
        {temPublicacoes && <Publicacoes publicacoes={content.publicacoes} />}
        {/* Fotos do escritório como contexto de localização, sem legenda que
            qualifique o espaço. Fica junto ao contato por isso. */}
        {temGaleria && (
          <Galeria galeria={content.galeria} companyName={meta.companyName} />
        )}
        {temFaq && <Faq faq={content.faq} />}
        <Contato
          contato={content.contato}
          clientId={meta.clientId}
          whatsappMessage={content.hero.ctaWhatsappMessage}
        />
      </main>
      <Footer
        meta={meta}
        rodape={content.rodape}
        endereco={content.contato.endereco}
        links={footerLinks}
      />
      <WhatsappButton
        whatsapp={content.contato.whatsapp}
        message={content.hero.ctaWhatsappMessage}
      />
    </>
  );
}
