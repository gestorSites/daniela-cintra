import AnimatedSection from "./AnimatedSection";
import Carousel from "./Carousel";
import type { GaleriaContent } from "@/lib/types";

interface GaleriaProps {
  galeria: GaleriaContent;
  /** texto alternativo de reserva das imagens sem alt. */
  companyName: string;
}

/**
 * Galeria opcional, ligada ao slot de imagem `escritorio`. Nao tem copy
 * propria — nem titulo, nem legenda. Sem imagem, nao renderiza nada:
 * sem secao, sem espacamento residual.
 */
export default function Galeria({ galeria, companyName }: GaleriaProps) {
  if (galeria.images.length === 0) return null;

  return (
    <section id="galeria" className="pt-24 pb-8 sm:pt-32 sm:pb-12">
      <AnimatedSection className="container-wide">
        <div className="mx-auto max-w-4xl">
          <Carousel images={galeria.images} label={companyName} />
        </div>
      </AnimatedSection>
    </section>
  );
}
