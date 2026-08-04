import { NextRequest, NextResponse } from "next/server";
import { createSessionFromCookies, CookieFormat } from "@/lib/ecac/scraper";

const API_KEY = 'avila-ops-ext-token-123'; // Mesma chave da extensão

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Validação básica de segurança (evitar que qualquer pessoa envie cookies)
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const cookies = body.cookies as CookieFormat[];

    if (!cookies || !Array.isArray(cookies) || cookies.length === 0) {
      return NextResponse.json({ error: "Nenhum cookie recebido" }, { status: 400 });
    }

    console.log(`Recebidos ${cookies.length} cookies da extensão.`);

    // Tentar acessar o e-CAC usando os cookies
    const session = await createSessionFromCookies(cookies);
    
    // Fechar a sessão imediatamente após o teste
    await session.browser.close();

    // Podemos salvar os cookies no banco de dados aqui usando Prisma se precisarmos rodar tarefas depois.
    // Para agora, apenas validamos que funcionam.

    return NextResponse.json({
      success: true,
      message: "Sessão capturada e testada com sucesso no servidor."
    });

  } catch (error: any) {
    console.error("Erro na Sincronização e-CAC:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Configuração de CORS para permitir requisições da Extensão do Chrome (que não tem origin fixo padrão)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
