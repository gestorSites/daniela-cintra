import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { fetchContent } from "@/lib/fetchContent";

export const alt = "Símbolo do escritório sobre a cor da marca";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Gerada uma vez, no build. Evita depender do sistema de arquivos em runtime
// e garante que o crawler sempre receba um arquivo estático, com o
// content-type certo. Mudou a cor ou o símbolo? Rebuild.
export const dynamic = "force-static";

/**
 * Lê um asset do projeto; devolve null em vez de quebrar o build.
 *
 * As fontes são **WOFF estático**, não a variável do repositório do Google:
 * o Satori não lê fonte variável — quebra na tabela `fvar`. São instâncias
 * pedidas à API do Google Fonts com um User-Agent antigo, que devolve woff.
 */
async function asset(...segments: string[]): Promise<Buffer | null> {
  try {
    return await readFile(path.join(process.cwd(), ...segments));
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const { meta, rodape } = await fetchContent();

  const [display, body, simbolo] = await Promise.all([
    asset("src", "app", "fonts", "Fraunces.woff"),
    asset("src", "app", "fonts", "HankenGrotesk.woff"),
    asset("public", "marca", "icon-512.png"),
  ]);

  const fonts = [
    display && { name: "Fraunces", data: display, style: "normal" as const, weight: 400 as const },
    body && { name: "Hanken", data: body, style: "normal" as const, weight: 600 as const },
  ].filter(Boolean) as { name: string; data: Buffer; style: "normal"; weight: 400 }[];

  const simboloSrc = simbolo
    ? `data:image/png;base64,${simbolo.toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: meta.primaryColor,
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {simboloSrc && (
            // O símbolo já vem branco sobre a primária: sobre o mesmo fundo,
            // encosta sem moldura visível.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={simboloSrc} alt="" width={132} height={132} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Mesmo fio de acento que marca as seções do site. */}
          <div
            style={{
              display: "flex",
              width: 96,
              height: 2,
              background: meta.secondaryColor,
              marginBottom: 40,
            }}
          />
          <div
            style={{
              fontFamily: "Fraunces",
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            {meta.companyName}
          </div>
          {rodape.oabDisplay && (
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontFamily: "Hanken",
                fontSize: 26,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: meta.secondaryColor,
              }}
            >
              {rodape.oabDisplay}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
