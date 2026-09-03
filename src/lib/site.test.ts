import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { absoluteUrl, hasCanonicalHost, siteUrl } from "@/lib/site";

const ENV = "NEXT_PUBLIC_SITE_URL";
let original: string | undefined;

beforeEach(() => {
  original = process.env[ENV];
});

afterEach(() => {
  if (original === undefined) delete process.env[ENV];
  else process.env[ENV] = original;
});

describe("siteUrl", () => {
  it("prefere a env ao dominio do banco", () => {
    process.env[ENV] = "https://exemplo.adv.br";
    expect(siteUrl("outro.adv.br")).toBe("https://exemplo.adv.br");
  });

  it("cai no dominio do banco quando a env esta vazia", () => {
    process.env[ENV] = "";
    expect(siteUrl("cliente.adv.br")).toBe("https://cliente.adv.br");
  });

  it("cai em localhost quando nao ha nem env nem dominio", () => {
    process.env[ENV] = "";
    expect(siteUrl(null)).toBe("http://localhost:3000");
  });

  it("normaliza espacos e barra final", () => {
    process.env[ENV] = "  https://exemplo.adv.br/  ";
    expect(siteUrl(null)).toBe("https://exemplo.adv.br");
  });
});

describe("hasCanonicalHost", () => {
  it("é falso sem env e sem dominio — o site é preview", () => {
    process.env[ENV] = "";
    expect(hasCanonicalHost(null)).toBe(false);
  });

  it("é falso quando a env aponta explicitamente para localhost", () => {
    process.env[ENV] = "http://localhost:3000";
    expect(hasCanonicalHost(null)).toBe(false);
  });

  it("é verdadeiro com a env preenchida", () => {
    process.env[ENV] = "https://exemplo.adv.br";
    expect(hasCanonicalHost(null)).toBe(true);
  });

  it("é verdadeiro quando so o dominio do banco existe", () => {
    process.env[ENV] = "";
    expect(hasCanonicalHost("cliente.adv.br")).toBe(true);
  });

  it("acompanha o canonical: quem nao tem host canonico nao indexa", () => {
    process.env[ENV] = "";
    // A mesma fonte decide as duas coisas — nao ha par de pontas para desalinhar.
    expect(siteUrl(null)).toBe("http://localhost:3000");
    expect(hasCanonicalHost(null)).toBe(false);
    expect(absoluteUrl("/links", null)).toBe("http://localhost:3000/links");
  });
});
