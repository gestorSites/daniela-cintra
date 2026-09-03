"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowUpRight } from "./Icons";
import type { LinksContent, MetaContent } from "@/lib/types";

interface LinkTreeProps {
  links: LinksContent;
  meta: MetaContent;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Pagina de links no estilo "link na bio" (Linktree). */
export default function LinkTree({ links, meta }: LinkTreeProps) {
  const initial = meta.companyName.charAt(0).toUpperCase();

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-16">
      {/* Fundo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft via-paper to-paper" />
      <div
        className="absolute left-1/2 top-0 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: "rgb(var(--primary))" }}
      />

      <div className="w-full max-w-md">
        {/* Cabecalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-line bg-paper-raised shadow-soft">
            {meta.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={meta.logoUrl}
                alt={meta.companyName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-4xl font-semibold text-primary">
                {initial}
              </span>
            )}
          </div>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink">
            {links.headline}
          </h1>
          {links.bio && (
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft text-pretty">
              {links.bio}
            </p>
          )}
        </motion.div>

        {/* Links */}
        <div className="mt-9 flex flex-col gap-3.5">
          {links.items.map((link, index) => {
            const external = /^https?:\/\//i.test(link.url);
            return (
              <motion.a
                key={`${link.url}-${index}`}
                href={link.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + index * 0.07,
                  ease: EASE,
                }}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper-raised px-5 py-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-lift"
              >
                <span className="font-medium text-ink">{link.label}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  <IconArrowUpRight className="h-4 w-4" />
                </span>
              </motion.a>
            );
          })}
        </div>

        {/* Rodape */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.35 + links.items.length * 0.07,
            duration: 0.6,
          }}
          className="mt-10 text-center"
        >
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-primary"
          >
            ← Voltar ao site
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
