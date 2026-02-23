import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  iconColor?: string;
  iconBg?: string;
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = "text-indigo-400",
  iconBg = "bg-indigo-500/10",
  accentColor = "from-indigo-500/5 to-transparent",
}: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-border bg-card p-6",
      "transition-all duration-300 hover:-translate-y-1",
      "hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_8px_32px_-4px_hsl(0_0%_0%/0.12)]",
      "hover:border-border/80",
      "group"
    )}>
      {/* Ambient glow on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        accentColor
      )} />

      {/* Decorative corner dot */}
      <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-2xl group-hover:opacity-70 opacity-40 transition-opacity duration-500" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            {title}
          </p>
          <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground leading-none mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/60 mt-1.5">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-completed/15">
                <TrendingUp className="h-2.5 w-2.5 text-completed" />
              </div>
              <span className="text-[11px] font-semibold text-completed">
                +{trend.value}
              </span>
              <span className="text-[11px] text-muted-foreground/60">{trend.label}</span>
            </div>
          )}
        </div>

        <div className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          iconBg
        )}>
          <Icon className={cn("h-5 w-5", iconColor)} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
