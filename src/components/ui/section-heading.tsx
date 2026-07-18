import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Rótulo pequeno acima do título (kicker). */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Tema escuro para seções com fundo verde. */
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-bold tracking-[0.18em] uppercase",
            dark ? "text-sage-300" : "text-pine-600",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-extrabold tracking-tight text-balance sm:text-4xl",
          dark ? "text-paper" : "text-graphite-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            dark ? "text-sage-200" : "text-graphite-500",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
