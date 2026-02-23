"use client";

import { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  List,
  Filter,
  SlidersHorizontal,
  Search,
  Library,
  ArrowUpDown,
} from "lucide-react";
import { MediaCard } from "@/components/MediaCard";
import { MediaTableRow } from "@/components/MediaTableRow";
import { AddMediaModal } from "@/components/AddMediaModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MediaItem, MediaType, MediaStatus } from "@/types";

type ViewMode = "grid" | "list";
type SortKey = "title" | "releaseYear" | "addedAt" | "rating";

const TYPE_FILTERS: { value: MediaType | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "✨" },
  { value: "movie", label: "Movies", emoji: "🎬" },
  { value: "music", label: "Music", emoji: "🎵" },
  { value: "game", label: "Games", emoji: "🎮" },
  { value: "book", label: "Books", emoji: "📚" },
  { value: "tv", label: "TV", emoji: "📺" },
];

const STATUS_FILTERS: { value: MediaStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "OWNED", label: "Owned" },
  { value: "WISHLIST", label: "Wishlist" },
  { value: "COMPLETED", label: "Completed" },
  { value: "USING", label: "Using" },
];

export default function CollectionPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MediaStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("addedAt");
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [collectionItems, setCollectionItems] = useState<any[]>([]);

  // Generate random placeholder image for items without images
  const generateRandomImage = (type: string, id: string) => {
    const seed = `${type}-${id}`;
    const width = 400;
    const height = type.toLowerCase() === "movie" ? 600 : 400;
    return `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collection');
      if (response.ok) {
        const result = await response.json();
        setCollectionItems(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch collection:', error);
      setCollectionItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(collectionItems)) return [];
    
    let items = collectionItems.map((item: any) => ({
      id: item.id,
      title: item.media.title,
      creator: item.media.creator,
      type: item.media.type.toLowerCase(),
      status: item.status,
      rating: item.rating,
      genre: item.media.genre || "",
      releaseYear: item.media.releaseDate ? new Date(item.media.releaseDate).getFullYear() : 2024,
      addedAt: item.createdAt,
      coverUrl: item.media.image || generateRandomImage(item.media.type, item.media.id),
    }));

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.creator.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== "all") {
      items = items.filter((m) => m.type === typeFilter);
    }

    if (statusFilter !== "all") {
      items = items.filter((m) => m.status === statusFilter);
    }

    items.sort((a, b) => {
      switch (sortKey) {
        case "title":
          return a.title.localeCompare(b.title);
        case "releaseYear":
          return b.releaseYear - a.releaseYear;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "addedAt":
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    });

    return items;
  }, [collectionItems, search, typeFilter, statusFilter, sortKey]);

  const hasFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    statusFilter !== "all";

  return (
    <>
      <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" />
            Collection
          </h1>
          <p className="text-sm text-muted-foreground">
            {collectionItems.length} items in your library
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3">
          {/* Type filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {TYPE_FILTERS.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={cn(
                  "flex items-center gap-1.5 shrink-0 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:border-primary/50",
                  typeFilter === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span>{emoji}</span>
                {label}
                {value !== "all" && (
                  <span className="text-xs opacity-60 tabular-nums">
                    ({(collectionItems || []).filter((item: any) => item.media?.type?.toLowerCase() === value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search + controls row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/50"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as MediaStatus | "all")}
            >
              <SelectTrigger className="h-9 w-40 bg-muted/50 border-transparent">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortKey}
              onValueChange={(v) => setSortKey(v as SortKey)}
            >
              <SelectTrigger className="h-9 w-40 bg-muted/50 border-transparent">
                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="addedAt">Recently Added</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
                <SelectItem value="releaseYear">Release Year</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center rounded-xl border border-border bg-muted/50 p-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-lg h-7 w-7",
                  viewMode === "grid" && "bg-background shadow-sm text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-lg h-7 w-7",
                  viewMode === "list" && "bg-background shadow-sm text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active filter indicators */}
          {hasFilters && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                className="text-xs text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <SlidersHorizontal className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No items found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              {hasFilters
                ? "Try adjusting your filters or search term."
                : "Start building your collection by adding media."}
            </p>
            {!hasFilters && (
              <Button variant="gradient" className="mt-4 gap-2">
                Add your first item
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
            {filtered.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={setEditItem}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden animate-fade-in">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40 px-4 py-3 border-b border-border">
              <div className="w-8" />
              <div>Title</div>
              <div className="w-24 text-center hidden sm:block">Type</div>
              <div className="w-24 text-center hidden md:block">Status</div>
              <div className="w-16 text-right">Year</div>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((item) => (
                <MediaTableRow
                  key={item.id}
                  item={item}
                  onEdit={setEditItem}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <AddMediaModal
          open={!!editItem}
          onClose={() => setEditItem(null)}
          onSuccess={fetchCollection}
        />
      )}
    </>
  );
}
