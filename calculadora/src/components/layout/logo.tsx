import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Tema claro (padrão) ou sobre fundo escuro. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Marca tipográfica da CIFRA.
 * A fonte oficial (Asgrike) não possui arquivo licenciado no projeto; usamos
 * uma condensada de características próximas apenas no wordmark.
 */
export function Logo({ tone = "light", className }: LogoProps) {
  const dark = tone === "dark";
  return (
    <Link
      href="/"
      aria-label="CIFRA — Consultoria Tributária de Obra — página inicial"
      className={cn("inline-flex flex-col leading-none", className)}
    >
      <span
        className={cn(
          "font-display text-[1.7rem] font-medium tracking-[0.3em]",
          dark ? "text-paper" : "text-pine-800",
        )}
      >
        CIFRA
      </span>
      <span
        className={cn(
          "mt-1 text-[0.55rem] font-bold tracking-[0.14em] uppercase",
          dark ? "text-sage-300" : "text-graphite-500",
        )}
      >
        Consultoria Tributária de Obra
      </span>
    </Link>
  );
}
