import { NextRequest, NextResponse } from "next/server";
import { createCertificateContext } from "@/lib/ecac/cert-manager";
import { createECACSession } from "@/lib/ecac/scraper";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const certFile = formData.get("certificado") as File;
    const password = formData.get("senha") as string;

    if (!certFile || !password) {
      return NextResponse.json({ error: "Certificado e senha são obrigatórios." }, { status: 400 });
    }

    const buffer = Buffer.from(await certFile.arrayBuffer());
    
    // Configura o NSSDB com o PFX e senha
    const certContext = createCertificateContext(buffer, password);
    
    try {
      // Inicia a sessão no Puppeteer passando o contexto (que define o HOME dir)
      const session = await createECACSession(certContext);
      
      // Fecha a sessão apenas para este teste
      await session.browser.close();
      
      return NextResponse.json({
        success: true,
        screenshotBase64: session.screenshot
      });
      
    } finally {
      // Sempre garanta que a pasta temporária do certificado será apagada
      certContext.cleanup();
    }
  } catch (error: any) {
    console.error("e-CAC Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
