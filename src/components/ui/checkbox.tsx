import * as React from "react";
import { cn } from "@/lib/utils";

/** Checkbox nativo estilizado (accent-color), acessível por padrão. */
const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "mt-0.5 size-5 shrink-0 cursor-pointer rounded border-graphite-200 accent-pine-700",
      className,
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
