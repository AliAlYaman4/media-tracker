"use client";

import Link from "next/link";
import { Star, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface MediaTableRowProps {
  item: MediaItem;
  onEdit?: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
}

export function MediaTableRow({ item, onEdit, onDelete }: MediaTableRowProps) {
  const statusCfg = STATUS_CONFIG[item.status];

  return (
    <div className="group grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 items-center px-4 py-3 hover:bg-accent/40 transition-colors duration-150">
      {/* Type icon */}
      <div className="w-8 text-lg mr-3">{TYPE_ICONS[item.type]}</div>

      {/* Title + creator */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <Link
          href={`/collection/${item.id}`}
          className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors"
        >
          {item.title}
        </Link>
        <span className="text-xs text-muted-foreground truncate">{item.creator}</span>
      </div>

      {/* Type badge */}
      <div className="w-24 flex justify-center hidden sm:flex">
        <Badge variant={item.type as Parameters<typeof Badge>[0]["variant"]} className="capitalize">
          {item.type === "tv" ? "TV" : item.type}
        </Badge>
      </div>

      {/* Status badge */}
      <div className="w-24 flex justify-center hidden md:flex">
        <Badge variant={statusCfg.variant as Parameters<typeof Badge>[0]["variant"]}>
          {statusCfg.label}
        </Badge>
      </div>

      {/* Year + rating + menu */}
      <div className="w-16 flex items-center justify-end gap-2">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs tabular-nums text-muted-foreground">{item.releaseYear}</span>
          {item.rating != null && (
            <span className="flex items-center gap-0.5 text-[10px] text-yellow-500">
              <Star className="h-2.5 w-2.5 fill-current" />
              {item.rating.toFixed(1)}
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(item)}>Edit</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/collection/${item.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete?.(item.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
