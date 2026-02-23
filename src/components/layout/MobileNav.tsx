"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Disc3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { navSections } from "./sidebar-nav-items";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCollection } from "@/contexts/CollectionContext";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onAddMedia?: () => void;
}

export function MobileNav({ open, onClose, onAddMedia }: MobileNavProps) {
  const pathname = usePathname();
  const { stats } = useCollection();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar flex flex-col md:hidden animate-slide-in-left">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Disc3 className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-sidebar-foreground">MediaVault</span>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-sidebar-foreground/60">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Add button */}
        <div className="px-4 pt-4 pb-2 shrink-0">
          <Button
            onClick={() => {
              onAddMedia?.();
              onClose();
            }}
            variant="gradient"
            size="sm"
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Media
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2">
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-1">
              {section.title && (
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
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
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 mb-0.5",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/50 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-sidebar-foreground/40"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    {badgeCount !== undefined && badgeCount > 0 && (
                      <span
                        className={cn(
                          "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
                          isActive
                            ? "bg-primary/20 text-primary"
                            : "bg-sidebar-accent text-sidebar-foreground/40"
                        )}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-3 rounded-xl p-2.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">AY</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">Ali Yaman</p>
              <p className="text-[10px] text-sidebar-foreground/40 truncate">ali@mediavault.io</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
