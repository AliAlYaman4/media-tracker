"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc3, Plus, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navSections } from "./sidebar-nav-items";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCollection } from "@/contexts/CollectionContext";

interface SidebarProps {
  onAddMedia?: () => void;
}

export function Sidebar({ onAddMedia }: SidebarProps) {
  const pathname = usePathname();
  const { stats } = useCollection();

  return (
    <aside className="flex h-full w-[248px] flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border/60 shrink-0">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl shrink-0",
          "bg-gradient-to-br from-indigo-500 to-purple-600",
          "shadow-lg shadow-indigo-500/25 ring-1 ring-white/10"
        )}>
          <Disc3 className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-bold text-sidebar-foreground tracking-tight">
            MediaVault
          </span>
          <span className="text-[9px] text-sidebar-foreground/30 tracking-[0.15em] uppercase mt-0.5">
            Collection
          </span>
        </div>
      </div>

      {/* Add media CTA */}
      <div className="px-3 pt-4 pb-2 shrink-0">
        <button
          onClick={onAddMedia}
          className={cn(
            "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl",
            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
            "text-[13px] font-semibold",
            "shadow-md shadow-indigo-500/20",
            "transition-all duration-200",
            "hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-px hover:from-indigo-400 hover:to-purple-500",
            "active:translate-y-0 active:shadow-sm"
          )}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="flex-1 text-left">Add Media</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 space-y-0.5">
        {navSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className={cn(sectionIdx > 0 && "mt-3")}>
            {section.title && (
              <p className="px-3 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-sidebar-foreground/25">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              // Get dynamic badge count
              let badgeCount = item.badge;
              if (item.href === '/collection') badgeCount = stats.total;
              if (item.href === '/wishlist') badgeCount = stats.wishlist;
              if (item.href === '/completed') badgeCount = stats.completed;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 mb-0.5",
                    "text-[13px] font-medium",
                    "transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/45 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/90"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
                  )}

                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg shrink-0",
                    "transition-all duration-200",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-sidebar-foreground/30 group-hover:text-sidebar-foreground/60"
                  )}>
                    <Icon className="h-[15px] w-[15px]" strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  <span className="flex-1 truncate">{item.label}</span>

                  {badgeCount !== undefined && badgeCount > 0 && (
                    <span className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums shrink-0",
                      "transition-colors duration-200",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-sidebar-foreground/8 text-sidebar-foreground/30"
                    )}>
                      {badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer — user profile */}
      <div className="p-3 border-t border-sidebar-border/60 shrink-0">
        <div className={cn(
          "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
          "transition-all duration-200",
          "hover:bg-sidebar-accent/60 cursor-pointer group"
        )}>
          <div className="relative">
            <Avatar className="h-7 w-7 ring-1 ring-white/10">
              <AvatarFallback className="text-[11px] font-bold">AY</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-[1.5px] ring-sidebar border-none" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-sidebar-foreground/90 truncate leading-none">
              Ali Yaman
            </p>
            <p className="text-[10px] text-sidebar-foreground/35 truncate mt-0.5">
              Pro Member
            </p>
          </div>
          <Sparkles className="h-3 w-3 text-yellow-400/60 group-hover:text-yellow-400 transition-colors duration-200 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
