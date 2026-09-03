import type { MetaContent } from "@/lib/types";

/**
 * Injeta o tema do cliente como CSS vars, em tempo de render.
 *
 * Uma implementacao so para a home e para `/links`: enquanto eram duas
 * copias da mesma string, mudar uma var significava lembrar de mudar os
 * dois arquivos.
 *
 * Os quatro valores vem de `channels()` / `onColorChannels()`, que sempre
 * devolvem "r g b" a partir de inteiros ja parseados — nunca a string crua
 * do banco. E o que torna seguro interpolar direto dentro de <style>.
 */
export default function ThemeStyle({ meta }: { meta: MetaContent }) {
  const css =
    ":root{" +
    `--primary:${meta.primaryRgb};` +
    `--on-primary:${meta.onPrimaryRgb};` +
    `--secondary:${meta.secondaryRgb};` +
    `--on-secondary:${meta.onSecondaryRgb};` +
    "}";

  return <style>{css}</style>;
}
