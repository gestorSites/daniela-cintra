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

/**
 * Numero para exibir: `(DD) 9XXXX-XXXX` (celular) ou `(DD) XXXX-XXXX`
 * (fixo). Aceita com ou sem DDI 55. Formato que nao reconhece volta como
 * veio — melhor o numero cru que um numero cortado errado.
 */
export function formatPhoneBR(raw: string): string {
  const texto = raw.trim();
  let digits = texto.replace(/\D/g, "");
  if (!digits) return "";
  // DDI explicito de outro pais: nao e numero brasileiro, nao formatar.
  if (texto.startsWith("+") && !digits.startsWith("55")) return texto;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    digits = digits.slice(2);
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return texto;
}
