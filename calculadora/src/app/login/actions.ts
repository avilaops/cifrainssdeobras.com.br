"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, isValidLogin, signSession } from "@/lib/auth";

export async function entrar(_: { error?: string }, formData: FormData) {
  const user = String(formData.get("user") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  if (!isValidLogin(user, password)) {
    return { error: "Usuário ou senha inválidos." };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, await signSession(user || "dev"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect(next.startsWith("/") && next !== "/" ? next : "/dashboard");
}

export async function sair() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/login");
}
