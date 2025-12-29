import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_-4px_hsl(var(--charcoal)/0.08)] hover:shadow-[0_8px_30px_-8px_hsl(var(--charcoal)/0.12)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent hover:bg-secondary hover:text-secondary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-[hsl(38,50%,55%)] to-[hsl(40,45%,65%)] text-accent-foreground hover:opacity-90",
        hero: "bg-background/10 text-[hsl(var(--cream))] border border-[hsl(var(--cream))]/30 backdrop-blur-sm hover:bg-background/20 rounded-sm",
        heroSolid: "bg-background text-foreground hover:bg-background/90 shadow-[0_4px_20px_-4px_hsl(var(--charcoal)/0.08)] rounded-sm",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-sm",
        sm: "h-9 px-4 rounded-sm text-xs",
        lg: "h-14 px-10 rounded-sm text-base tracking-wide",
        icon: "h-10 w-10 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
