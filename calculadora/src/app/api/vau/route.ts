import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vaus = await prisma.vAUMensal.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vaus);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar VAUs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { uf, competencia, valorBase } = await req.json();
    const vau = await prisma.vAUMensal.upsert({
      where: { uf_competencia: { uf, competencia } },
      update: { valorBase: Number(valorBase) },
      create: { uf, competencia, valorBase: Number(valorBase) },
    });
    return NextResponse.json(vau);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao salvar VAU" }, { status: 500 });
  }
}
