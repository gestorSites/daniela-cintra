import { cache } from "react";
import { supabase } from "./supabase";
import { buildContent } from "./content";
import type { ClientRow, ContentRow, ImageRow, SiteContent } from "./types";

const DEFAULT_SLUG = "daniela-cintra";

/* ------------------------------------------------------------------ */
/* API publica                                                         */
/* ------------------------------------------------------------------ */

/**
 * Busca todo o conteudo do cliente no Supabase e devolve um objeto
 * estruturado por secao. Envolto em `cache()` para que page + metadata
 * compartilhem uma unica consulta por requisicao. Nunca lanca: qualquer
 * falha vira warn e o conteudo cai nos fallbacks do template.
 */
export const fetchContent = cache(async (slug?: string): Promise<SiteContent> => {
  const clientSlug = (slug || process.env.NEXT_PUBLIC_CLIENT_SLUG || DEFAULT_SLUG).trim();

  const { data: clientData, error: clientError } = await supabase
    .from("clients")
    .select("id, slug, name, domain, active")
    .eq("slug", clientSlug)
    .maybeSingle();
  const client: ClientRow | null = (clientData as ClientRow | null) ?? null;

  if (clientError) {
    console.warn(
      `[fetchContent] Falha ao buscar o cliente "${clientSlug}": ${clientError.message}`,
    );
  }
  if (!client) {
    console.warn(
      `[fetchContent] Nenhum cliente para o slug "${clientSlug}". ` +
        "Usando conteudo padrao (verifique os dados e o RLS no Supabase).",
    );
  }

  let contentRows: ContentRow[] = [];
  let imageRows: ImageRow[] = [];

  if (client?.id) {
    const [contentResult, imagesResult] = await Promise.all([
      supabase
        .from("content")
        .select("client_id, section, key, value")
        .eq("client_id", client.id),
      supabase
        .from("images")
        .select("client_id, section, url, alt")
        .eq("client_id", client.id)
        .order("updated_at", { ascending: true }),
    ]);

    if (contentResult.error) {
      console.warn(`[fetchContent] Falha ao buscar content: ${contentResult.error.message}`);
    } else {
      contentRows = contentResult.data ?? [];
    }

    if (imagesResult.error) {
      console.warn(`[fetchContent] Falha ao buscar images: ${imagesResult.error.message}`);
    } else {
      imageRows = imagesResult.data ?? [];
    }
  }

  return buildContent(client ?? null, contentRows, imageRows);
});
