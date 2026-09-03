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
