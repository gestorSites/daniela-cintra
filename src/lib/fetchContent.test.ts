import { describe, expect, it } from "vitest";
import { buildContent, collectList, splitFields } from "@/lib/content";
import type { ClientRow, ContentRow, ImageRow } from "@/lib/types";

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

function build(rows: ContentRow[]) {
  return buildContent(CLIENT, rows, []);
}

/* ------------------------------------------------------------------ */

describe("splitFields", () => {
  it("completa com vazio o campo que falta no fim", () => {
    expect(splitFields("Graduação|Direito", 4)).toEqual([
      "Graduação",
      "Direito",
      "",
      "",
    ]);
  });

  it("preserva a posição do campo vazio no meio", () => {
    expect(splitFields("Graduação||2010|extra", 4)).toEqual([
      "Graduação",
      "",
      "2010",
      "extra",
    ]);
  });

  it("descarta os segmentos de um pipe a mais", () => {
    expect(splitFields("a|b|c|d|sobra|mais sobra", 4)).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
  });

  it("descarta o pipe solto no fim sem criar campo", () => {
    expect(splitFields("a|b|", 2)).toEqual(["a", "b"]);
  });

  it("apara espaços de cada campo", () => {
    expect(splitFields("  a  |  b  ", 2)).toEqual(["a", "b"]);
  });

  it("devolve a aridade cheia para valor vazio", () => {
    expect(splitFields("", 3)).toEqual(["", "", ""]);
  });
});

/* ------------------------------------------------------------------ */

describe("collectList", () => {
  it("devolve [] quando a lista não existe", () => {
    expect(collectList([], ["formacao"], "item", 4)).toEqual([]);
  });

  it("devolve [] quando a seção existe mas a lista não", () => {
    const rows = [row("formacao", "title", "Formação")];
    expect(collectList(rows, ["formacao"], "item", 4)).toEqual([]);
  });

  it("ordena por índice numérico, não alfabético", () => {
    const rows = [
      row("faq", "item_10", "décima|resposta"),
      row("faq", "item_2", "segunda|resposta"),
      row("faq", "item_1", "primeira|resposta"),
    ];
    expect(
      collectList(rows, ["faq"], "item", 2).map((fields) => fields[0]),
    ).toEqual(["primeira", "segunda", "décima"]);
  });

  it("ignora a linha sem valor — item inexistente, não item vazio", () => {
    const rows = [
      row("faq", "item_1", "pergunta|resposta"),
      row("faq", "item_2", ""),
      row("faq", "item_3", null),
    ];
    expect(collectList(rows, ["faq"], "item", 2)).toHaveLength(1);
  });

  it("aceita as variações de escrita do índice", () => {
    const rows = [
      row("faq", "item1", "a|b"),
      row("faq", "item-2", "c|d"),
      row("faq", "ITEM_3", "e|f"),
    ];
    expect(collectList(rows, ["faq"], "item", 2)).toHaveLength(3);
  });

  it("ignora chave composta em vez de tratá-la como item", () => {
    const rows = [row("faq", "item_1_desc", "texto solto")];
    expect(collectList(rows, ["faq"], "item", 2)).toEqual([]);
  });

  it("casa a seção sem acento e sem caixa", () => {
    const rows = [row("Comissões", "item_1", "Ambiental|")];
    expect(collectList(rows, ["comissoes"], "item", 2)).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */

describe("buildContent — listas ausentes", () => {
  it("devolve todas as listas vazias sem nenhuma linha de conteúdo", () => {
    const content = build([]);
    expect(content.experiencia).toEqual([]);
    expect(content.areas.items).toEqual([]);
    expect(content.atendimento.items).toEqual([]);
    expect(content.formacao.items).toEqual([]);
    expect(content.comissoes.items).toEqual([]);
    expect(content.publicacoes.artigos).toEqual([]);
    expect(content.publicacoes.palestras).toEqual([]);
    expect(content.faq.items).toEqual([]);
    expect(content.links.items).toEqual([]);
    expect(content.galeria.images).toEqual([]);
  });

  it("não lança com linhas malformadas", () => {
    const rows = [
      { client_id: "c1", section: "", key: "", value: null },
      { client_id: "c1", section: "areas", key: "area_x", value: "nao indexada" },
    ] as ContentRow[];
    expect(() => build(rows)).not.toThrow();
    expect(build(rows).areas.items).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */

describe("buildContent — formacao", () => {
  it("mantém instituicao e ano vazios quando não foram informados", () => {
    const content = build([row("formacao", "item_1", "Graduação|Direito")]);
    expect(content.formacao.items[0]).toEqual({
      tipo: "Graduação",
      curso: "Direito",
      instituicao: "",
      ano: "",
    });
  });

  it("aceita instituição vazia no meio e ano preenchido no fim", () => {
    const content = build([row("formacao", "item_1", "MBA|Gestão||2019")]);
    expect(content.formacao.items[0]).toEqual({
      tipo: "MBA",
      curso: "Gestão",
      instituicao: "",
      ano: "2019",
    });
  });
});

/* ------------------------------------------------------------------ */

describe("buildContent — areas e a flag especialista", () => {
  const base = "Direito Ambiental|Quem procura|O que faz|Licenciamento, Resíduos";

  it("libera o rótulo com a flag em 1", () => {
    const content = build([row("areas", "area_1", `${base}|1`)]);
    expect(content.areas.items[0].especialista).toBe(true);
  });

  it("nega o rótulo com a flag em 0", () => {
    const content = build([row("areas", "area_1", `${base}|0`)]);
    expect(content.areas.items[0].especialista).toBe(false);
  });

  it("nega o rótulo quando a flag falta no fim", () => {
    const content = build([row("areas", "area_1", base)]);
    expect(content.areas.items[0].especialista).toBe(false);
  });

  it("nega o rótulo quando um pipe a mais empurra a flag para fora", () => {
    const content = build([row("areas", "area_1", `${base}|sobra|1`)]);
    expect(content.areas.items[0].especialista).toBe(false);
  });

  it("nega o rótulo para qualquer valor não reconhecido", () => {
    const content = build([row("areas", "area_1", `${base}|talvez`)]);
    expect(content.areas.items[0].especialista).toBe(false);
  });

  it("quebra `inclui` em subáreas e descarta o separador solto", () => {
    const content = build([
      row("areas", "area_1", "Direito Digital|quem|o que faz|Privacidade, , Contratos|0"),
    ]);
    expect(content.areas.items[0].inclui).toEqual(["Privacidade", "Contratos"]);
  });

  it("descarta a área sem nome", () => {
    const content = build([row("areas", "area_1", "|quem|o que faz|inclui|1")]);
    expect(content.areas.items).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */

describe("buildContent — contato e rodapé", () => {
  it("só exibe o endereço com a flag afirmativa", () => {
    expect(build([]).contato.exibirEndereco).toBe(false);
    expect(
      build([row("contato", "exibir_endereco", "0")]).contato.exibirEndereco,
    ).toBe(false);
    expect(
      build([row("contato", "exibir_endereco", "1")]).contato.exibirEndereco,
    ).toBe(true);
  });

  it("compõe o oab_display a partir de meta quando o rodapé não traz", () => {
    const content = build([
      row("meta", "oab_numero", "000000"),
      row("meta", "oab_seccional", "SP"),
    ]);
    expect(content.rodape.oabDisplay).toBe("OAB/SP 000000");
  });

  it("prefere o oab_display explícito do rodapé", () => {
    const content = build([
      row("meta", "oab_numero", "000000"),
      row("meta", "oab_seccional", "SP"),
      row("rodape", "oab_display", "OAB/SP 000.000"),
    ]);
    expect(content.rodape.oabDisplay).toBe("OAB/SP 000.000");
  });

  it("cai no aviso fixo do template quando o banco não traz um", () => {
    expect(build([]).rodape.aviso).toContain("Código de Ética");
  });
});

/* ------------------------------------------------------------------ */

describe("buildContent — demais listas", () => {
  it("decodifica experiencia em três campos", () => {
    const content = build([
      row("experiencia", "experiencia_1", "20 anos|Engenharia Ambiental|Direito Ambiental"),
    ]);
    expect(content.experiencia[0]).toEqual({
      anos: "20 anos",
      campo: "Engenharia Ambiental",
      aplicacao: "Direito Ambiental",
    });
  });

  it("decodifica artigo com url ausente sem inventar link", () => {
    const content = build([row("publicacoes", "artigo_1", "Título|Veículo|2024")]);
    expect(content.publicacoes.artigos[0]).toEqual({
      titulo: "Título",
      veiculo: "Veículo",
      ano: "2024",
      url: "",
    });
  });

  it("normaliza a url do artigo quando ela vem sem esquema", () => {
    const content = build([
      row("publicacoes", "artigo_1", "Título|Veículo|2024|exemplo.com/artigo"),
    ]);
    expect(content.publicacoes.artigos[0].url).toBe("https://exemplo.com/artigo");
  });

  it("decodifica palestra em três campos", () => {
    const content = build([row("publicacoes", "palestra_1", "Tema|Evento|2025")]);
    expect(content.publicacoes.palestras[0]).toEqual({
      tema: "Tema",
      evento: "Evento",
      ano: "2025",
    });
  });

  it("descarta a FAQ sem resposta", () => {
    const content = build([
      row("faq", "item_1", "Só a pergunta"),
      row("faq", "item_2", "Pergunta|Resposta"),
    ]);
    expect(content.faq.items).toHaveLength(1);
    expect(content.faq.items[0].pergunta).toBe("Pergunta");
  });

  it("mantém detalhe vazio na comissão sem detalhe", () => {
    const content = build([row("comissoes", "item_1", "Ambiental")]);
    expect(content.comissoes.items[0]).toEqual({
      nome: "Ambiental",
      detalhe: "",
    });
  });
});

/* ------------------------------------------------------------------ */

describe("buildContent — variante do hero", () => {
  const heroImg: ImageRow = {
    client_id: "c1",
    section: "hero",
    url: "https://exemplo.com/hero.jpg",
    alt: "",
  };

  it("cai na composição tipográfica quando a key não existe", () => {
    expect(build([]).hero.variante).toBe("tipografica");
  });

  it("usa o retrato quando a key pede retrato e a imagem existe", () => {
    const content = buildContent(
      CLIENT,
      [row("hero", "variante", "retrato")],
      [heroImg],
    );
    expect(content.hero.variante).toBe("retrato");
    expect(content.hero.image?.url).toBe("https://exemplo.com/hero.jpg");
  });

  it("derruba retrato em tipográfica quando não há imagem", () => {
    const content = buildContent(CLIENT, [row("hero", "variante", "retrato")], []);
    expect(content.hero.variante).toBe("tipografica");
    expect(content.hero.image).toBeNull();
  });

  it("normaliza caixa e acento do valor da key", () => {
    const content = buildContent(
      CLIENT,
      [row("hero", "variante", "  RETRATO ")],
      [heroImg],
    );
    expect(content.hero.variante).toBe("retrato");
  });

  it("cai na tipográfica para qualquer valor desconhecido", () => {
    const content = buildContent(
      CLIENT,
      [row("hero", "variante", "carrossel")],
      [heroImg],
    );
    expect(content.hero.variante).toBe("tipografica");
  });
});

/* ------------------------------------------------------------------ */

describe("buildContent — description", () => {
  it("usa a description do banco quando existe", () => {
    const content = build([row("meta", "description", "Texto escolhido a mão.")]);
    expect(content.meta.description).toBe("Texto escolhido a mão.");
  });

  it("compõe a partir do banco quando a key está vazia", () => {
    const content = build([
      row("meta", "oab_numero", "000000"),
      row("meta", "oab_seccional", "SP"),
      row("areas", "area_1", "Direito Ambiental|quem|faz|inclui|0"),
      row("areas", "area_2", "Direito Digital|quem|faz|inclui|0"),
      row("contato", "modalidade", "Presencial e online"),
    ]);
    expect(content.meta.description).toBe(
      "Escritório Demo · OAB/SP 000000. Atuação em Direito Ambiental e Direito Digital. Atendimento presencial e online.",
    );
  });

  it("enumera três ou mais áreas com vírgula e 'e'", () => {
    const content = build([
      row("areas", "area_1", "Um|q|f|i|0"),
      row("areas", "area_2", "Dois|q|f|i|0"),
      row("areas", "area_3", "Três|q|f|i|0"),
    ]);
    expect(content.meta.description).toContain("Atuação em Um, Dois e Três.");
  });

  it("nunca lista área vinda de constante: sem áreas, não cita nenhuma", () => {
    const content = build([]);
    expect(content.meta.description).toBe(
      "Escritório Demo. Advocacia com atendimento a pessoas e empresas, presencial e online.",
    );
    // O ponto do achado da auditoria: nenhuma área fixa no código.
    for (const area of [
      "Direito Empresarial",
      "inventários",
      "previdenciário",
      "trabalhista",
      "cível",
    ]) {
      expect(content.meta.description.toLowerCase()).not.toContain(
        area.toLowerCase(),
      );
    }
  });

  it("não inventa áreas quando só há modalidade", () => {
    const content = build([row("contato", "modalidade", "Somente online")]);
    expect(content.meta.description).toBe(
      "Escritório Demo. Atendimento somente online.",
    );
  });
});
