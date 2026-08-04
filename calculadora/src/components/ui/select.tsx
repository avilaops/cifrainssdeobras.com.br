import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Select nativo estilizado: melhor experiência em telas de toque e leitores
 * de tela do que dropdowns customizados, mantendo o visual do design system.
 */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-12 w-full appearance-none rounded-lg border border-graphite-200 bg-white px-4 pr-10 text-base text-graphite-900 transition-colors focus:border-pine-600 focus:outline-none focus:ring-2 focus:ring-pine-600/20 aria-[invalid=true]:border-red-600 disabled:cursor-not-allowed disabled:bg-cream invalid:text-graphite-400",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-graphite-500"
      />
    </div>
  );
});
Select.displayName = "Select";

export { Select };
