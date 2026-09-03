"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "./Icons";
import type { SiteImage } from "@/lib/types";

interface CarouselProps {
  images: SiteImage[];
  /** texto alternativo de reserva quando a imagem nao tem alt. */
  label: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const AUTOPLAY_MS = 5500;

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 72 : -72 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -72 : 72 }),
};

/**
 * Carrossel de imagens generico: setas, indicadores, arraste e autoplay com
 * pausa ao passar o mouse. Respeita prefers-reduced-motion.
 * Sem copy propria: lista vazia devolve null e nao deixa rastro na pagina.
 */
export default function Carousel({ images, label }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((current) => (current + dir + count) % count);
    },
    [count],
  );

  function goTo(target: number) {
    setDirection(target >= index ? 1 : -1);
    setIndex(target);
  }

  useEffect(() => {
    if (count < 2 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, paused, paginate]);

  if (count === 0) return null;

  const current = images[index];

  return (
    <div
      className="select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[2rem] border border-line bg-paper-raised shadow-soft">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={index}
            src={current.url}
            alt={current.alt || label}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_event, info: PanInfo) => {
              if (info.offset.x < -70) paginate(1);
              else if (info.offset.x > 70) paginate(-1);
            }}
            draggable={false}
            className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
          />
        </AnimatePresence>

        {count > 1 && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/45 to-transparent"
              aria-hidden="true"
            />
            <span className="absolute bottom-4 left-5 text-sm font-medium tabular-nums text-white">
              {String(index + 1).padStart(2, "0")}
              <span className="text-white/60"> / {String(count).padStart(2, "0")}</span>
            </span>

            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Imagem anterior"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/85 text-ink backdrop-blur-sm transition hover:bg-paper hover:text-secondary-strong"
            >
              <IconChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Próxima imagem"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/85 text-ink backdrop-blur-sm transition hover:bg-paper hover:text-secondary-strong"
            >
              <IconChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {images.map((_, dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => goTo(dot)}
              aria-label={`Ir para a imagem ${dot + 1}`}
              aria-current={dot === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                dot === index
                  ? "w-7 bg-secondary"
                  : "w-2 bg-line hover:bg-ink-soft"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
