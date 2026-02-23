"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Loader2, RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaCard } from "@/components/MediaCard";
import { cn } from "@/lib/utils";

interface RecommendedMedia {
  id: string;
  title: string;
  creator: string;
  type: string;
  genre?: string;
  description?: string;
  image?: string;
  releaseDate?: string;
}

interface RecommendationMeta {
  total: number;
  basedOn: {
    collectionSize: number;
    topGenres: string[];
    topTypes: string[];
    averageRating: string | null;
  };
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<RecommendedMedia[]>([]);
  const [meta, setMeta] = useState<RecommendationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/recommendations?limit=12');
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const result = await response.json();
      setRecommendations(result.data || []);
      setMeta(result.meta || null);

      if (isRefresh) {
        toast.success('Recommendations refreshed!');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading AI recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                AI Recommendations
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-muted-foreground">
                Personalized suggestions based on your collection
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => fetchRecommendations(true)}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* AI Insights Card */}
      {meta && (
        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Your Preferences
            </CardTitle>
            <CardDescription>
              Based on {meta.basedOn.collectionSize} items in your collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Top Genres
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {meta.basedOn.topGenres.length > 0 ? (
                    meta.basedOn.topGenres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No genres yet</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Preferred Types
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {meta.basedOn.topTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {meta.basedOn.averageRating && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Avg Rating
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-500">
                      {meta.basedOn.averageRating}
                    </span>
                    <span className="text-sm text-muted-foreground">/10</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Grid */}
      {recommendations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Add more items to your collection to get personalized AI-powered recommendations
              based on your preferences.
            </p>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Recommended for You
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({recommendations.length} items)
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendations.map((item) => (
              <MediaCard 
                key={item.id} 
                item={{
                  ...item,
                  type: item.type as any,
                  status: 'WISHLIST' as any,
                  releaseYear: item.releaseDate ? new Date(item.releaseDate).getFullYear() : new Date().getFullYear(),
                  genre: item.genre ? [item.genre] : [],
                  coverUrl: item.image,
                  addedAt: new Date().toISOString(),
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Feature Info */}
      <Card className="border-purple-500/20 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">How AI Recommendations Work</p>
              <p className="text-xs text-muted-foreground">
                Our AI analyzes your collection to identify your favorite genres, media types, and
                highly-rated items. It then suggests similar content you might enjoy based on these
                patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
