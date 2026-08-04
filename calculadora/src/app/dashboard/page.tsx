import { cookies } from "next/headers";
import { getSessionUser, AUTH_COOKIE } from "@/lib/auth";
import { Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const username = await getSessionUser(token) || "USUÁRIO";

  const totalSimulacoes = await prisma.simulacao.count();
  const todasSimulacoes = await prisma.simulacao.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      nomeCliente: true,
      inssBruto: true,
      inssDevido: true,
      economiaLiquida: true,
      createdAt: true
    }
  });

  // Prepara dados para os gráficos
  const dataReducao = [
    { name: "INSS Devido (Pago)", value: todasSimulacoes.reduce((acc, s) => acc + s.inssDevido, 0) },
    { name: "Economia Gerada", value: todasSimulacoes.reduce((acc, s) => acc + s.economiaLiquida, 0) },
  ];

  // Top Clientes
  const clientesMap = new Map<string, { totalINSS: number, economia: number }>();
  todasSimulacoes.forEach(s => {
    const prev = clientesMap.get(s.nomeCliente) || { totalINSS: 0, economia: 0 };
    clientesMap.set(s.nomeCliente, {
      totalINSS: prev.totalINSS + s.inssDevido,
      economia: prev.economia + s.economiaLiquida
    });
  });
  const dataClientes = Array.from(clientesMap.entries())
    .map(([name, vals]) => ({ name, ...vals }))
    .sort((a, b) => b.totalINSS - a.totalINSS)
    .slice(0, 5); // top 5

  // Data X INSS (por mês)
  const tempoMap = new Map<string, { inssBruto: number, inssDevido: number }>();
  todasSimulacoes.forEach(s => {
    const mesAno = `${String(s.createdAt.getMonth() + 1).padStart(2, '0')}/${s.createdAt.getFullYear()}`;
    const prev = tempoMap.get(mesAno) || { inssBruto: 0, inssDevido: 0 };
    tempoMap.set(mesAno, {
      inssBruto: prev.inssBruto + s.inssBruto,
      inssDevido: prev.inssDevido + s.inssDevido
    });
  });
  const dataTempo = Array.from(tempoMap.entries()).map(([name, vals]) => ({ name, ...vals }));
  
  const now = new Date();
  const formattedDate = now.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center py-10 px-4 max-w-4xl mx-auto w-full">
      <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 relative mb-12">
        {/* Settings button */}
        <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* Welcome Section */}
        <div className="flex items-center gap-6 mb-12 justify-center">
          <div className="w-24 h-24 rounded-full bg-black flex flex-col items-center justify-center border-4 border-amber-500 shrink-0">
            <span className="text-amber-500 font-bold text-2xl leading-none">Calc</span>
            <span className="text-white font-bold text-[10px] leading-none">ProObra</span>
            <span className="text-amber-500 text-[5px] mt-1">Márcio Medeiros</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-500 text-sm mb-1">Bem-vindo ao sistema</p>
            <h2 className="text-amber-500 text-2xl font-bold tracking-wide uppercase">{username}</h2>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Tempo ganho</p>
            <p className="font-bold text-lg text-gray-900">Menos de 1h</p>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">PDF Gerados</p>
            <p className="font-bold text-lg text-gray-900">{totalSimulacoes}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Data & Hora:</p>
            <p className="font-bold text-lg text-gray-900">{formattedDate} | Hora: {formattedTime}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Plano atual</p>
            <p className="font-bold text-lg text-gray-900">ESPECIALISTA</p>
          </div>
        </div>
      </div>

      {/* Selects & Charts */}
      <div className="w-full max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-serif text-[#002D62] mb-2">Aferição</label>
            <select className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option>Simulador: Obra Predial</option>
              <option>Calculadora: eSocial (em breve)</option>
              <option>Calculadora: GPS Espontânea (em breve)</option>
              <option>Calculadora: GFIP (em breve)</option>
            </select>
          </div>
        </div>

        <DashboardCharts dataClientes={dataClientes} dataReducao={dataReducao} dataTempo={dataTempo} />
        
        <p className="text-center text-sm text-gray-500 mt-8 pt-8">
          Métricas consolidadas com base nas simulações salvas.
        </p>
      </div>
    </div>
  );
}
