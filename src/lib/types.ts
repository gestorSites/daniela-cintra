/* ---------- Linhas cruas das tabelas do Supabase ---------- */

export interface ClientRow {
  id: string;
  slug: string;
  name: string | null;
  domain: string | null;
  active: boolean | null;
}

export interface ContentRow {
  client_id: string;
  section: string;
  key: string;
  value: string | null;
}

export interface ImageRow {
  client_id: string;
  section: string;
  url: string;
  alt: string | null;
}

/* ---------- Blocos estruturados consumidos pelas paginas ---------- */

export interface SiteImage {
  url: string;
  alt: string;
}

/** Ancora de navegacao interna (menu e rodape). */
export interface NavLink {
  label: string;
  href: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface MetaContent {
  /** id do cliente na tabela `clients` (usado ao gravar mensagens). */
  clientId: string | null;
  companyName: string;
  /** identificador do template (`advocacia`). */
  templateName: string;
  /** cor primaria em hex (#rrggbb). */
  primaryColor: string;
  /** canais "r g b" para a CSS var --primary. */
  primaryRgb: string;
  /** canais "r g b" para texto sobre a cor primaria (--on-primary). */
  onPrimaryRgb: string;
  /** cor secundaria em hex (#rrggbb). */
  secondaryColor: string;
  /** canais "r g b" para a CSS var --secondary. */
  secondaryRgb: string;
  /** canais "r g b" para texto sobre a cor secundaria (--on-secondary). */
  onSecondaryRgb: string;
  /** numero de inscricao na OAB, so digitos (ex.: "000000"). */
  oabNumero: string;
  /** seccional da OAB (ex.: "SP"). */
  oabSeccional: string;
  slogan: string;
  /**
   * Description das paginas. Vem de `meta/description`; vazia, e **composta a
   * partir do que ja esta no banco** (nome, inscricao, nomes das areas,
   * modalidade). Nunca lista area vinda de constante: o texto fixo de um
   * cliente viraria declaracao de atuacao falsa no site do proximo.
   */
  description: string;
  logoUrl: string | null;
  domain: string | null;
  /** true quando o cliente foi encontrado no Supabase. */
  resolved: boolean;
}

/**
 * Variante visual do hero.
 * - `retrato`: texto a esquerda, retrato a direita.
 * - `tipografica`: composicao sobre a cor primaria, com o logo.
 *
 * `retrato` sem imagem cai em `tipografica` — o site precisa ficar
 * apresentavel antes de existir foto, e sem refatoracao quando ela chegar.
 */
export type HeroVariante = "retrato" | "tipografica";

export interface HeroContent {
  variante: HeroVariante;
  /** rotulo curto acima do titulo (ex.: "Advogada · OAB/SP 000000"). */
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  /** texto ja preenchido na conversa do WhatsApp aberta pelo CTA. */
  ctaWhatsappMessage: string;
  /** slot de imagem `hero`. */
  image: SiteImage | null;
}

export interface SobreContent {
  nome: string;
  /** paragrafo_1..3, na ordem, ja sem os vazios. */
  paragraphs: string[];
  /** slot de imagem `perfil`. */
  image: SiteImage | null;
}

/**
 * Bloco de experiencia: `"anos|campo|aplicacao"`.
 * O numero e sempre de experiencia no `campo` (gestao, por exemplo), nunca
 * de advocacia — a redacao tem que deixar isso explicito na tela.
 */
export interface ExperienciaItem {
  anos: string;
  campo: string;
  aplicacao: string;
}

/** Area de atuacao: `"nome|quem_procura|o_que_faz|inclui|especialista"`. */
export interface AreaItem {
  nome: string;
  quemProcura: string;
  oQueFaz: string;
  /** subareas ja separadas por virgula. */
  inclui: string[];
  /**
   * Libera o rotulo "Especialista em". Falso em qualquer valor que nao seja
   * afirmativo — usar o rotulo sem especializacao real e vedado pela OAB,
   * entao a duvida sempre cai para "Atuacao em".
   */
  especialista: boolean;
}

export interface AreasContent {
  title: string;
  intro: string;
  items: AreaItem[];
}

/** Passo do primeiro contato: `"titulo|descricao"`. */
export interface PassoItem {
  titulo: string;
  descricao: string;
}

export interface AtendimentoContent {
  title: string;
  intro: string;
  items: PassoItem[];
}

/**
 * Item de formacao: `"tipo|curso|instituicao|ano"`.
 * `instituicao` e `ano` sao opcionais e nascem vazios — quem renderiza tem
 * que omitir o campo inteiro, sem hifen solto nem parentese vazio.
 */
export interface FormacaoItem {
  tipo: string;
  curso: string;
  instituicao: string;
  ano: string;
}

export interface FormacaoContent {
  title: string;
  items: FormacaoItem[];
  idiomas: string;
}

/** Comissao da OAB: `"nome|detalhe"`. */
export interface ComissaoItem {
  nome: string;
  detalhe: string;
}

export interface ComissoesContent {
  title: string;
  items: ComissaoItem[];
}

/** Artigo publicado: `"titulo|veiculo|ano|url"`. */
export interface ArtigoItem {
  titulo: string;
  veiculo: string;
  ano: string;
  url: string;
}

/** Palestra: `"tema|evento|ano"`. */
export interface PalestraItem {
  tema: string;
  evento: string;
  ano: string;
}

export interface PublicacoesContent {
  title: string;
  artigos: ArtigoItem[];
  palestras: PalestraItem[];
}

/** Pergunta e resposta: `"pergunta|resposta"`. */
export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export interface FaqContent {
  title: string;
  items: FaqItem[];
}

export interface ContatoContent {
  title: string;
  /** numero de WhatsApp (so digitos, com DDI) ou vazio. */
  whatsapp: string;
  telefone: string;
  email: string;
  endereco: string;
  /** ponto de referencia, exibido logo abaixo do endereco. */
  referencia: string;
  /** o mapa so aparece quando isto e afirmativo. */
  exibirEndereco: boolean;
  horario: string;
  instagram: string;
  linkedin: string;
  /** URL do iframe de mapa (Google Maps embed). */
  mapsEmbed: string;
  modalidade: string;
}

export interface RodapeContent {
  razaoSocial: string;
  cnpj: string;
  /** "OAB/SP 000000" — composto a partir de `meta` quando nao informado. */
  oabDisplay: string;
  /**
   * Aviso do Codigo de Etica. **Constante do template, nao vem do banco** —
   * e o texto que sustenta a conformidade da pagina, entao nao pode ser
   * apagado nem reescrito pelo admin.
   */
  aviso: string;
}

/**
 * Galeria opcional (slot de imagem `escritorio`). Nao tem copy propria: e so
 * a lista de imagens. Lista vazia significa "nao renderiza nada".
 */
export interface GaleriaContent {
  images: SiteImage[];
}

/** Pagina `/links`. */
export interface LinksContent {
  headline: string;
  bio: string;
  items: LinkItem[];
}

export interface SiteContent {
  meta: MetaContent;
  hero: HeroContent;
  sobre: SobreContent;
  experiencia: ExperienciaItem[];
  areas: AreasContent;
  atendimento: AtendimentoContent;
  formacao: FormacaoContent;
  comissoes: ComissoesContent;
  publicacoes: PublicacoesContent;
  faq: FaqContent;
  contato: ContatoContent;
  rodape: RodapeContent;
  galeria: GaleriaContent;
  links: LinksContent;
}
