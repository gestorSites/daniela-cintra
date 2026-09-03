import AnimatedSection from "./AnimatedSection";
import ContactForm from "./ContactForm";
import {
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsapp,
} from "./Icons";
import { whatsappLink } from "@/lib/whatsapp";
import type { ContatoContent } from "@/lib/types";

interface ContatoProps {
  contato: ContatoContent;
  clientId: string | null;
  whatsappMessage: string;
}

/**
 * Contato: canais, horario, endereco e formulario.
 *
 * Cada linha so existe quando tem valor — nunca um e-mail ou telefone de
 * exemplo no ar. A referencia entra logo abaixo do endereco, como informacao
 * de localizacao: e onde o lugar fica, nunca como o lugar e. O mapa depende
 * de `exibir_endereco`.
 */
export default function Contato({
  contato,
  clientId,
  whatsappMessage,
}: ContatoProps) {
  const waLink = whatsappLink(contato.whatsapp, whatsappMessage);

  const linhas = [
    waLink && {
      icon: IconWhatsapp,
      label: "WhatsApp",
      value: contato.whatsapp,
      abaixo: "",
      href: waLink,
      external: true,
    },
    contato.email && {
      icon: IconMail,
      label: "E-mail",
      value: contato.email,
      abaixo: "",
      href: `mailto:${contato.email}`,
      external: false,
    },
    contato.telefone && {
      icon: IconPhone,
      label: "Telefone",
      value: contato.telefone,
      abaixo: "",
      href: `tel:${contato.telefone.replace(/[^+\d]/g, "")}`,
      external: false,
    },
    contato.endereco && {
      icon: IconMapPin,
      label: "Endereço",
      value: contato.endereco,
      abaixo: contato.referencia,
      href: null,
      external: false,
    },
    contato.horario && {
      icon: IconClock,
      label: "Horário",
      value: contato.horario,
      abaixo: contato.modalidade,
      href: null,
      external: false,
    },
  ].filter(Boolean) as {
    icon: typeof IconMail;
    label: string;
    value: string;
    abaixo: string;
    href: string | null;
    external: boolean;
  }[];

  const redes = [
    contato.instagram && {
      label: "Instagram",
      href: `https://instagram.com/${contato.instagram.replace(/^@/, "")}`,
    },
    contato.linkedin && { label: "LinkedIn", href: contato.linkedin },
  ].filter(Boolean) as { label: string; href: string }[];

  const showMap = contato.exibirEndereco && Boolean(contato.mapsEmbed);

  return (
    <section id="contato" className="py-28 sm:py-36">
      <div className="container-wide">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 [&>*]:min-w-0">
          <AnimatedSection>
            <p className="eyebrow">Contato</p>
            <h2 className="mt-6 font-display text-4xl font-normal leading-[1.1] tracking-tightest text-balance sm:text-[2.9rem]">
              {contato.title}
            </h2>

            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex items-center gap-3 bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-on-primary transition-colors hover:bg-primary-strong"
              >
                <IconWhatsapp className="h-4 w-4" />
                Chamar no WhatsApp
              </a>
            )}

            {linhas.length > 0 && (
              <dl className="mt-12 flex flex-col">
                {linhas.map(({ icon: Icon, label, value, abaixo, href, external }) => {
                  const corpo = (
                    <>
                      <span className="block text-[1.05rem] leading-snug text-ink">
                        {value}
                      </span>
                      {abaixo && (
                        <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                          {abaixo}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <div
                      key={label}
                      className="grid grid-cols-[auto_1fr] items-start gap-x-4 border-t border-line py-5 first:border-t-0 first:pt-0 sm:grid-cols-[auto_7rem_1fr]"
                    >
                      <Icon className="mt-1 h-4 w-4 shrink-0 text-secondary" />
                      <dt className="col-start-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-soft sm:mt-1">
                        {label}
                      </dt>
                      <dd className="col-start-2 mt-1.5 min-w-0 sm:col-start-3 sm:mt-0">
                        {href ? (
                          <a
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="underline decoration-secondary/40 underline-offset-[5px] transition-colors hover:decoration-secondary"
                          >
                            {corpo}
                          </a>
                        ) : (
                          corpo
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}

            {redes.length > 0 && (
              <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-sm">
                {redes.map((rede) => (
                  <a
                    key={rede.label}
                    href={rede.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold uppercase tracking-[0.14em] text-secondary-strong underline decoration-secondary/40 underline-offset-[5px] transition-colors hover:decoration-secondary"
                  >
                    {rede.label}
                  </a>
                ))}
              </p>
            )}

            {showMap && (
              <div className="mt-10 border border-line">
                <iframe
                  src={contato.mapsEmbed}
                  title={`Mapa — ${contato.endereco}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="aspect-[16/10] w-full"
                />
              </div>
            )}
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <ContactForm clientId={clientId} />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
