"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MoreHorizontal, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { MediaItem, MediaStatus, MediaType } from "@/types";

const STATUS_CONFIG: Record<MediaStatus, { label: string; variant: string }> = {
  OWNED: { label: "Owned", variant: "default" },
  WISHLIST: { label: "Wishlist", variant: "secondary" },
  COMPLETED: { label: "Completed", variant: "default" },
  USING: { label: "Using", variant: "secondary" },
};

const TYPE_ICONS: Record<MediaType, string> = {
  movie: "🎬",
  music: "🎵",
  game: "🎮",
  book: "📚",
  tv: "📺",
};

const TYPE_COLORS: Record<MediaType, string> = {
  movie: "from-indigo-500/20",
  music: "from-pink-500/20",
  game: "from-green-500/20",
  book: "from-orange-500/20",
  tv: "from-sky-500/20",
};

interface MediaCardProps {
  item: MediaItem;
  onEdit?: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
}

export function MediaCard({ item, onEdit, onDelete }: MediaCardProps) {
  const statusCfg = STATUS_CONFIG[item.status] || { label: "Unknown", variant: "default" };

  return (
    <div className={cn(
      "group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden",
      "transition-all duration-300 ease-out",
      "hover:-translate-y-1.5",
      "hover:border-primary/25",
      "hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_12px_32px_-4px_hsl(0_0%_0%/0.18)]"
    )}>
      {/* Poster */}
      <Link
        href={`/collection/${item.id}`}
        className="block aspect-[2/3] relative overflow-hidden bg-muted shrink-0"
      >
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3",
            "bg-gradient-to-br",
            TYPE_COLORS[item.type],
            "to-muted/80"
          )}>
            <span className="text-4xl drop-shadow-sm">{TYPE_ICONS[item.type]}</span>
            <span className="text-xs text-muted-foreground text-center px-3 line-clamp-2 font-medium">
              {item.title}
            </span>
          </div>
        )}

        {/* Bottom gradient always visible on hover */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type chip */}
        <div className="absolute top-2 left-2">
          <span className="flex h-5 items-center gap-1 rounded-md bg-black/55 backdrop-blur-md px-1.5 text-[10px] font-semibold text-white/90 tracking-wide">
            {TYPE_ICONS[item.type]}
          </span>
        </div>

        {/* Rating pill — appears on hover */}
        {item.rating != null && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <span className="flex h-5 items-center gap-0.5 rounded-md bg-black/55 backdrop-blur-md px-1.5 text-[10px] font-bold text-yellow-400">
              <Star className="h-2.5 w-2.5 fill-current" />
              {item.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Quick action overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <span className="text-[10px] font-semibold text-white/80 tracking-wide">View Details →</span>
        </div>
      </Link>

      {/* Info panel */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <div className="flex items-start justify-between gap-1">
          <Link href={`/collection/${item.id}`} className="flex-1 min-w-0 group/title">
            <h3 className={cn(
              "text-[13px] font-semibold text-foreground leading-snug line-clamp-2",
              "transition-colors duration-150 group-hover/title:text-primary"
            )}>
              {item.title}
            </h3>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "h-6 w-6 shrink-0 -mt-0.5 -mr-0.5",
                  "opacity-0 group-hover:opacity-100",
                  "transition-opacity duration-200"
                )}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-sm">
              <DropdownMenuItem onClick={() => onEdit?.(item)}>
                Edit details
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/collection/${item.id}`}>View page</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => onDelete?.(item.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-[11px] text-muted-foreground/70 truncate">{item.creator}</p>

        <div className="flex items-center justify-between mt-auto pt-1.5">
          <Badge variant={statusCfg.variant as Parameters<typeof Badge>[0]["variant"]} className="text-[10px] h-4.5 px-2">
            {statusCfg.label}
          </Badge>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50 tabular-nums">
            <Calendar className="h-2.5 w-2.5" />
            {item.releaseYear}
          </span>
        </div>
      </div>
    </div>
  );
}
