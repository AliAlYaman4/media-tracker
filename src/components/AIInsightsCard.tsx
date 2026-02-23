"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, Lightbulb, Tag, Link2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AIInsightsProps {
  mediaId: string;
  title: string;
  creator: string;
  type: string;
  description?: string;
  genre?: string;
}

interface EnrichmentData {
  summary: string | null;
  suggestedGenres: string[];
  similarMedia: Array<{
    id: string;
    title: string;
    creator: string;
    type: string;
    similarity: string;
  }>;
}

export function AIInsightsCard({ mediaId, title, creator, type, description, genre }: AIInsightsProps) {
  const [enrichment, setEnrichment] = useState<EnrichmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchEnrichment = async () => {
    if (hasLoaded) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/media/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          creator,
          type,
          description,
          genre,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI insights');
      }

      const data = await response.json();
      setEnrichment(data);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrichment();
  }, []);

  if (loading) {
    return (
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Insights
            <Badge variant="secondary" className="ml-auto bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-purple-500" />
            <p className="text-xs text-muted-foreground">Analyzing with AI...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!enrichment) {
    return null;
  }

  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Insights
          <Badge variant="secondary" className="ml-auto bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          AI-generated analysis and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Summary */}
        {enrichment.summary && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-purple-500" />
              <h4 className="text-sm font-semibold">AI Summary</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {enrichment.summary}
            </p>
          </div>
        )}

        {/* Suggested Genres */}
        {enrichment.suggestedGenres.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-500" />
              <h4 className="text-sm font-semibold">Suggested Genres</h4>
            </div>
            <div className="flex flex-wrap gap-2 pl-6">
              {enrichment.suggestedGenres.map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Similar Media */}
        {enrichment.similarMedia.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-purple-500" />
              <h4 className="text-sm font-semibold">Similar in Your Collection</h4>
            </div>
            <div className="space-y-2 pl-6">
              {enrichment.similarMedia.slice(0, 3).map((similar) => (
                <div
                  key={similar.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border/50 bg-background/50 p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{similar.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      by {similar.creator}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {similar.similarity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="pt-4 border-t border-purple-500/10">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-purple-500" />
            Generated by AI based on your collection and preferences
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
