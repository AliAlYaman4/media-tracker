"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { MediaCard } from "@/components/MediaCard";

export default function CompletedPage() {
  const [completedItems, setCompletedItems] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedItems();
  }, []);

  const fetchCompletedItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collection?status=COMPLETED');
      if (response.ok) {
        const result = await response.json();
        const items = (result.data || []).map((item: any) => ({
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
        setCompletedItems(items);

        // Calculate average rating
        const ratedItems = items.filter((i: any) => i.rating != null);
        if (ratedItems.length > 0) {
          const avg = ratedItems.reduce((sum: number, i: any) => sum + i.rating, 0) / ratedItems.length;
          setAvgRating(avg);
        }
      }
    } catch (error) {
      console.error('Failed to fetch completed items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-completed" />
          Completed
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {completedItems.length} item{completedItems.length !== 1 ? "s" : ""} completed
          </p>
          {avgRating > 0 && (
            <span className="flex items-center gap-1 text-sm text-yellow-500 font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              {avgRating.toFixed(1)} avg. rating
            </span>
          )}
        </div>
      </div>

      {completedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-completed/10 mb-4">
            <CheckCircle2 className="h-7 w-7 text-completed" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Nothing completed yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">
            Mark items as completed to track your progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {completedItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
