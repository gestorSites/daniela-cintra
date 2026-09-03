import { describe, expect, it } from "vitest";
import { buildContent, onColorChannels } from "@/lib/content";
import type { ClientRow, ContentRow } from "@/lib/types";

const CLIENT: ClientRow = {
  id: "c1",
  slug: "escritorio-demo",
  name: "Escritório Demo",
  domain: null,
  active: true,
};

function row(section: string, key: string, value: string | null): ContentRow {
  return { client_id: "c1", section, key, value };
}

function meta(rows: ContentRow[]) {
  return buildContent(CLIENT, rows, []).meta;
}

/* ------------------------------------------------------------------ */
/* O bug: a secundaria nunca pode terminar igual a primaria             */
/* ------------------------------------------------------------------ */

describe("tema — primária e secundária", () => {
  it("usa as duas cores quando as duas vêm preenchidas", () => {
    const m = meta([
      row("meta", "primary_color", "#12314F"),
      row("meta", "secondary_color", "#A08050"),
    ]);
    expect(m.primaryRgb).toBe("18 49 79");
    expect(m.secondaryRgb).toBe("160 128 80");
    expect(m.primaryColor).toBe("#12314f");
    expect(m.secondaryColor).toBe("#a08050");
    expect(m.secondaryRgb).not.toBe(m.primaryRgb);
  });

  it("cai na constante própria quando só a secundária vem vazia", () => {
    const m = meta([row("meta", "primary_color", "#12314F")]);
    expect(m.primaryRgb).toBe("18 49 79");
    expect(m.secondaryRgb).toBe("138 121 93");
    expect(m.secondaryRgb).not.toBe(m.primaryRgb);
  });

  it("cai em duas constantes distintas quando as duas vêm vazias", () => {
    const m = meta([]);
    expect(m.primaryRgb).toBe("27 42 65");
    expect(m.secondaryRgb).toBe("138 121 93");
    expect(m.secondaryRgb).not.toBe(m.primaryRgb);
  });

  it("não deixa a secundária colar na primária em nenhum dos três casos", () => {
    const casos: ContentRow[][] = [
      [row("meta", "primary_color", "#12314F"), row("meta", "secondary_color", "#A08050")],
      [row("meta", "primary_color", "#12314F")],
      [],
    ];
    for (const rows of casos) {
      const m = meta(rows);
      expect(m.secondaryRgb).not.toBe(m.primaryRgb);
      expect(m.secondaryColor).not.toBe(m.primaryColor);
    }
  });

  it("ignora uma cor ilegível e cai na constante, sem herdar a outra", () => {
    const m = meta([
      row("meta", "primary_color", "#12314F"),
      row("meta", "secondary_color", "azul-marinho"),
    ]);
    expect(m.secondaryRgb).toBe("138 121 93");
    expect(m.secondaryRgb).not.toBe(m.primaryRgb);
  });

  it("aceita hex curto e rgb() além do hex de seis dígitos", () => {
    expect(meta([row("meta", "primary_color", "#08f")]).primaryRgb).toBe("0 136 255");
    expect(meta([row("meta", "primary_color", "rgb(12, 34, 56)")]).primaryRgb).toBe(
      "12 34 56",
    );
  });
});

/* ------------------------------------------------------------------ */
/* --on-primary / --on-secondary por luminancia                         */
/* ------------------------------------------------------------------ */

describe("tema — cor de texto por luminância", () => {
  it("põe tinta escura sobre um tom claro", () => {
    expect(onColorChannels([245, 230, 200])).toBe("27 24 19");
  });

  it("põe tinta clara sobre um tom escuro", () => {
    expect(onColorChannels([18, 49, 79])).toBe("255 255 255");
  });

  it("calcula on-primary e on-secondary de forma independente", () => {
    const m = meta([
      row("meta", "primary_color", "#12314F"),
      row("meta", "secondary_color", "#F5E6C8"),
    ]);
    expect(m.onPrimaryRgb).toBe("255 255 255");
    expect(m.onSecondaryRgb).toBe("27 24 19");
  });

  it("dá tinta clara às duas constantes de reserva", () => {
    const m = meta([]);
    expect(m.onPrimaryRgb).toBe("255 255 255");
    expect(m.onSecondaryRgb).toBe("255 255 255");
  });
});

/* ------------------------------------------------------------------ */
/* Keys que mudaram junto                                               */
/* ------------------------------------------------------------------ */

describe("rodapé — aviso é constante do template", () => {
  it("traz o aviso mesmo com o banco vazio", () => {
    const content = buildContent(CLIENT, [], []);
    expect(content.rodape.aviso).toContain("Código de Ética");
  });

  it("ignora uma linha rodape/aviso no banco", () => {
    const content = buildContent(
      CLIENT,
      [row("rodape", "aviso", "texto qualquer vindo do admin")],
      [],
    );
    expect(content.rodape.aviso).not.toBe("texto qualquer vindo do admin");
    expect(content.rodape.aviso).toContain("Código de Ética");
  });
});

describe("publicacoes — title", () => {
  it("tem fallback como as demais seções", () => {
    expect(buildContent(CLIENT, [], []).publicacoes.title).toBe("Publicações");
  });

  it("aceita o título do banco", () => {
    const content = buildContent(
      CLIENT,
      [row("publicacoes", "title", "Artigos e palestras")],
      [],
    );
    expect(content.publicacoes.title).toBe("Artigos e palestras");
  });
});
