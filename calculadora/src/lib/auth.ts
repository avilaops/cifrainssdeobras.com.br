export const AUTH_COOKIE = "cifra_calc_session";

function getSecret() {
  const secret = process.env.CALCULADORA_SESSION_SECRET || process.env.CALCULADORA_ADMIN_PASSWORD;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "CALCULADORA_SESSION_SECRET não configurado em produção. Defina essa variável de ambiente antes de assinar ou validar sessões.",
    );
  }
  return "dev-session-secret";
}

function toBase64Url(value: Uint8Array | string) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return new Uint8Array(Array.from(binary, (char) => char.charCodeAt(0)));
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function signSession(user: string) {
  const payload = toBase64Url(JSON.stringify({ user, createdAt: Date.now() }));
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

export async function verifySession(token?: string) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await hmac(payload);
  const actualBytes = fromBase64Url(signature);
  const expectedBytes = fromBase64Url(expected);
  if (actualBytes.length !== expectedBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < actualBytes.length; i += 1) diff |= actualBytes[i] ^ expectedBytes[i];
  if (diff !== 0) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { createdAt?: number };
    const maxAgeMs = 1000 * 60 * 60 * 12;
    return typeof data.createdAt === "number" && Date.now() - data.createdAt < maxAgeMs;
  } catch {
    return false;
  }
}

export async function getSessionUser(token?: string) {
  if (!(await verifySession(token))) return null;
  try {
    const [payload] = token!.split(".");
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { user?: string };
    return data.user || null;
  } catch {
    return null;
  }
}

export function isValidLogin(user: string, password: string) {
  const expectedUser = process.env["CALCULADORA_ADMIN_USER"];
  const expectedPassword = process.env["CALCULADORA_ADMIN_PASSWORD"];

  if (!expectedUser || !expectedPassword) return process.env.NODE_ENV !== "production";
  
  const cleanUser = user.trim().toLowerCase();
  const cleanExpectedUser = expectedUser.trim().toLowerCase();
  
  // Tratar se o usuario colocou um ponto final sem querer no final da senha
  let cleanPassword = password.trim();
  if (cleanPassword.endsWith(".") && !expectedPassword.endsWith(".")) {
    cleanPassword = cleanPassword.slice(0, -1);
  }

  return cleanUser === cleanExpectedUser && cleanPassword === expectedPassword.trim();
}
