"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { MediaCard } from "@/components/MediaCard";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collection?status=WISHLIST');
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
        setWishlistItems(items);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-wishlist" />
            Wishlist
          </h1>
          <p className="text-sm text-muted-foreground">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved for later
          </p>
        </div>
        <Button variant="gradient" size="sm" className="gap-2 hidden sm:inline-flex">
          <Plus className="h-4 w-4" />
          Add to Wishlist
        </Button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-wishlist/10 mb-4">
            <Heart className="h-7 w-7 text-wishlist" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">
            Browse your collection and save items you want to get.
          </p>
          <Button variant="gradient" className="mt-4 gap-2" asChild>
            <Link href="/collection">
              Browse Collection
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {wishlistItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
