import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-lg border border-graphite-200 bg-white px-4 py-3 text-base text-graphite-900 placeholder:text-graphite-500 transition-colors focus:border-pine-600 focus:outline-none focus:ring-2 focus:ring-pine-600/20 aria-[invalid=true]:border-red-600 disabled:cursor-not-allowed disabled:bg-cream",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
