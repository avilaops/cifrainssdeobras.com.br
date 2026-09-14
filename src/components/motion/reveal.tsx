import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Atraso em segundos (para escalonar itens de uma lista). */
  delay?: number;
  className?: string;
}

/**
 * Entrada discreta ao rolar, feita apenas com CSS. Assim, o efeito não envia
 * uma biblioteca de animação para o navegador e o conteúdo continua visível
 * quando a API de scroll animation não é suportada.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      className={["reveal", className].filter(Boolean).join(" ")}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
