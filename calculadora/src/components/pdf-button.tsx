export function PdfButton({ id }: { id: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <div className="flex gap-2">
      <form method="post" action={`${basePath}/api/simulacoes/${id}/pdf?tipo=cliente`}>
        <button className="rounded-lg bg-[#002D62] px-4 py-2 text-sm font-bold text-white hover:bg-[#001f44]">
          Baixar Proposta (Cliente)
        </button>
      </form>
      <form method="post" action={`${basePath}/api/simulacoes/${id}/pdf?tipo=interno`}>
        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
          Baixar Relatório (Interno)
        </button>
      </form>
    </div>
  );
}
