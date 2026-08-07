import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { TipoAuditoria } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const date = (value: Date) => new Intl.DateTimeFormat("pt-BR").format(value);
// dataInicio/dataFim são datas-calendário puras salvas como meia-noite UTC; formatar em UTC evita
// que o fuso do servidor (ex.: America/Sao_Paulo) as exiba um dia antes.
const dateUTC = (value: Date) => new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(value);
const mesesEntreUTC = (d1: Date, d2: Date) =>
  (d2.getUTCFullYear() - d1.getUTCFullYear()) * 12 + (d2.getUTCMonth() - d1.getUTCMonth());

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.simulacao.findUnique({ where: { id } });
  if (!s) return NextResponse.json({ error: "Simulação não encontrada" }, { status: 404 });

  const url = new URL(request.url);
  const tipo = url.searchParams.get("tipo");
  const codigo = `CIFRA-${s.createdAt.getFullYear()}-${s.id.slice(-6).toUpperCase()}`;

  const pdf = await PDFDocument.create();
  pdf.setTitle(`CIFRA - Simulação ${s.id}`);
  pdf.setAuthor("CIFRA Consultoria Tributária");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([595.28, 841.89]);
  
  const pine = rgb(0.06, 0.19, 0.15);
  const olive = rgb(0.39, 0.48, 0.27);
  const gray = rgb(0.35, 0.38, 0.37);
  const lightGray = rgb(0.95, 0.96, 0.95);
  const white = rgb(1, 1, 1);
  const blue = rgb(0.0, 0.17, 0.38);
  
  let y = 792;
  const line = (label: string, value: string, strong = false) => {
    page.drawText(label, { x: 50, y, size: 9, font: regular, color: gray });
    page.drawText(value, { x: 300, y, size: 9, font: strong ? bold : regular, color: pine });
    y -= 18;
  };
  const section = (title: string) => { 
    y -= 5; 
    page.drawText(title.toUpperCase(), { x: 50, y, size: 10, font: bold, color: olive }); 
    y -= 20; 
  };

  if (tipo === 'cliente') {
    // LAYOUT CLIENTE
    
    // Header
    page.drawRectangle({ x: 0, y: 760, width: 600, height: 85, color: blue });
    page.drawText("CIFRA", { x: 50, y: 800, size: 24, font: bold, color: white });
    page.drawText("PLANEJAMENTO TRIBUTÁRIO DE OBRA", { x: 50, y: 775, size: 10, font: regular, color: lightGray });
    
    page.drawText("contato@cifrainssdeobras.com.br", { x: 400, y: 800, size: 8, font: regular, color: white });
    page.drawText("www.cifrainssdeobras.com.br", { x: 400, y: 785, size: 8, font: regular, color: white });
    
    y = 700;
    page.drawText("PLANEJAMENTO TRIBUTÁRIO DE OBRA", { x: 160, y, size: 14, font: bold, color: pine });
    
    y -= 30;
    page.drawText("PROJETO DE CONSTRUÇÃO À INICIAR.", { x: 50, y, size: 10, font: bold, color: pine });
    y -= 15;
    page.drawText("LOCALIZAÇÃO:", { x: 50, y, size: 10, font: bold, color: pine });
    page.drawText(s.uf, { x: 140, y, size: 10, font: regular, color: pine });
    y -= 15;
    page.drawText("METRAGEM:", { x: 50, y, size: 10, font: bold, color: pine });
    page.drawText(`${s.areaConstrucao.toFixed(2)} m²`, { x: 140, y, size: 10, font: regular, color: pine });
    y -= 15;
    page.drawText("PERÍODO DE OBRA:", { x: 50, y, size: 10, font: bold, color: pine });
    page.drawText(`${dateUTC(s.dataInicio)} À ${dateUTC(s.dataFim)}`, { x: 160, y, size: 10, font: regular, color: pine });
    y -= 15;
    page.drawText("CLIENTE:", { x: 50, y, size: 10, font: bold, color: pine });
    page.drawText(s.nomeCliente || "Não informado", { x: 140, y, size: 10, font: regular, color: pine });

    y -= 40;
    // Tabela 1 Header
    page.drawRectangle({ x: 50, y: y - 15, width: 495, height: 20, color: blue });
    page.drawText("SIMULAÇÃO DE REDUÇÃO PARA O INSS DE OBRAS.", { x: 170, y: y - 10, size: 10, font: bold, color: white });
    
    y -= 35;
    // Tabela 1 Linhas
    const drawRow = (label: string, val: string, bg: any, textCol: any = pine) => {
      page.drawRectangle({ x: 50, y: y - 12, width: 495, height: 18, color: bg });
      page.drawLine({ start: { x: 50, y: y - 12 }, end: { x: 545, y: y - 12 }, color: gray, thickness: 0.5 });
      page.drawText(label, { x: 55, y: y - 7, size: 9, font: bold, color: textCol });
      page.drawText(val, { x: 300, y: y - 7, size: 9, font: regular, color: textCol });
      y -= 18;
    };
    
    drawRow("NOME DO CLIENTE:", s.nomeCliente, lightGray);
    drawRow("CIDADE OBRA:", s.uf, lightGray);
    drawRow("METRAGEM:", `${s.areaConstrucao.toFixed(2)} m² (${s.tipoObra})`, lightGray);
    drawRow("DATA:", date(new Date()), lightGray);
    
    y -= 20;
    // Tabela Valores Header
    page.drawRectangle({ x: 50, y: y - 15, width: 247, height: 20, color: rgb(0.7, 0.85, 0.95) });
    page.drawRectangle({ x: 297, y: y - 15, width: 248, height: 20, color: rgb(0.7, 0.85, 0.95) });
    page.drawText("VALOR DE INSS DEVIDO", { x: 55, y: y - 10, size: 9, font: bold, color: pine });
    page.drawText("VALOR DE INSS COM REDUÇÃO", { x: 302, y: y - 10, size: 9, font: bold, color: pine });
    y -= 35;
    
    // Tabela Valores Linhas
    const drawDoubleRow = (l1: string, v1: string, v2: string, bg: any, isBold = false) => {
      page.drawRectangle({ x: 50, y: y - 12, width: 247, height: 18, color: bg });
      page.drawRectangle({ x: 297, y: y - 12, width: 248, height: 18, color: bg });
      page.drawText(l1, { x: 55, y: y - 7, size: 9, font: isBold ? bold : regular, color: pine });
      page.drawText(v1, { x: 200, y: y - 7, size: 9, font: isBold ? bold : regular, color: pine });
      page.drawText("R$", { x: 302, y: y - 7, size: 9, font: regular, color: pine });
      page.drawText(v2, { x: 450, y: y - 7, size: 9, font: isBold ? bold : regular, color: pine });
      y -= 18;
    };
    
    const moneyStr = (val: number) => val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    // Calcula Honorarios (30% da economia, provisório) caso não exista no DB
    const honorariosVal = s.honorarios > 0 ? s.honorarios : (s.economiaImposto * 0.3);
    const ecLiquidaVal = s.economiaImposto - honorariosVal;

    drawDoubleRow("R$", moneyStr(s.inssDevido), moneyStr(s.inssComReducao), lightGray);
    drawDoubleRow("ECONOMIA EM IMPOSTO", "R$", moneyStr(s.economiaImposto), rgb(0.8, 0.95, 0.8), true);
    drawDoubleRow("VALOR DOS HONORARIOS", "R$", moneyStr(honorariosVal), rgb(0.9, 0.9, 0.9), true);
    drawDoubleRow("ECONOMIA LIQUIDA", "R$", moneyStr(ecLiquidaVal), rgb(0.7, 0.9, 0.7), true);

    y -= 30;
    page.drawText(`FORMA DE PAGAMENTO DOS IMPOSTOS (${money(s.inssComReducao)})`, { x: 50, y, size: 10, font: bold, color: pine });
    y -= 25;
    page.drawText("O imposto é divido durante o período da obra, é feito através de uma DARF emitida e", { x: 50, y, size: 9, font: regular, color: pine });
    y -= 12;
    page.drawText("enviada todos os meses com vencimento para o dia 20 de cada mês.", { x: 50, y, size: 9, font: regular, color: pine });
    y -= 20;
    page.drawText("Obs.: caso a obra termine antes ou depois, a única diferença é nos valores mensais, o", { x: 50, y, size: 9, font: regular, color: gray });
    y -= 12;
    page.drawText("valor final não é modificado. (apenas ajustes de tabela Selic)", { x: 50, y, size: 9, font: regular, color: gray });
    
    y -= 30;
    page.drawText("Serviços inclusos na contratação:", { x: 190, y, size: 12, font: bold, color: pine });
    y -= 20;
    const servicos = [
      "1 - Analisar e planejar a aplicação do Fator de Ajuste;",
      "2 - Realizar o Cadastro Nacional de Obras-CNO junto à RFB;",
      "3 - Calcular o INSS da obra;",
      "4 - Realizar o cadastro dos prestadores de serviços no e-Social;",
      "5 - Realizar as aferições mensais no SERO;",
      "6 - Transmitir a DCTFWEB mensalmente durante todo o período de obra;",
      "7 - Emitir a guia (DARF) para pagamento dos tributos aferidos no período;",
      "8 - Realizar processos no Serviço Eletrônico de Aferição de Obras SERO;",
      "9 - Realizar a aferição total da obra;",
      "10 - Realizar o parcelamento do INSS de obra quando solicitado no final da obra;",
      "11 - Emitir a Certidão Negativa com Efeitos de Positiva de Débitos ou;",
      "12 - Emitir a Certidão Negativa de Débitos ao final da Obra;",
      "13 - Consultoria e assessoria por 5 anos para resolução de qualquer solicitação da RFB."
    ];
    servicos.forEach(srv => {
      page.drawText(srv, { x: 50, y, size: 8, font: regular, color: pine });
      y -= 12;
    });

    y -= 20;
    let dataValidade = new Date();
    dataValidade.setDate(dataValidade.getDate() + 30);
    page.drawText("Esta Simulação é baseada nas informações iniciais do contratante e os valores são aproximados.", { x: 50, y, size: 8, font: regular, color: gray });
    y -= 15;
    page.drawText(`Proposta válida até ${date(dataValidade)}`, { x: 220, y, size: 9, font: bold, color: blue });
    
  } else {
    // LAYOUT INTERNO (ORIGINAL)
    // CABEÇALHO
    page.drawText("CIFRA", { x: 50, y, size: 19, font: bold, color: olive });
    page.drawText("Relatório de Simulação de INSS de Obra", { x: 50, y: y - 25, size: 16, font: bold, color: pine });
    page.drawText(`Código ${codigo} | versão ${s.versao} | Emitido em ${date(new Date())}`, { x: 50, y: y - 45, size: 9, font: regular, color: gray });
    
    y -= 80;

    // RESUMO EXECUTIVO
    const percentual = s.inssDevido > 0 ? ((s.economiaImposto / s.inssDevido) * 100).toFixed(0) : "0";
    page.drawText(`Redução estimada de ${percentual}% no INSS da obra`, { x: 50, y, size: 13, font: bold, color: pine });
    y -= 25;

    // Quadro de Resumo (Cards)
    page.drawRectangle({ x: 50, y: y - 40, width: 115, height: 45, color: lightGray });
    page.drawText("Cenário Padrão", { x: 55, y: y - 15, size: 8, font: regular, color: gray });
    page.drawText(money(s.inssDevido), { x: 55, y: y - 30, size: 10.5, font: bold, color: pine });

    page.drawRectangle({ x: 175, y: y - 40, width: 115, height: 45, color: lightGray });
    page.drawText("Com Planejamento", { x: 180, y: y - 15, size: 8, font: regular, color: gray });
    page.drawText(money(s.inssComReducao), { x: 180, y: y - 30, size: 10.5, font: bold, color: pine });

    page.drawRectangle({ x: 300, y: y - 40, width: 115, height: 45, color: lightGray });
    page.drawText("Economia Tributária", { x: 305, y: y - 15, size: 8, font: regular, color: gray });
    page.drawText(money(s.economiaImposto), { x: 305, y: y - 30, size: 10.5, font: bold, color: pine });

    page.drawRectangle({ x: 425, y: y - 40, width: 120, height: 45, color: olive });
    page.drawText("Economia Líquida", { x: 430, y: y - 15, size: 8, font: bold, color: white });
    page.drawText(money(s.economiaLiquida), { x: 430, y: y - 30, size: 11.5, font: bold, color: white });

    y -= 75;

    section("Identificação do cliente e da obra");
    line("Cliente", s.nomeCliente, true); 
    line("Contato", [s.telefone, s.email].filter(Boolean).join(" | ") || "Não informado");
    line("Obra", `${s.tipoObra} - ${s.uf} - ${s.responsavel}`); 
    line("Período", `${dateUTC(s.dataInicio)} a ${dateUTC(s.dataFim)}`);
    
    section("Dados utilizados no cálculo");
    line("Área de construção", `${s.areaConstrucao.toFixed(2)} m2`); 
    line("Área de reforma", `${s.areaReforma.toFixed(2)} m2`);
    line("Área de demolição", `${s.areaDemolicao.toFixed(2)} m2`); 
    line("Área de piscina", `${s.areaPiscina.toFixed(2)} m2`);
    line("VAU utilizado", `${money(s.vauUsado)} / m2`); 
    line("Competência VAU", s.competenciaVau || "Não informada");

    section("Detalhamento tributário e resultado");
    line("Custo total estimado da obra", money(s.codTotal)); 
    line("Remuneração de mão de obra estimada", money(s.rmtTotal));
    line("INSS estimado sem planejamento", money(s.inssDevido), true); 
    line("INSS estimado após planejamento", money(s.inssComReducao), true);
    
    const mesesRetro = Math.max(0, mesesEntreUTC(s.dataInicio, s.createdAt));
    const multaMaed = s.podeFatorAjuste ? mesesRetro * 100 : 0;
    if (multaMaed > 0) {
      line("Multa MAED (Atraso DCTFWeb)", money(multaMaed));
    }

    line("Economia tributária estimada", money(s.economiaImposto)); 
    line("Honorários da consultoria", money(s.honorarios)); 
    line("Economia líquida estimada do cliente", money(s.economiaLiquida), true);
    
    y -= 5;
    section("Premissas e Observações");
    page.drawText("Esta simulação é válida por 15 dias e está sujeita à conferência documental, validação das", { x: 50, y, size: 8.5, font: regular, color: gray });
    y -= 12;
    page.drawText("características da obra e atualização dos parâmetros legais aplicáveis.", { x: 50, y, size: 8.5, font: regular, color: gray });
    y -= 10;
    page.drawText("Estimativa interna. Confira os dados e o cálculo definitivo no SERO/e-CAC antes do recolhimento.", { x: 50, y, size: 8.5, font: regular, color: gray });

    // RODAPÉ
    y = 70;
    page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: lightGray });
    y -= 15;
    page.drawText("Glossário: VAU (Valor Atualizado Unitário) | RMT (Remuneração da mão de obra) | SERO (Serviço de Aferição)", { x: 50, y, size: 7, font: regular, color: gray });
    y -= 15;
    page.drawText("CIFRA Consultoria Tributária Ltda | CNPJ: 45.123.456/0001-99", { x: 50, y, size: 8, font: bold, color: olive });
    y -= 12;
    page.drawText("contato@cifrainssdeobras.com.br | www.cifrainssdeobras.com.br", { x: 50, y, size: 8, font: regular, color: gray });
    page.drawText("Página 1 de 1", { x: 500, y, size: 8, font: regular, color: gray });
  }

  const bytes = await pdf.save();
  await prisma.auditoria.create({ data: { simulacaoId: id, tipo: TipoAuditoria.RELATORIO_EMITIDO, usuario: s.criadoPor, detalhes: `Relatório PDF emitido (Formato ${tipo === 'cliente' ? 'Cliente' : 'Comercial'})` } });
  
  return new NextResponse(Buffer.from(bytes), { 
    headers: { 
      "Content-Type": "application/pdf", 
      "Content-Disposition": `attachment; filename="${codigo}.pdf"`, 
      "Cache-Control": "no-store" 
    } 
  });
}
