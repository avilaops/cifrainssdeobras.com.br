import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as cheerio from "cheerio";

export async function POST() {
  try {
    // Busca dados básicos do Sinduscon SP
    const response = await fetch("https://sindusconsp.com.br/cub/");
    const html = await response.text();
    const $ = cheerio.load(html);

    // O CUB/VAU de SP (Residencial Padrão) normalmente está em uma tabela específica
    // Aqui usamos um valor mock para fins de estabilidade da POC caso a estrutura mude
    const valorBaseFake = 2700.50; // TODO: Lógica exata do seletor CSS do Sinduscon
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    const competencia = `${mes}/${ano}`;

    const vau = await prisma.vAUMensal.upsert({
      where: { uf_competencia_tipoObra: { uf: "SP", competencia, tipoObra: "RESIDENCIAL_UNIFAMILIAR" } },
      update: { valorBase: valorBaseFake },
      create: { uf: "SP", competencia, tipoObra: "RESIDENCIAL_UNIFAMILIAR", valorBase: valorBaseFake },
    });

    return NextResponse.json({ success: true, vau });
  } catch (error) {
    console.error("Erro ao sincronizar Sinduscon SP", error);
    return NextResponse.json({ error: "Erro ao sincronizar VAU SP" }, { status: 500 });
  }
}
