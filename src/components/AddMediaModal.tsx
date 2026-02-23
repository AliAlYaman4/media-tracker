"use client";

import { useState } from "react";
import { Loader2, Plus, Film, Music, Gamepad2, Sparkles, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCollection } from "@/contexts/CollectionContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AddMediaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type MediaType = "MOVIE" | "MUSIC" | "GAME";
type CollectionStatus = "OWNED" | "WISHLIST" | "USING" | "COMPLETED";

const TYPE_OPTIONS: { value: MediaType; label: string; icon: React.ElementType; color: string }[] = [
  { value: "MOVIE", label: "Movie", icon: Film, color: "text-indigo-500" },
  { value: "MUSIC", label: "Music", icon: Music, color: "text-pink-500" },
  { value: "GAME", label: "Game", icon: Gamepad2, color: "text-green-500" },
];

export function AddMediaModal({ open, onClose, onSuccess }: AddMediaModalProps) {
  const router = useRouter();
  const { refreshStats } = useCollection();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<MediaType>("MOVIE");
  const [useAI, setUseAI] = useState(false);

  // Generate random placeholder image
  const generateRandomImage = (type: MediaType) => {
    const seed = Math.random().toString(36).substring(7);
    const width = 400;
    const height = type === "MOVIE" ? 600 : 400;
    return `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const creator = formData.get('creator') as string;
    const genre = formData.get('genre') as string;
    const description = formData.get('description') as string;
    const releaseDate = formData.get('releaseDate') as string;

    try {
      // Create media item
      const mediaResponse = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          creator,
          type: selectedType,
          genre: genre || undefined,
          description: description || undefined,
          releaseDate: releaseDate ? new Date(releaseDate).toISOString() : undefined,
          image: generateRandomImage(selectedType),
        }),
      });

      if (!mediaResponse.ok) {
        const error = await mediaResponse.json();
        throw new Error(error.error || 'Failed to create media');
      }

      const media = await mediaResponse.json();

      // Add to collection
      const status = formData.get('status') as CollectionStatus;
      const rating = formData.get('rating') as string;
      const notes = formData.get('notes') as string;

      const collectionResponse = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaId: media.id,
          status,
          rating: rating ? parseFloat(rating) : undefined,
          notes: notes || undefined,
        }),
      });

      if (!collectionResponse.ok) {
        throw new Error('Failed to add to collection');
      }

      // Optionally enrich with AI
      if (useAI) {
        try {
          const enrichResponse = await fetch('/api/media/enrich', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              creator,
              type: selectedType,
              description,
              genre,
            }),
          });
          
          if (enrichResponse.ok) {
            const enrichment = await enrichResponse.json();
            console.log('AI Enrichment:', enrichment);
            
            // Show AI enrichment results
            if (enrichment.summary || enrichment.suggestedGenres?.length > 0) {
              const enrichmentDetails = [];
              if (enrichment.summary) enrichmentDetails.push(`Summary: ${enrichment.summary.substring(0, 50)}...`);
              if (enrichment.suggestedGenres?.length > 0) enrichmentDetails.push(`Genres: ${enrichment.suggestedGenres.join(', ')}`);
              
              toast.success('AI enrichment completed!', {
                description: enrichmentDetails.join(' | '),
              });
            }
          }
        } catch (err) {
          console.error('AI enrichment failed:', err);
          toast.error('AI enrichment failed', {
            description: 'Media added but AI enhancement failed.',
          });
        }
      }

      toast.success("Media added to your collection!", {
        description: "You can find it in your collection.",
      });
      
      // Refresh collection stats in sidebar
      await refreshStats();
      
      onSuccess?.();
      onClose();
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to add media", {
        description: error.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add to Collection</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new media item to your collection with optional AI enrichment
          </DialogDescription>
        </DialogHeader>

        {/* AI Feature Banner */}
        <div className={cn(
          "rounded-lg border p-3 transition-all duration-300",
          useAI 
            ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30" 
            : "bg-muted/30 border-border hover:border-primary/30"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
              useAI 
                ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25" 
                : "bg-muted"
            )}>
              <Sparkles className={cn("h-4 w-4 transition-all", useAI ? "text-white" : "text-muted-foreground")} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    AI Enrichment
                    {useAI && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500 text-white">ON</span>}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Auto-generate descriptions & genres
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setUseAI(!useAI)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          useAI ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            useAI ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">AI-Powered Enrichment</p>
                        <p className="text-xs text-muted-foreground">
                          When enabled, AI will automatically:
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Generate a concise summary</li>
                          <li>Suggest relevant genre tags</li>
                          <li>Find similar media in your collection</li>
                        </ul>
                        <p className="text-xs text-muted-foreground italic mt-2">
                          Requires OpenAI API key in environment variables
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Media type selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Type
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedType(value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all duration-200 hover:border-primary/50",
                    selectedType === value
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-muted/30 hover:bg-accent"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      selectedType === value ? color : "text-muted-foreground",
                      selectedType === value && "scale-110"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      selectedType === value ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-medium text-muted-foreground">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder={`e.g. ${selectedType === "MOVIE" ? "Dune: Part Two" : selectedType === "MUSIC" ? "Cowboy Carter" : "Elden Ring"}`}
              required
            />
          </div>

          {/* Creator */}
          <div className="space-y-1.5">
            <Label htmlFor="creator" className="text-xs font-medium text-muted-foreground">
              {selectedType === "MOVIE" ? "Director" : selectedType === "MUSIC" ? "Artist" : "Developer"}
            </Label>
            <Input
              id="creator"
              name="creator"
              placeholder={`e.g. ${selectedType === "MUSIC" ? "Beyoncé" : selectedType === "GAME" ? "FromSoftware" : "Denis Villeneuve"}`}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">
              Description <span className="normal-case font-normal text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea id="description" name="description" placeholder="Brief description..." rows={2} className="resize-none" />
          </div>

          {/* Release Date + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="releaseDate" className="text-xs font-medium text-muted-foreground">
                Release Date <span className="normal-case font-normal text-muted-foreground/60">(optional)</span>
              </Label>
              <Input
                id="releaseDate"
                name="releaseDate"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <Select name="status" defaultValue="OWNED">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNED">Owned</SelectItem>
                  <SelectItem value="WISHLIST">Wishlist</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="USING">Using</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="genre" className="text-xs font-medium text-muted-foreground">
                Genre <span className="normal-case font-normal text-muted-foreground/60">(optional)</span>
              </Label>
              <Input id="genre" name="genre" placeholder="e.g. Sci-Fi" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rating" className="text-xs font-medium text-muted-foreground">
                Rating <span className="normal-case font-normal text-muted-foreground/60">(1–10)</span>
              </Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                placeholder="8"
                min="1"
                max="10"
                step="1"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notes <span className="normal-case font-normal text-muted-foreground/60">(optional)</span>
            </Label>
            <Input id="notes" name="notes" placeholder="Personal notes..." />
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={loading} className="min-w-28">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add to Collection
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
