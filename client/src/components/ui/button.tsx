import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#d4af37] to-[#e8c547] text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:from-[#e8c547] hover:to-[#f4d35a]",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:from-red-500 hover:to-red-400 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-white/30 bg-transparent backdrop-blur-sm shadow-sm hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] dark:bg-transparent dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:shadow-[0_0_25px_rgba(107,114,128,0.6)] hover:from-gray-600 hover:to-gray-500",
        ghost:
          "hover:bg-accent dark:hover:bg-accent/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-10 px-6 py-3 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-4 py-2 has-[>svg]:px-3",
        lg: "h-12 px-8 py-4 has-[>svg]:px-6",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
