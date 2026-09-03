/**
 * URL canônica do site.
 *
 * Ordem: `NEXT_PUBLIC_SITE_URL` → `clients.domain` no banco → localhost.
 *
 * `NEXT_PUBLIC_*` é inlinada em build: mudar a env exige redeploy, nunca só
 * restart. Enquanto o domínio não existir, tudo cai em localhost e o
 * `canonical`/`og:url` sai errado — por isso o domínio registrado é
 * pré-requisito de publicação, não de construção.
 */
const FALLBACK = "http://localhost:3000";

function normalize(raw: string): string {
  const value = raw.trim().replace(/\/+$/, "");
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function siteUrl(domain?: string | null): string {
  return (
    normalize(process.env.NEXT_PUBLIC_SITE_URL ?? "") ||
    normalize(domain ?? "") ||
    FALLBACK
  );
}

/** URL absoluta de um caminho do site. */
export function absoluteUrl(path: string, domain?: string | null): string {
  const base = siteUrl(domain);
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * O site tem um host canônico de verdade?
 *
 * Enquanto `NEXT_PUBLIC_SITE_URL` e `clients.domain` estiverem vazios,
 * `siteUrl()` cai no `FALLBACK` e o site não tem endereço público — é um
 * preview. Serve para decidir se o `<meta name="robots">` libera indexação:
 * um deploy sem domínio ainda ganha uma URL pública (`*.vercel.app`), e
 * indexá-la publica no Google conteúdo que ainda não foi aprovado.
 *
 * Derivado da mesma env que alimenta `canonical` e `og:url` de propósito:
 * assim não existe um par de pontas para desalinhar, e ligar o domínio é o
 * mesmo gesto que libera a indexação.
 */
export function hasCanonicalHost(domain?: string | null): boolean {
  return siteUrl(domain) !== FALLBACK;
}
