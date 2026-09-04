"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Image as ImageIcon, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

export default function ECACPage() {
  const [certFile, setCertFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFile || !password) return;

    setLoading(true);
    setScreenshot(null);
    setError(null);

    const formData = new FormData();
    formData.append("certificado", certFile);
    formData.append("senha", password);

    try {
      const res = await fetch("/api/ecac/test", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao processar teste");

      setScreenshot(`data:image/png;base64,${data.screenshotBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar teste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-8">
      <div>
        <h1 className="mb-2 flex items-center gap-3 text-2xl font-bold text-[#1b3629] sm:text-3xl">
          <Bot className="w-8 h-8 text-[#2e5240]" />
          Robô e-CAC (Automação)
        </h1>
        <p className="text-gray-600">
          Utilize o formulário abaixo para testar o login automático usando o certificado digital modelo A1 (.pfx).
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-4 text-amber-800">
        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
        <div className="text-sm">
          <strong>Atenção:</strong> O robô requer a instalação do Chromium no servidor. Caso este ambiente não possua as dependências gráficas instaladas, a execução falhará.
        </div>
      </div>

      <form onSubmit={handleTest} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="certificado">Certificado Digital A1 (.pfx ou .p12)</Label>
            <Input 
              id="certificado" 
              type="file" 
              accept=".pfx,.p12"
              onChange={(e) => setCertFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div>
            <Label htmlFor="senha">Senha do Certificado</Label>
            <Input 
              id="senha" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading || !certFile || !password}
          className="w-full bg-[#002D62] hover:bg-[#001f44] text-white"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Conectando ao Gov.br...</>
          ) : (
            <><ShieldCheck className="w-4 h-4 mr-2" /> Iniciar Teste de Autenticação</>
          )}
        </Button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {screenshot && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-serif text-[#002D62] flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Resultado Visual
          </h2>
          <div className="border-4 border-gray-900 rounded-xl overflow-hidden shadow-2xl relative">
            <div className="bg-gray-900 text-white text-xs p-2 font-mono flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span>chromium-browser --headless</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- captura em base64, next/image não otimiza data URI */}
            <img src={screenshot} alt="e-CAC Screenshot" className="w-full object-cover" />
          </div>
        </div>
      )}
    </div>
  );
}
