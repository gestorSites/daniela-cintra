import { describe, expect, it } from "vitest";
import { whatsappDigits } from "@/lib/whatsapp";

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
