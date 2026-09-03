"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { IconArrowRight, IconCheck } from "./Icons";

interface ContactFormProps {
  clientId: string | null;
}

type Status = "idle" | "submitting" | "success" | "error";

// text-base (16px) no mobile evita o zoom automatico do iOS ao focar o campo;
// volta a text-sm a partir de sm.
const inputClass =
  "w-full border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-secondary focus:ring-1 focus:ring-secondary/40 sm:text-sm";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

/** Formulario de contato — grava a mensagem na tabela `messages`. */
export default function ContactForm({ clientId }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    // honeypot anti-spam: humanos não veem o campo; se vier preenchido, é bot —
    // fingimos sucesso e não gravamos nada.
    if (String(data.get("website") ?? "")) {
      form.reset();
      setStatus("success");
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Preencha todos os campos antes de enviar.");
      return;
    }

    if (name.length > 120 || email.length > 160 || message.length > 2000) {
      setStatus("error");
      setErrorMessage("Texto muito longo. Reduza e tente novamente.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const { error } = await supabase.from("messages").insert({
      client_id: clientId,
      name,
      email,
      message,
    });

    if (error) {
      console.error("[ContactForm] Falha ao enviar a mensagem:", error.message);
      setStatus("error");
      setErrorMessage(
        "Não foi possível enviar agora. Tente novamente em instantes.",
      );
      return;
    }

    form.reset();
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center border border-line bg-paper-raised p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary/40 text-secondary">
          <IconCheck className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-normal text-ink">
          Mensagem enviada!
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          Obrigado pelo contato. O retorno é feito o mais rápido possível.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-primary underline underline-offset-4"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-line bg-paper-raised p-7 sm:p-9"
    >
      {/* honeypot — escondido de humanos, isca para bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="flex flex-col gap-5">
        <Field label="Nome" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Seu nome"
            className={inputClass}
          />
        </Field>
        <Field label="E-mail" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder="voce@email.com"
            className={inputClass}
          />
        </Field>
        <Field label="Mensagem" htmlFor="message">
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            maxLength={2000}
            placeholder="Descreva brevemente a sua demanda."
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm font-medium text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-on-primary transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Enviando..." : "Enviar mensagem"}
        {status !== "submitting" && (
          <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
}
