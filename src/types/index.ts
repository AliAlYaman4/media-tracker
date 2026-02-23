export type MediaType = "movie" | "music" | "game" | "book" | "tv";

export type MediaStatus = "OWNED" | "WISHLIST" | "COMPLETED" | "USING";

export interface MediaItem {
  id: string;
  title: string;
  creator: string;       // director / artist / developer / author
  type: MediaType;
  status: MediaStatus;
  releaseYear: number;
  genre: string[];
  description?: string;
  coverUrl?: string;
  rating?: number;       // 0–10
  notes?: string;
  addedAt: string;       // ISO date string
  completedAt?: string;
}

export interface StatsData {
  total: number;
  owned: number;
  wishlist: number;
  completed: number;
}
