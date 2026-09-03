"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** atraso da animacao, em segundos. */
  delay?: number;
  /** distancia do deslocamento vertical, em px. */
  y?: number;
}

/**
 * Envolve qualquer conteudo e o revela com fade + slide up quando entra
 * na viewport. A animacao acontece apenas uma vez.
 */
export default function AnimatedSection({
  children,
  className,
  delay = 0,
  y = 32,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
