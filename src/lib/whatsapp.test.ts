import { describe, expect, it } from "vitest";
import { formatPhoneBR, whatsappDigits } from "@/lib/whatsapp";

/*
 * Teste de fumaca: prova que o runner do Vitest executa e que o alias "@/"
 * resolve. A suite de verdade chega com o modelo de conteudo.
 */
describe("whatsappDigits", () => {
  it("mantem o numero que ja tem DDI", () => {
    expect(whatsappDigits("5511999999999")).toBe("5511999999999");
  });

  it("devolve vazio quando nao ha digito", () => {
    expect(whatsappDigits("")).toBe("");
  });
});

describe("formatPhoneBR", () => {
  it("formata celular com DDI no padrão (DD) 9XXXX-XXXX", () => {
    expect(formatPhoneBR("5516992115515")).toBe("(16) 99211-5515");
  });

  it("formata celular sem DDI", () => {
    expect(formatPhoneBR("16 99211-5515")).toBe("(16) 99211-5515");
  });

  it("formata fixo de 10 dígitos", () => {
    expect(formatPhoneBR("1637221234")).toBe("(16) 3722-1234");
  });

  it("devolve o texto como veio quando não reconhece o formato", () => {
    expect(formatPhoneBR("+1 212 555 0100")).toBe("+1 212 555 0100");
  });

  it("devolve vazio sem número", () => {
    expect(formatPhoneBR("")).toBe("");
  });
});
