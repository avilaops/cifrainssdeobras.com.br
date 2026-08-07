import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Gera o out/404.html usado pelo GitHub Pages. */
export default function NotFound() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <SearchX aria-hidden="true" className="mx-auto size-12 text-sage-300" />
        <p className="mt-6 text-sm font-bold tracking-[0.18em] text-pine-600 uppercase">
          Erro 404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-graphite-900 sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mt-4 leading-relaxed text-graphite-500">
          O endereço pode ter mudado ou não existe mais. Volte ao início ou
          conheça os serviços da CIFRA.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <ArrowLeft aria-hidden="true" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/servicos/">Ver serviços</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
