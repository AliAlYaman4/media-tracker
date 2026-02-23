"use client";

import { useState } from "react";
import { Search, Bell, Plus, Menu, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TopNavProps {
  onMenuToggle?: () => void;
  onAddMedia?: () => void;
}

export function TopNav({ onMenuToggle, onAddMedia }: TopNavProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className={cn(
      "flex h-14 items-center gap-3 px-4 md:px-6",
      "border-b border-border/60",
      "bg-background/90 backdrop-blur-xl",
      "sticky top-0 z-30"
    )}>
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden shrink-0 text-muted-foreground hover:text-foreground"
        onClick={onMenuToggle}
      >
        <Menu className="h-4.5 w-4.5" />
      </Button>

      {/* Search */}
      <div className={cn(
        "relative transition-all duration-300 ease-out",
        searchFocused ? "flex-[2]" : "flex-1",
        "max-w-sm md:max-w-md"
      )}>
        <div className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
          searchFocused ? "text-primary" : "text-muted-foreground/60"
        )}>
          <Search className="h-3.5 w-3.5" />
        </div>
        <input
          placeholder="Search collection..."
          className={cn(
            "h-9 w-full rounded-xl pl-9 pr-16 text-sm",
            "bg-muted/50 border border-transparent",
            "text-foreground placeholder:text-muted-foreground/50",
            "transition-all duration-200",
            "focus:outline-none focus:border-primary/30 focus:bg-background focus:ring-0",
            searchFocused && "shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
          )}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          <kbd className={cn(
            "hidden sm:flex h-5 select-none items-center gap-0.5 rounded-md border border-border",
            "bg-muted px-1.5 font-mono text-[9px] font-semibold text-muted-foreground/60",
            "transition-opacity duration-200",
            searchFocused ? "opacity-100" : "opacity-60"
          )}>
            <Command className="h-2.5 w-2.5" />
            K
          </kbd>
        </div>
      </div>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-1.5">
        {/* Add button — desktop */}
        <button
          onClick={onAddMedia}
          className={cn(
            "hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl",
            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
            "text-xs font-semibold",
            "shadow-sm shadow-indigo-500/20",
            "transition-all duration-200",
            "hover:shadow-md hover:shadow-indigo-500/25 hover:-translate-y-px",
            "active:translate-y-0"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Media
        </button>

        {/* Notifications */}
        <button className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl",
          "text-muted-foreground/70 hover:text-foreground",
          "hover:bg-accent transition-all duration-200"
        )}>
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary ring-1.5 ring-background" />
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-2 rounded-xl p-1.5 pr-2.5",
              "hover:bg-accent transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}>
              <Avatar className="h-7 w-7">
                {session?.user?.image && <AvatarImage src={session.user.image} />}
                <AvatarFallback className="text-[10px] font-bold">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-[13px] font-medium text-foreground/80">
                {session?.user?.name?.split(' ')[0] || 'User'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal py-2.5">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email || ''}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" onClick={() => router.push('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={handleSignOut}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
