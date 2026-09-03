/*
 * Verificação pós-deploy dos assets que o crawler consome.
 *
 *   node scripts/check-assets.mjs https://www.exemplo.adv.br
 *   node scripts/check-assets.mjs            (usa NEXT_PUBLIC_SITE_URL)
 *
 * Por que não basta checar status 200:
 *
 * Rewrite e fallback de SPA respondem 200 com `text/html` para QUALQUER
 * caminho — inclusive /opengraph-image e /favicon.ico. Um teste que só olha
 * o status passa, e o crawler não recebe imagem alguma.
 *
 * Por isso cada asset é conferido em três camadas:
 *   1. status HTTP
 *   2. content-type declarado
 *   3. os primeiros bytes do corpo — o número mágico do formato.
 *
 * A camada 3 é a que não dá para fingir: um header pode mentir, PNG que não
 * começa com \x89PNG não é PNG.
 *
 * A og-image é conferida DUAS vezes: no caminho fixo e na URL que está de
 * fato no `<meta property="og:image">` da home, que leva um hash de query.
 * É essa segunda que o crawler busca.
 */

const MAGICOS = {
  png: { bytes: [0x89, 0x50, 0x4e, 0x47], rotulo: "PNG" },
  ico: { bytes: [0x00, 0x00, 0x01, 0x00], rotulo: "ICO" },
};

const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "")
  .trim()
  .replace(/\/+$/, "");

if (!base) {
  console.error(
    "Informe a URL: node scripts/check-assets.mjs https://www.exemplo.adv.br",
  );
  process.exit(2);
}

let falhas = 0;

function reportar(nome, ok, detalhe) {
  console.log(`  ${ok ? "✓" : "✗"} ${nome.padEnd(34)} ${detalhe}`);
  if (!ok) falhas += 1;
}

async function conferir(caminho, formato, rotulo = caminho) {
  const url = caminho.startsWith("http") ? caminho : `${base}${caminho}`;
  let res;
  try {
    res = await fetch(url, { redirect: "follow" });
  } catch (erro) {
    reportar(rotulo, false, `falha de rede: ${erro.message}`);
    return;
  }

  const tipo = (res.headers.get("content-type") || "").split(";")[0].trim();
  const buf = Buffer.from(await res.arrayBuffer());
  const esperado = MAGICOS[formato];
  const magico = esperado.bytes.every((b, i) => buf[i] === b);

  const partes = [`${res.status}`, tipo || "(sem content-type)", `${buf.length}B`];

  if (res.status !== 200) {
    reportar(rotulo, false, `${partes.join(" · ")} — status`);
    return;
  }
  if (tipo === "text/html") {
    reportar(
      rotulo,
      false,
      `${partes.join(" · ")} — devolveu HTML: rewrite ou fallback de SPA engolindo o asset`,
    );
    return;
  }
  if (!tipo.startsWith("image/")) {
    reportar(rotulo, false, `${partes.join(" · ")} — content-type não é imagem`);
    return;
  }
  if (!magico) {
    reportar(
      rotulo,
      false,
      `${partes.join(" · ")} — corpo não é ${esperado.rotulo} (header mente)`,
    );
    return;
  }
  reportar(rotulo, true, `${partes.join(" · ")} · ${esperado.rotulo} válido`);
}

console.log(`\nVerificando assets em ${base}\n`);

// 1) caminhos fixos
await conferir("/favicon.ico", "ico");
await conferir("/icon.png", "png");
await conferir("/apple-icon.png", "png");
await conferir("/opengraph-image", "png");

// 2) a URL que o crawler realmente busca, tirada do HTML
console.log("");
let html = "";
try {
  const res = await fetch(base, { redirect: "follow" });
  html = await res.text();
  reportar(
    "home",
    res.ok,
    `${res.status} · ${(res.headers.get("content-type") || "").split(";")[0]}`,
  );
} catch (erro) {
  reportar("home", false, `falha de rede: ${erro.message}`);
}

const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
if (!og) {
  reportar("og:image no <head>", false, "meta ausente no HTML da home");
} else {
  reportar("og:image no <head>", true, og);
  if (/^https?:\/\/localhost/i.test(og)) {
    reportar(
      "og:image absoluta",
      false,
      "aponta para localhost — falta NEXT_PUBLIC_SITE_URL no build",
    );
  }
  await conferir(og, "png", "og:image (URL do crawler)");
}

const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
reportar(
  "canonical",
  Boolean(canonical) && !/localhost/i.test(canonical ?? ""),
  canonical ?? "ausente",
);

const oab = /OAB\/[A-Z]{2}\s*\d+/.test(html);
reportar("OAB no HTML da home", oab, oab ? "presente" : "AUSENTE — não publica");

console.log(
  `\n${falhas === 0 ? "✓ tudo certo" : `✗ ${falhas} verificação(ões) falharam`}\n`,
);
process.exit(falhas === 0 ? 0 : 1);
