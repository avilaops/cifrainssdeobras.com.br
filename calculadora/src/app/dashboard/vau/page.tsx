import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function VAUDashboardPage() {
  const vaus = await prisma.vAUMensal.findMany({
    orderBy: [{ competencia: "desc" }, { uf: "asc" }],
  });

  async function syncSP() {
    "use server";
    // Invocar rota de API
    const res = await fetch("http://localhost:3000/api/vau/sync", { method: "POST" });
    await res.json();
    revalidatePath("/dashboard/vau");
  }

  async function saveVau(formData: FormData) {
    "use server";
    const uf = String(formData.get("uf"));
    const competencia = String(formData.get("competencia")); // Ex: YYYY-MM
    // Formata para MM/YYYY
    const [ano, mes] = competencia.split("-");
    const compFormatada = `${mes}/${ano}`;
    const valorBase = Number(formData.get("valorBase"));

    if (uf && compFormatada && valorBase) {
      await prisma.vAUMensal.upsert({
        where: { uf_competencia: { uf, competencia: compFormatada } },
        update: { valorBase },
        create: { uf, competencia: compFormatada, valorBase },
      });
      revalidatePath("/dashboard/vau");
    }
  }

  return (
    <div className="flex flex-col py-10 px-4 max-w-5xl mx-auto w-full gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-graphite-900">Gestão de VAU</h1>
          <p className="text-gray-500">Administre o Valor Unitário Básico (CUB/VAU) mensal para uso nas simulações.</p>
        </div>
        <form action={syncSP}>
          <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-amber-600 transition">
            Sincronizar VAU (Sinduscon-SP)
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Adicionar Manualmente</h2>
          <form action={saveVau} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Estado (UF)</label>
              <select name="uf" className="w-full border rounded p-2" required defaultValue="SP">
                {["SP", "RJ", "MG", "PR", "SC", "RS", "BA", "PE", "CE", "DF", "GO"].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mês (Competência)</label>
              <input type="month" name="competencia" className="w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Valor Base (R$)</label>
              <input type="number" step="0.01" name="valorBase" className="w-full border rounded p-2" placeholder="2500.00" required />
            </div>
            <button type="submit" className="bg-olive-600 text-white font-bold py-2 rounded mt-2 hover:bg-olive-700">
              Salvar VAU
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Histórico de CUB/VAU</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4 font-semibold text-gray-600">UF</th>
                  <th className="py-2 px-4 font-semibold text-gray-600">Competência</th>
                  <th className="py-2 px-4 font-semibold text-gray-600">Valor Base (R$)</th>
                  <th className="py-2 px-4 font-semibold text-gray-600">Atualizado em</th>
                </tr>
              </thead>
              <tbody>
                {vaus.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-500">Nenhum VAU registrado ainda.</td></tr>
                ) : (
                  vaus.map(v => (
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-4">{v.uf}</td>
                      <td className="py-2 px-4">{v.competencia}</td>
                      <td className="py-2 px-4 font-medium text-amber-600">R$ {v.valorBase.toFixed(2)}</td>
                      <td className="py-2 px-4 text-sm text-gray-500">{v.updatedAt.toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
