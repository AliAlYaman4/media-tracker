import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "text-foreground border-border",
        owned:
          "border-transparent bg-owned/10 text-owned dark:bg-owned/20",
        wishlist:
          "border-transparent bg-wishlist/10 text-wishlist dark:bg-wishlist/20",
        completed:
          "border-transparent bg-completed/10 text-completed dark:bg-completed/20",
        playing:
          "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
        dropped:
          "border-transparent bg-slate-500/10 text-slate-500",
        // Media type badges
        movie:
          "border-transparent bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        music:
          "border-transparent bg-pink-500/10 text-pink-600 dark:text-pink-400",
        game:
          "border-transparent bg-green-500/10 text-green-600 dark:text-green-400",
        book:
          "border-transparent bg-orange-500/10 text-orange-600 dark:text-orange-400",
        tv:
          "border-transparent bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
