import { beforeAll, describe, expect, it } from "vitest";
import { getSessionUser, signSession, verifySession } from "./auth";

beforeAll(() => { process.env.CALCULADORA_SESSION_SECRET = "segredo-de-teste-com-tamanho-adequado"; });
describe("sessão assinada", () => {
  it("aceita token íntegro e recupera usuário", async () => { const token = await signSession("operador"); expect(await verifySession(token)).toBe(true); expect(await getSessionUser(token)).toBe("operador"); });
  it("rejeita token adulterado", async () => { const token = await signSession("operador"); expect(await verifySession(`${token}x`)).toBe(false); });
  it("rejeita token ausente", async () => { expect(await verifySession()).toBe(false); });
});
