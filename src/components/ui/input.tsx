import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "h-12 w-full rounded-lg border border-graphite-200 bg-white px-4 text-base text-graphite-900 placeholder:text-graphite-400 transition-colors focus:border-pine-600 focus:outline-none focus:ring-2 focus:ring-pine-600/20 aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-red-600/10 disabled:cursor-not-allowed disabled:bg-cream",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
