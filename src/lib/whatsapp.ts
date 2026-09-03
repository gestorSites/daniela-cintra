/**
 * Monta um link wa.me a partir de um numero digitado livremente.
 * Mantem so digitos e, para numeros brasileiros sem DDI (10-11 digitos),
 * prefixa o codigo do Brasil (55). Devolve "" quando nao ha numero.
 */
export function whatsappDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function whatsappLink(raw: string, message?: string): string {
  const digits = whatsappDigits(raw);
  if (!digits) return "";
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}
