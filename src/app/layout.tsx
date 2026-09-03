import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { fetchContent } from "@/lib/fetchContent";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Metadata comum a todas as páginas.
 *
 * `metadataBase` é o que torna `canonical`, `og:url` e `og:image` absolutos —
 * sem ela o Next emite caminhos relativos e o crawler não resolve a imagem.
 * Os ícones não são declarados aqui: o App Router serve `favicon.ico`,
 * `icon.png` e `apple-icon.png` de `src/app/` por convenção, e a og-image vem
 * de `opengraph-image.tsx` pelo mesmo caminho.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await fetchContent();
  const base = siteUrl(meta.domain);
  const nome = meta.companyName;

  // Vem de `meta/description` ou é composta do que já está no banco — nunca
  // de área fixa no código: o texto de um cliente descreveria o outro.
  const description = meta.description;

  return {
    metadataBase: new URL(base),
    title: { default: nome, template: `%s · ${nome}` },
    description,
    applicationName: nome,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: nome,
      url: base,
      title: nome,
      description,
    },
    twitter: { card: "summary_large_image", title: nome, description },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
