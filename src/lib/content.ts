/*
 * Camada pura do modelo de conteudo: decodificacao das linhas de
 * `content`/`images` num `SiteContent`. Sem React e sem Supabase, para
 * poder ser testada sem subir nada. O I/O vive em `fetchContent.ts`.
 */
import type {
  AreaItem,
  ArtigoItem,
  ClientRow,
  ComissaoItem,
  ContentRow,
  ExperienciaItem,
  FaqItem,
  FormacaoItem,
  HeroVariante,
  ImageRow,
  LinkItem,
  PalestraItem,
  PassoItem,
  SiteContent,
  SiteImage,
} from "./types";

const TEMPLATE_NAME = "advocacia";

/** Navy sobrio — cor primaria de reserva. */
const DEFAULT_RGB: [number, number, number] = [27, 42, 65];

/**
 * Latao dessaturado — cor secundaria de reserva.
 *
 * **Nunca cair na primaria aqui.** Era esse o bug herdado do
 * `template-consultorio`: sem `meta/secondary_color`, `--secondary` assumia o
 * valor de `--primary` e todo o sistema de acento (eyebrow, numeracao das
 * areas, bordas de hover, selo do acordeao) sumia dentro da primaria sem
 * erro, sem warn e sem quebrar build. Ver "Problemas conhecidos" no
 * CLAUDE.md do workspace.
 */
const DEFAULT_SECONDARY_RGB: [number, number, number] = [138, 121, 93];

/**
 * Aviso do Codigo de Etica. Fica no template e **nao e lido do banco**: e o
 * texto que sustenta a conformidade da pagina, entao nao pode ser apagado
 * nem reescrito pelo admin.
 */
/**
 * Description de reserva. Generica de proposito e **sem area nenhuma**: uma
 * lista de areas fixa no template descreveria a atuacao de um cliente com as
 * areas de outro.
 */
const DESCRICAO_PADRAO =
  "Advocacia com atendimento a pessoas e empresas, presencial e online.";

const AVISO =
  "Este site tem caráter meramente informativo e não constitui oferta de " +
  "serviços nem captação de clientela. O conteúdo segue o Provimento nº " +
  "205/2021 e o Código de Ética e Disciplina da OAB.";

/* ------------------------------------------------------------------ */
/* Utilitarios                                                         */
/* ------------------------------------------------------------------ */

/** minusculas + sem acentos, para casar secoes/chaves de forma tolerante. */
function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function str(value: unknown): string {
  if (value == null) return "";
  return typeof value === "string" ? value : String(value);
}

/** Indexa as linhas de `content` num mapa "secao::chave" -> valor. */
function indexContent(rows: ContentRow[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    if (!row?.section || !row?.key) continue;
    const value = str(row.value).trim();
    if (!value) continue;
    map.set(`${normalize(row.section)}::${normalize(row.key)}`, value);
  }
  return map;
}

/** Primeiro valor encontrado testando varios nomes de secao/chave. */
function pick(
  map: Map<string, string>,
  sections: string[],
  keys: string[],
): string | undefined {
  for (const section of sections) {
    for (const key of keys) {
      const value = map.get(`${normalize(section)}::${normalize(key)}`);
      if (value) return value;
    }
  }
  return undefined;
}

/**
 * Quebra o valor de uma linha de lista em exatamente `arity` campos.
 *
 * - campo faltando no fim  -> ""
 * - campo vazio no meio    -> "", com a posicao preservada
 * - pipe a mais            -> os segmentos excedentes sao descartados
 *
 * Descartar o excedente, em vez de concatena-lo no ultimo campo, e
 * deliberado: o ultimo campo de `area_N` e a flag `especialista`, e
 * concatenar sobra nela transformaria "1" em algo que nao e "1". Assim o
 * erro de digitacao cai sempre para o lado seguro — sem "Especialista em".
 */
export function splitFields(raw: string, arity: number): string[] {
  const parts = str(raw).split("|");
  const fields: string[] = [];
  for (let i = 0; i < arity; i += 1) {
    fields.push((parts[i] ?? "").trim());
  }
  return fields;
}

/**
 * Le as linhas `prefixo_N` de uma secao e devolve uma lista ordenada por N,
 * cada item ja quebrado em `arity` campos. Lista ausente devolve [].
 *
 * So casa a chave indexada pura (`item_1`, `item1`, `item-1`, `item 1`):
 * o modelo e inteiramente codificado por pipe, entao uma chave composta
 * como `item_1_desc` e ignorada em vez de virar campo fantasma.
 */
export function collectList(
  rows: ContentRow[],
  sections: string[],
  prefix: string,
  arity: number,
): string[][] {
  const wanted = sections.map(normalize);
  const pattern = new RegExp(`^${normalize(prefix)}[ _-]?(\\d+)$`);
  const byIndex = new Map<number, string>();

  for (const row of rows) {
    if (!row?.section || !row?.key) continue;
    if (!wanted.includes(normalize(row.section))) continue;
    const match = normalize(row.key).match(pattern);
    if (!match) continue;
    const value = str(row.value).trim();
    // Linha sem valor nao e "item com campos vazios": e item inexistente.
    if (!value) continue;
    byIndex.set(Number(match[1]), value);
  }

  return [...byIndex.keys()]
    .sort((a, b) => a - b)
    .map((index) => splitFields(byIndex.get(index) as string, arity));
}

/**
 * Flags do banco (`especialista`, `exibir_endereco`). So um conjunto fechado
 * de valores conta como afirmativo; qualquer outra coisa e falso.
 */
const AFFIRMATIVE = new Set(["1", "sim", "true", "s", "yes", "y"]);

function isAffirmative(raw: string | undefined): boolean {
  if (!raw) return false;
  return AFFIRMATIVE.has(normalize(raw));
}

/**
 * O `texto` traz o numero de inscricao `numero`? Compara so os digitos, e o
 * numero tem que aparecer inteiro — nao como pedaco de um numero maior.
 *
 * Decide se o rodape pode omitir a linha da OAB na home (ela ja esta no
 * hero). Sem numero cadastrado, e sempre falso: na duvida, a linha fica.
 */
export function inscricaoNoTexto(texto: string, numero: string): boolean {
  const alvo = numero.replace(/\D/g, "");
  if (!alvo) return false;
  const grupos: string[] =
    texto.replace(/(\d)[.\s](?=\d)/g, "$1").match(/\d+/g) ?? [];
  return grupos.includes(alvo);
}

/** ["a","b","c"] -> "a, b e c". */
function enumerar(itens: string[]): string {
  if (itens.length === 0) return "";
  if (itens.length === 1) return itens[0];
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/** "a, b , c" -> ["a", "b", "c"]; vazio -> []. */
function splitCommas(raw: string): string[] {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Indexa `images` por secao (uma secao pode ter varias imagens). */
function indexImages(rows: ImageRow[]): Map<string, SiteImage[]> {
  const map = new Map<string, SiteImage[]>();
  for (const row of rows) {
    if (!row?.url) continue;
    const section = normalize(row.section ?? "");
    const list = map.get(section) ?? [];
    list.push({ url: row.url.trim(), alt: str(row.alt).trim() });
    map.set(section, list);
  }
  return map;
}

function firstImage(
  map: Map<string, SiteImage[]>,
  sections: string[],
): SiteImage | null {
  for (const section of sections) {
    const list = map.get(normalize(section));
    if (list && list.length > 0) return list[0];
  }
  return null;
}

/** Todas as imagens da primeira secao que tiver alguma — alimenta a galeria. */
function allImages(
  map: Map<string, SiteImage[]>,
  sections: string[],
): SiteImage[] {
  for (const section of sections) {
    const list = map.get(normalize(section));
    if (list && list.length > 0) return list;
  }
  return [];
}

/** Converte hex (#abc / #aabbcc) ou rgb(...) num trio [r, g, b]. */
function parseColor(raw?: string): [number, number, number] | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();

  const hex3 = value.match(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/);
  if (hex3) {
    return [
      parseInt(hex3[1] + hex3[1], 16),
      parseInt(hex3[2] + hex3[2], 16),
      parseInt(hex3[3] + hex3[3], 16),
    ];
  }

  const hex6 = value.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
  if (hex6) {
    return [parseInt(hex6[1], 16), parseInt(hex6[2], 16), parseInt(hex6[3], 16)];
  }

  const rgb = value.match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/);
  if (rgb) {
    const channel = (n: string) => Math.max(0, Math.min(255, Number(n)));
    return [channel(rgb[1]), channel(rgb[2]), channel(rgb[3])];
  }

  return null;
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

/** Formato aceito pelas CSS vars --primary / --secondary: "r g b". */
function channels([r, g, b]: [number, number, number]): string {
  return `${r} ${g} ${b}`;
}

/**
 * Canais da cor de texto que vai por cima de `[r, g, b]` — o valor de
 * `--on-primary` / `--on-secondary`. Escolhido por luminancia relativa
 * (WCAG), no momento da injecao: cor clara recebe tinta escura e vice-versa.
 */
export function onColorChannels([r, g, b]: [number, number, number]): string {
  const toLinear = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.55 ? "27 24 19" : "255 255 255";
}

/** Quebra um texto longo em paragrafos. */
function toParagraphs(raw: string | undefined): string[] {
  if (!raw) return [];
  const blocks = raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  if (blocks.length > 1) return blocks;
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function ensureHref(raw: string): string {
  const url = raw.trim();
  if (!url) return url;
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(url) || url.startsWith("//")) {
    return url;
  }
  return `https://${url}`;
}

/* ------------------------------------------------------------------ */
/* Decodificadores de item                                             */
/* ------------------------------------------------------------------ */

function toExperiencia([anos, campo, aplicacao]: string[]): ExperienciaItem | null {
  if (!anos && !campo) return null;
  return { anos, campo, aplicacao };
}

function toArea([
  nome,
  quemProcura,
  oQueFaz,
  inclui,
  especialista,
]: string[]): AreaItem | null {
  if (!nome) return null;
  return {
    nome,
    quemProcura,
    oQueFaz,
    inclui: splitCommas(inclui),
    especialista: isAffirmative(especialista),
  };
}

function toPasso([titulo, descricao]: string[]): PassoItem | null {
  if (!titulo) return null;
  return { titulo, descricao };
}

function toFormacao([tipo, curso, instituicao, ano]: string[]): FormacaoItem | null {
  if (!tipo && !curso) return null;
  return { tipo, curso, instituicao, ano };
}

function toComissao([nome, detalhe]: string[]): ComissaoItem | null {
  if (!nome) return null;
  return { nome, detalhe };
}

function toArtigo([titulo, veiculo, ano, url]: string[]): ArtigoItem | null {
  if (!titulo) return null;
  return { titulo, veiculo, ano, url: url ? ensureHref(url) : "" };
}

function toPalestra([tema, evento, ano]: string[]): PalestraItem | null {
  if (!tema) return null;
  return { tema, evento, ano };
}

function toFaq([pergunta, resposta]: string[]): FaqItem | null {
  if (!pergunta || !resposta) return null;
  return { pergunta, resposta };
}

function toLink([label, url]: string[]): LinkItem | null {
  const href = ensureHref(url);
  if (!href) return null;
  if (label) return { label, url: href };
  try {
    return { label: new URL(href).hostname.replace(/^www\./, ""), url: href };
  } catch {
    return { label: href, url: href };
  }
}

/** Descarta os itens que o decodificador rejeitou. */
function compact<T>(items: (T | null)[]): T[] {
  return items.filter((item): item is T => item !== null);
}

/* ------------------------------------------------------------------ */
/* Montagem do conteudo                                                */
/* ------------------------------------------------------------------ */

export function buildContent(
  client: ClientRow | null,
  contentRows: ContentRow[],
  imageRows: ImageRow[],
): SiteContent {
  const content = indexContent(contentRows);
  const images = indexImages(imageRows);

  const companyName =
    (client?.name && client.name.trim()) ||
    pick(content, ["meta", "geral"], ["company_name", "name", "nome"]) ||
    "Advocacia";

  const primaryRgb =
    parseColor(
      pick(
        content,
        ["meta", "geral", "tema", "config"],
        ["primary_color", "primarycolor", "color", "cor", "cor_primaria"],
      ),
    ) ?? DEFAULT_RGB;

  // Cor secundaria opcional. Cai na constante propria — nunca na primaria,
  // ou o acento inteiro desaparece num cliente que deixou o campo vazio.
  const secondaryRgb =
    parseColor(
      pick(
        content,
        ["meta", "geral", "tema", "config"],
        ["secondary_color", "secondarycolor", "cor_secundaria", "accent"],
      ),
    ) ?? DEFAULT_SECONDARY_RGB;

  const logoUrl =
    pick(content, ["meta", "geral"], ["logo", "logo_url", "logotipo"]) ||
    firstImage(images, ["logo", "marca", "logotipo"])?.url ||
    null;

  // Variante escura, para os fundos claros. Sem ela, quem precisa de logo
  // escuro mostra o nome em texto — melhor um nome legivel que um logo branco
  // sobre papel branco.
  const logoEscuroUrl =
    pick(content, ["meta", "geral"], ["logo_escuro", "logo_dark", "logotipo_escuro"]) ||
    firstImage(images, ["logo_escuro", "logo-escuro", "logo_dark", "marca_escura"])?.url ||
    null;

  const oabNumero = pick(content, ["meta"], ["oab_numero", "oab", "numero_oab"]) || "";
  const oabSeccional =
    pick(content, ["meta"], ["oab_seccional", "seccional", "oab_uf"]) || "";

  const oabDisplayBruto =
    pick(content, ["rodape", "footer"], ["oab_display", "oab"]) ||
    (oabNumero && oabSeccional ? `OAB/${oabSeccional} ${oabNumero}` : oabNumero);

  /* ---- listas ---- */

  const experiencia = compact(
    collectList(contentRows, ["experiencia"], "experiencia", 3).map(toExperiencia),
  );

  const areaItems = compact(
    collectList(contentRows, ["areas", "atuacao"], "area", 5).map(toArea),
  );

  const passos = compact(
    collectList(contentRows, ["atendimento", "como_funciona"], "passo", 2).map(toPasso),
  );

  const formacaoItems = compact(
    collectList(contentRows, ["formacao"], "item", 4).map(toFormacao),
  );

  const comissaoItems = compact(
    collectList(contentRows, ["comissoes"], "item", 2).map(toComissao),
  );

  const artigos = compact(
    collectList(contentRows, ["publicacoes"], "artigo", 4).map(toArtigo),
  );

  const palestras = compact(
    collectList(contentRows, ["publicacoes"], "palestra", 3).map(toPalestra),
  );

  const faqItems = compact(
    collectList(contentRows, ["faq", "perguntas"], "item", 2).map(toFaq),
  );

  const linkItems = compact(
    collectList(contentRows, ["links", "link"], "item", 2).map(toLink),
  );

  /* ---- sobre: paragrafo_1..3, com texto corrido como alternativa ---- */

  const paragrafos = [1, 2, 3]
    .map((n) => pick(content, ["sobre", "about"], [`paragrafo_${n}`]) || "")
    .filter(Boolean);
  const paragraphs =
    paragrafos.length > 0
      ? paragrafos
      : toParagraphs(
          pick(content, ["sobre", "about"], ["texto", "text", "paragrafo", "descricao"]),
        );

  const sobreNome =
    pick(content, ["sobre", "about"], ["nome", "name"]) || companyName;

  /* ---- hero: variante, com queda para a composicao tipografica ---- */

  const heroImage = firstImage(images, ["hero", "banner", "capa"]);
  const varianteRaw = normalize(
    pick(content, ["hero"], ["variante", "variant", "layout"]) || "",
  );
  // `retrato` sem imagem viraria uma moldura vazia; cai na tipografica.
  const heroVariante: HeroVariante =
    varianteRaw === "retrato" && heroImage ? "retrato" : "tipografica";

  /* ---- description: do banco, ou composta do que ha no banco ---- */

  const modalidade = pick(content, ["contato", "contact"], ["modalidade"]) || "";
  const areasNomes = areaItems.map((a) => a.nome).filter(Boolean);

  const descricaoComposta = [
    [companyName, oabDisplayBruto].filter(Boolean).join(" · ") + ".",
    areasNomes.length > 0 ? `Atuação em ${enumerar(areasNomes)}.` : "",
    modalidade ? `Atendimento ${modalidade.toLowerCase()}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Só o nome no banco não descreve nada; aí sim cai no texto genérico.
  const description =
    pick(content, ["meta", "geral"], ["description", "descricao"]) ||
    (areasNomes.length > 0 || modalidade
      ? descricaoComposta
      : `${companyName}. ${DESCRICAO_PADRAO}`);

  /* ---- rodape ---- */

  const oabDisplay = oabDisplayBruto;

  return {
    meta: {
      clientId: client?.id ?? null,
      companyName,
      templateName:
        pick(content, ["meta"], ["template"]) || TEMPLATE_NAME,
      primaryColor: rgbToHex(primaryRgb),
      primaryRgb: channels(primaryRgb),
      onPrimaryRgb: onColorChannels(primaryRgb),
      secondaryColor: rgbToHex(secondaryRgb),
      secondaryRgb: channels(secondaryRgb),
      onSecondaryRgb: onColorChannels(secondaryRgb),
      oabNumero,
      oabSeccional,
      slogan: pick(content, ["meta"], ["slogan", "tagline"]) || "",
      description,
      logoUrl,
    logoEscuroUrl,
      domain: client?.domain ?? null,
      resolved: Boolean(client?.id),
    },

    hero: {
      variante: heroVariante,
      // Sem fallback: o rotulo costuma ser o numero da OAB, sempre proprio
      // do cliente. Vazio some da tela.
      eyebrow: pick(content, ["hero"], ["eyebrow", "tagline", "label"]) || "",
      title:
        pick(content, ["hero"], ["title", "titulo", "headline"]) ||
        "Orientação jurídica com acompanhamento de cada etapa",
      subtitle:
        pick(content, ["hero"], ["subtitle", "subtitulo", "description", "texto"]) ||
        "Atendimento a pessoas e empresas, com explicação sobre os caminhos possíveis e sobre o que cada um envolve.",
      ctaLabel:
        pick(content, ["hero"], ["cta_label", "cta", "ctalabel", "button"]) ||
        "Entrar em contato",
      ctaWhatsappMessage:
        pick(content, ["hero"], ["cta_whatsapp_message", "cta_whatsapp", "whatsapp_message"]) ||
        "Olá! Vim pelo site e gostaria de falar com o escritório.",
      image: heroImage,
    },

    sobre: {
      nome: sobreNome,
      title: pick(content, ["sobre", "about"], ["title", "titulo"]) || sobreNome,
      paragraphs,
      image: firstImage(images, ["perfil", "sobre", "about", "profissional"]),
    },

    experiencia,

    areas: {
      title:
        pick(content, ["areas", "atuacao"], ["title", "titulo"]) || "Áreas de atuação",
      intro: pick(content, ["areas", "atuacao"], ["intro", "subtitle", "subtitulo"]) || "",
      items: areaItems,
    },

    atendimento: {
      title:
        pick(content, ["atendimento", "como_funciona"], ["title", "titulo"]) ||
        "Como funciona o primeiro contato",
      intro:
        pick(content, ["atendimento", "como_funciona"], ["intro", "subtitle", "subtitulo"]) ||
        "",
      items: passos,
    },

    formacao: {
      title: pick(content, ["formacao"], ["title", "titulo"]) || "Formação",
      // Prosa, quando a trajetoria nao cabe em "tipo|curso|...". O componente
      // mostra ou ela ou a lista, nunca as duas.
      paragraphs: toParagraphs(pick(content, ["formacao"], ["paragrafo", "texto"])),
      items: formacaoItems,
      idiomas: pick(content, ["formacao"], ["idiomas"]) || "",
    },

    comissoes: {
      title: pick(content, ["comissoes"], ["title", "titulo"]) || "Comissões",
      items: comissaoItems,
    },

    publicacoes: {
      title: pick(content, ["publicacoes"], ["title", "titulo"]) || "Publicações",
      artigos,
      palestras,
    },

    faq: {
      title: pick(content, ["faq", "perguntas"], ["title", "titulo"]) || "Perguntas frequentes",
      items: faqItems,
    },

    contato: {
      title:
        pick(content, ["contato", "contact"], ["title", "titulo"]) ||
        "Fale com o escritório",
      whatsapp: pick(content, ["contato", "contact"], ["whatsapp", "wpp", "zap"]) || "",
      telefone: pick(content, ["contato", "contact"], ["telefone", "phone", "tel"]) || "",
      email: pick(content, ["contato", "contact"], ["email", "e-mail", "mail"]) || "",
      endereco: pick(content, ["contato", "contact"], ["endereco", "address"]) || "",
      referencia: pick(content, ["contato", "contact"], ["referencia", "reference"]) || "",
      exibirEndereco: isAffirmative(
        pick(content, ["contato", "contact"], ["exibir_endereco", "mostrar_endereco"]),
      ),
      horario: pick(content, ["contato", "contact"], ["horario", "hours"]) || "",
      instagram: pick(content, ["contato", "contact"], ["instagram", "insta"]) || "",
      linkedin: pick(content, ["contato", "contact"], ["linkedin"]) || "",
      mapsEmbed: pick(content, ["contato", "contact"], ["maps_embed", "mapa", "map"]) || "",
      modalidade: pick(content, ["contato", "contact"], ["modalidade"]) || "",
    },

    rodape: {
      razaoSocial:
        pick(content, ["rodape", "footer"], ["razao_social", "razaosocial"]) || "",
      cnpj: pick(content, ["rodape", "footer"], ["cnpj"]) || "",
      oabDisplay,
      // Constante: de proposito nao ha `pick` aqui.
      aviso: AVISO,
    },

    // Galeria opcional, sem copy propria — so as imagens do slot `escritorio`.
    galeria: {
      images: allImages(images, ["escritorio", "galeria"]),
    },

    links: {
      headline: pick(content, ["links", "link"], ["headline", "title", "titulo"]) || companyName,
      bio: pick(content, ["links", "link"], ["bio", "subtitle", "description", "texto"]) || "",
      items: linkItems,
    },
  };
}
