import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-600 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-[1.125em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-pine-800 text-paper hover:bg-pine-700 active:bg-pine-900 shadow-soft",
        secondary:
          "border border-pine-800/25 bg-transparent text-pine-800 hover:bg-sage-50 active:bg-sage-100",
        ghost: "text-pine-800 hover:bg-sage-50",
        whatsapp:
          "bg-[#128c4b] text-white hover:bg-[#0f7a41] active:bg-[#0c6836] shadow-soft",
        light:
          "bg-paper text-pine-900 hover:bg-cream active:bg-sage-100 shadow-soft",
        outlineLight:
          "border border-paper/40 bg-transparent text-paper hover:bg-paper/10",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-sm",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
