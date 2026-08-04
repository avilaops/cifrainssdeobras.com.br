import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Trilha sem o item atual (ex.: [{ label: "Início", href: "/" }]). */
  breadcrumbs?: Crumb[];
  /** Rótulo do item atual no breadcrumb (padrão: title). */
  currentLabel?: string;
}

/** Cabeçalho padrão das páginas internas, com breadcrumb acessível. */
export function PageHeader({
  title,
  description,
  breadcrumbs = [{ label: "Início", href: "/" }],
  currentLabel,
}: PageHeaderProps) {
  return (
    <section className="border-b border-graphite-100 bg-sage-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <nav aria-label="Trilha de navegação">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-graphite-500">
            {breadcrumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <Link
                  href={crumb.href}
                  className="font-medium transition-colors hover:text-pine-700"
                >
                  {crumb.label}
                </Link>
                <ChevronRight aria-hidden="true" className="size-3.5" />
              </li>
            ))}
            <li aria-current="page" className="font-semibold text-pine-700">
              {currentLabel ?? title}
            </li>
          </ol>
        </nav>
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-balance text-graphite-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-graphite-500">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
