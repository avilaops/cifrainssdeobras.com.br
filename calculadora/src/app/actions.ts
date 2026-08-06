"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Prisma, StatusSimulacao, TipoAuditoria, TipoObra } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calcularINSS, type SimulacaoInput } from "@/lib/calc/calculos";
import type { TipoObraKey } from "@/lib/calc/dados";
import { AUTH_COOKIE, getSessionUser } from "@/lib/auth";
import { normalizeTelefone, simulacaoSchema } from "@/lib/validations";

const TIPO_PRISMA: Record<TipoObraKey, TipoObra> = {
  residencial: "RESIDENCIAL",
  multifamiliar: "MULTIFAMILIAR",
  comercial: "COMERCIAL",
  industrial: "INDUSTRIAL",
  reforma: "REFORMA",
  demolicao: "DEMOLICAO",
  piscina: "PISCINA",
  mista: "MISTA",
  pavimentacao: "PAVIMENTACAO",
  terraplenagem: "TERRAPLENAGEM",
  obraArte: "OBRA_ARTE",
  drenagem: "DRENAGEM",
  naoPredial: "NAO_PREDIAL",
};

export interface SalvarSimulacaoInput extends SimulacaoInput {
  nomeCliente: string;
  telefone?: string;
  email?: string;
  competenciaVau?: string;
  observacoes?: string;
}

async function usuarioAtual() {
  const cookieStore = await cookies();
  return (await getSessionUser(cookieStore.get(AUTH_COOKIE)?.value)) || "sistema";
}

async function dadosResultado(input: SalvarSimulacaoInput) {
  const parsed = simulacaoSchema.parse(input);
  
  const parametros = await prisma.parametrosImpostos.findUnique({ where: { competencia: "2026" } });
  const dbParam = parametros ? {
    percentualUsinado: parametros.percentualUsinado,
    preMoldadoMenor40: parametros.preMoldadoMenor40,
    preMoldadoMaior40: parametros.preMoldadoMaior40,
  } : undefined;

  const regrasArray = await prisma.regraReducaoIRPF.findMany({ where: { competencia: "2026" } });
  const dbRegras = regrasArray.length >= 2 ? {
    minPercentDctfwebAte350: regrasArray[0].minPercentDctfweb,
    minPercentDctfwebMais350: regrasArray[1].minPercentDctfweb,
  } : undefined;

  const resultado = calcularINSS(parsed, dbParam, dbRegras);
  return { parsed, resultado };
}

export async function calcularSimulacaoAction(input: SalvarSimulacaoInput) {
  const { resultado } = await dadosResultado(input);
  return resultado;
}

export async function salvarSimulacao(input: SalvarSimulacaoInput) {
  try {
    const { parsed, resultado } = await dadosResultado(input);
    const usuario = await usuarioAtual();
    const telefone = normalizeTelefone(parsed.telefone) || null;
    const email = parsed.email.toLowerCase() || null;

    const res = await prisma.$transaction(async (tx) => {
      const dedupWhere = [...(email ? [{ email }] : []), ...(telefone ? [{ telefone }] : [])];
      const existing = dedupWhere.length > 0 ? await tx.cliente.findFirst({ where: { OR: dedupWhere } }) : null;
      const cliente = existing
        ? await tx.cliente.update({ where: { id: existing.id }, data: { nome: parsed.nomeCliente, telefone, email } })
        : await tx.cliente.create({ data: { nome: parsed.nomeCliente, telefone, email } });
      const obra = await tx.obra.create({
        data: {
          clienteId: cliente.id,
          uf: parsed.uf,
          tipoObra: TIPO_PRISMA[parsed.tipo],
          dataInicio: new Date(parsed.dataInicio),
          dataFim: new Date(parsed.dataFim),
        },
      });

      if (parsed.vauManual && parsed.vauManual > 0 && parsed.competenciaVau) {
        await tx.vAUMensal.upsert({
          where: { uf_competencia: { uf: parsed.uf, competencia: parsed.competenciaVau } },
          update: { valorBase: parsed.vauManual },
          create: { uf: parsed.uf, competencia: parsed.competenciaVau, valorBase: parsed.vauManual }
        });
      }

      const registro = await tx.simulacao.create({ data: {
        clienteId: cliente.id,
        obraId: obra.id,
        nomeCliente: parsed.nomeCliente,
        telefone,
        email,
        responsavel: parsed.responsavel === "pf" ? "PF" : "PJ",
        uf: parsed.uf,
        tipoObra: TIPO_PRISMA[parsed.tipo],
        material: parsed.material as any,
        preMoldado: parsed.preMoldado,
        areaConstrucao: parsed.areaConstrucao,
        areaReforma: parsed.areaReforma,
        areaDemolicao: parsed.areaDemolicao,
        areaPiscina: parsed.areaPiscina,
        concretoUsinado: parsed.concretoUsinado,
        dataInicio: new Date(parsed.dataInicio),
        dataFim: new Date(parsed.dataFim),
        vauManual: parsed.vauManual || null,
        percHonorarios: parsed.percHonorarios,
        competenciaVau: parsed.competenciaVau || null,
        observacoes: parsed.observacoes || null,
        criadoPor: usuario,
        vauUsado: resultado.vauUsado,
        areaTotal: resultado.areaTotal,
        codTotal: resultado.codTotal,
        rmtTotal: resultado.rmtTotal,
        fatorSocial: resultado.fatorSocial,
        inssBruto: resultado.inssBruto,
        inssDevido: resultado.inssDevido,
        podeFatorAjuste: resultado.podeAjuste,
        reducaoPercent: resultado.reducaoPercent,
        inssComReducao: resultado.inssComReducao,
        economiaImposto: resultado.economiaImposto,
        honorarios: resultado.honorarios,
        economiaLiquida: resultado.economiaLiq,
        retroativo: resultado.retroativo,
        futuro: resultado.futuro,
        mesesFuturos: resultado.mesesFuturos,
        parcelaMensal: resultado.parcelaMensal,
      }});
      await tx.auditoria.create({
        data: { simulacaoId: registro.id, tipo: TipoAuditoria.CRIACAO, usuario, detalhes: "Simulação criada" },
      });
      return { id: registro.id };
    });
    return res;
  } catch (e: any) {
    console.error("Erro ao salvar simulação:", e);
    if (e?.name === "ZodError") {
      return { error: "Verifique os dados informados. Alguns campos são inválidos ou estão faltando." };
    }
    return { error: e.message || "Erro inesperado ao salvar simulação no banco de dados." };
  }
}

export async function listarSimulacoes() {
  return prisma.simulacao.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function excluirSimulacao(id: string) {
  if (!id) throw new Error("ID da simulação não informado.");
  const usuario = await usuarioAtual();
  await prisma.$transaction(async (tx) => {
    await tx.auditoria.create({
      data: { simulacaoId: id, tipo: TipoAuditoria.EXCLUSAO, usuario, detalhes: "Simulação excluída" },
    });
    await tx.simulacao.delete({ where: { id } });
  });

  revalidatePath("/simulacoes");
}

export async function alterarStatus(id: string, status: StatusSimulacao) {
  if (!Object.values(StatusSimulacao).includes(status)) {
    throw new Error("Status inválido.");
  }
  const usuario = await usuarioAtual();
  await prisma.$transaction([
    prisma.simulacao.update({ where: { id }, data: { status } }),
    prisma.auditoria.create({
      data: { simulacaoId: id, tipo: TipoAuditoria.STATUS_ALTERADO, usuario, detalhes: `Status alterado para ${status}` },
    }),
  ]);
  revalidatePath("/simulacoes");
  revalidatePath(`/simulacoes/${id}`);
}

export async function agendarMonitoramento(id: string) {
  const usuario = await usuarioAtual();
  const dataAlerta = new Date();
  dataAlerta.setFullYear(dataAlerta.getFullYear() + 1); // Alerta para 1 ano no futuro
  
  await prisma.$transaction([
    prisma.simulacao.update({ 
      where: { id }, 
      data: { 
        status: StatusSimulacao.MONITORAMENTO_CNO,
        dataAlertaMonitoramento: dataAlerta 
      } 
    }),
    prisma.auditoria.create({
      data: { simulacaoId: id, tipo: TipoAuditoria.STATUS_ALTERADO, usuario, detalhes: `Monitoramento CNO agendado para ${dataAlerta.toLocaleDateString('pt-BR')}` },
    }),
  ]);
  revalidatePath("/simulacoes");
  revalidatePath(`/simulacoes/${id}`);
}

export async function revisarSimulacao(id: string, input: SalvarSimulacaoInput) {
  try {
    const anterior = await prisma.simulacao.findUnique({ where: { id } });
    if (!anterior) return { error: "Simulação original não encontrada." };
    const { parsed, resultado } = await dadosResultado(input);
    const usuario = await usuarioAtual();

    const registro = await prisma.simulacao.create({
      data: {
        clienteId: anterior.clienteId,
        obraId: anterior.obraId,
        versaoAnteriorId: anterior.id,
        versao: anterior.versao + 1,
        status: StatusSimulacao.SIMULADO,
        nomeCliente: parsed.nomeCliente,
        telefone: normalizeTelefone(parsed.telefone) || null,
        email: parsed.email.toLowerCase() || null,
        responsavel: parsed.responsavel === "pf" ? "PF" : "PJ",
        uf: parsed.uf,
        tipoObra: TIPO_PRISMA[parsed.tipo],
        material: parsed.material as any,
        preMoldado: parsed.preMoldado,
        areaConstrucao: parsed.areaConstrucao,
        areaReforma: parsed.areaReforma,
        areaDemolicao: parsed.areaDemolicao,
        areaPiscina: parsed.areaPiscina,
        concretoUsinado: parsed.concretoUsinado,
        dataInicio: new Date(parsed.dataInicio),
        dataFim: new Date(parsed.dataFim),
        vauManual: parsed.vauManual || null,
        percHonorarios: parsed.percHonorarios,
        competenciaVau: parsed.competenciaVau || null,
        observacoes: parsed.observacoes || null,
        criadoPor: usuario,
        vauUsado: resultado.vauUsado,
        areaTotal: resultado.areaTotal,
        codTotal: resultado.codTotal,
        rmtTotal: resultado.rmtTotal,
        fatorSocial: resultado.fatorSocial,
        inssBruto: resultado.inssBruto,
        inssDevido: resultado.inssDevido,
        podeFatorAjuste: resultado.podeAjuste,
        reducaoPercent: resultado.reducaoPercent,
        inssComReducao: resultado.inssComReducao,
        economiaImposto: resultado.economiaImposto,
        honorarios: resultado.honorarios,
        economiaLiquida: resultado.economiaLiq,
        retroativo: resultado.retroativo,
        futuro: resultado.futuro,
        mesesFuturos: resultado.mesesFuturos,
        parcelaMensal: resultado.parcelaMensal,
        auditorias: { create: { tipo: TipoAuditoria.EDICAO, usuario, detalhes: `Revisão da versão ${anterior.versao}` } },
      },
    });

    revalidatePath("/simulacoes");
    revalidatePath(`/simulacoes/${anterior.id}`);
    return { id: registro.id };
  } catch (e: any) {
    console.error("Erro ao revisar simulação:", e);
    if (e?.name === "ZodError") {
      return { error: "Verifique os dados informados. Alguns campos são inválidos ou estão faltando." };
    }
    return { error: e.message || "Erro inesperado ao revisar simulação." };
  }
}

export async function consultarVau(uf: string, dataFim: string) {
  try {
    const d = new Date(dataFim);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const y = d.getFullYear();
    const competencia = `${m}/${y}`;

    const vau = await prisma.vAUMensal.findUnique({
      where: { uf_competencia: { uf, competencia } }
    });

    return { competencia, valor: vau?.valorBase || null };
  } catch (error) {
    console.error("Erro ao consultar VAU:", error);
    return { competencia: "", valor: null };
  }
}

