"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Calendar,
  Pencil,
  Trash2,
  Heart,
  Share2,
  CheckCircle,
  Clock,
  BookMarked,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddMediaModal } from "@/components/AddMediaModal";
import { AIInsightsCard } from "@/components/AIInsightsCard";
import { formatDate } from "@/lib/utils";
import type { MediaStatus, MediaType } from "@/types";

const TYPE_ICONS: Record<MediaType, string> = {
  movie: "🎬",
  music: "🎵",
  game: "🎮",
  book: "📚",
  tv: "📺",
};

const STATUS_CONFIG: Record<MediaStatus, { label: string; variant: string; icon: React.ElementType }> = {
  OWNED: { label: "Owned", variant: "default", icon: BookMarked },
  WISHLIST: { label: "Wishlist", variant: "secondary", icon: Heart },
  COMPLETED: { label: "Completed", variant: "default", icon: CheckCircle },
  USING: { label: "Using", variant: "secondary", icon: Clock },
};

export default function MediaDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [status, setStatus] = useState<MediaStatus>("OWNED");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchMediaDetail(params.id as string);
    }
  }, [params.id]);

  const fetchMediaDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/collection/${id}`);
      if (response.ok) {
        const collectionItem = await response.json();
        const mediaItem = {
          id: collectionItem.id,
          title: collectionItem.media.title,
          creator: collectionItem.media.creator,
          type: collectionItem.media.type.toLowerCase(),
          status: collectionItem.status,
          rating: collectionItem.rating,
          genre: collectionItem.media.genre || "",
          description: collectionItem.media.description || "",
          releaseYear: collectionItem.media.releaseDate ? new Date(collectionItem.media.releaseDate).getFullYear() : 2024,
          addedAt: collectionItem.createdAt,
          notes: collectionItem.notes || "",
          coverUrl: collectionItem.media.image || `https://picsum.photos/seed/${collectionItem.media.type}-${collectionItem.media.id}/400/${collectionItem.media.type === 'MOVIE' ? 600 : 400}.jpg`,
        };
        setItem(mediaItem);
        setStatus(collectionItem.status);

        // Fetch related items
        const collectionResponse = await fetch('/api/collection');
        if (collectionResponse.ok) {
          const result = await collectionResponse.json();
          const related = (result.data || [])
            .filter((i: any) => i.id !== id && (i.media.type === collectionItem.media.type || i.media.creator === collectionItem.media.creator))
            .slice(0, 4)
            .map((item: any) => ({
              id: item.id,
              title: item.media.title,
              creator: item.media.creator,
              type: item.media.type.toLowerCase(),
              status: item.status,
              rating: item.rating,
              genre: item.media.genre || "",
              releaseYear: item.media.releaseDate ? new Date(item.media.releaseDate).getFullYear() : 2024,
              addedAt: item.createdAt,
              coverUrl: item.media.image || `https://picsum.photos/seed/${item.media.type}-${item.media.id}/400/${item.media.type === 'MOVIE' ? 600 : 400}.jpg`,
            }));
          setRelatedItems(related);
        }
      }
    } catch (error) {
      console.error('Failed to fetch media detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
        <div className="text-5xl">🔍</div>
        <h2 className="text-lg font-semibold">Item not found</h2>
        <Button asChild variant="outline">
          <Link href="/collection">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collection
          </Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[status];
  const StatusIcon = statusCfg.icon;

  return (
    <>
      <div className="animate-fade-in">
        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          {item.coverUrl ? (
            <>
              <Image
                src={item.coverUrl}
                alt={item.title}
                fill
                className="object-cover object-center scale-105"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 mesh-gradient" />
          )}

          {/* Back button */}
          <div className="absolute top-6 left-6">
            <Button asChild variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm border-border/50">
              <Link href="/collection">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Collection
              </Link>
            </Button>
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4 max-w-5xl">
              {/* Poster thumbnail */}
              {item.coverUrl && (
                <div className="hidden md:block w-28 h-40 rounded-xl overflow-hidden shrink-0 border border-border/30 shadow-2xl ring-1 ring-white/10">
                  <Image
                    src={item.coverUrl}
                    alt={item.title}
                    width={112}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                {/* Meta badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="flex h-6 items-center gap-1.5 rounded-lg bg-black/40 backdrop-blur-sm px-2.5 text-xs font-medium text-white">
                    {TYPE_ICONS[item.type as MediaType]}
                    <span className="capitalize">{item.type === "tv" ? "TV Show" : item.type}</span>
                  </span>
                  {item.genre && (
                    <span className="h-6 flex items-center rounded-lg bg-black/30 backdrop-blur-sm px-2.5 text-[11px] text-white/70">
                      {item.genre}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight mb-1">
                  {item.title}
                </h1>
                <p className="text-base text-white/60 font-medium">{item.creator}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-w-5xl space-y-8">
          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status selector */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
              <StatusIcon className="h-4 w-4 text-muted-foreground" />
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v as MediaStatus);
                  toast.success(`Status updated to ${STATUS_CONFIG[v as MediaStatus].label}`);
                }}
              >
                <SelectTrigger className="h-auto border-none bg-transparent p-0 shadow-none focus:ring-0 text-sm font-medium w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="wishlist">Wishlist</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="playing">Playing</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5 ml-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              {item.description && (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    About
                  </h2>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Notes placeholder */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Notes
                </h2>
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No notes yet.{" "}
                    <button
                      onClick={() => setEditOpen(true)}
                      className="text-primary hover:underline"
                    >
                      Add a note
                    </button>
                  </p>
                </div>
              </div>

              {/* AI Insights */}
              <AIInsightsCard
                mediaId={item.id}
                title={item.title}
                creator={item.creator}
                type={item.type.toUpperCase()}
                description={item.description}
                genre={item.genre}
              />
            </div>

            {/* Sidebar metadata */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Details
                </h2>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge variant={statusCfg.variant as Parameters<typeof Badge>[0]["variant"]}>
                      {statusCfg.label}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Year</span>
                    <span className="text-xs font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.releaseYear}
                    </span>
                  </div>

                  {item.rating !== undefined && (
                    <>
                      <Separator />
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Rating</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-yellow-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {item.rating != null ? `${item.rating.toFixed(1)} / 10` : 'Not rated'}
                        </span>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Added</span>
                    <span className="text-xs font-medium">{formatDate(item.addedAt)}</span>
                  </div>

                  {item.completedAt && (
                    <>
                      <Separator />
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Completed</span>
                        <span className="text-xs font-medium">{formatDate(item.completedAt)}</span>
                      </div>
                    </>
                  )}

                  <Separator />

                  {item.genre && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Genre</span>
                      <Badge variant="outline" className="text-[10px]">{item.genre}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          {relatedItems.length > 0 && (
            <div className="space-y-4 pt-2">
              <Separator />
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">More like this</h2>
                <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                  <Link href="/collection">View all →</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedItems.map((related) => (
                  <Link
                    key={related.id}
                    href={`/collection/${related.id}`}
                    className="group flex flex-col gap-2"
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-muted relative">
                      {related.coverUrl ? (
                        <Image
                          src={related.coverUrl}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="200px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-3xl">
                          {TYPE_ICONS[related.type as MediaType]}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                      {related.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate -mt-1">{related.creator}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AddMediaModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
