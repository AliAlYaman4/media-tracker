"use client";

import { useState, useEffect } from "react";
import {
  Library,
  Package,
  Heart,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { MediaCard } from "@/components/MediaCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const ACTIVITY = [
  { title: "GNX", action: "added to collection", time: "2 hours ago", type: "music" as const },
  { title: "Hit Me Hard and Soft", action: "added to wishlist", time: "3 days ago", type: "music" as const },
  { title: "Shogun", action: "marked as completed", time: "5 days ago", type: "tv" as const },
  { title: "Poor Things", action: "rated 8.3/10", time: "1 week ago", type: "movie" as const },
];

const TYPE_ICONS: Record<string, string> = {
  movie: "🎬",
  music: "🎵",
  game: "🎮",
  book: "📚",
  tv: "📺",
};

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, owned: 0, wishlist: 0, completed: 0 });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [inProgress, setInProgress] = useState<any[]>([]);
  const [typeBreakdown, setTypeBreakdown] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collection');
      if (response.ok) {
        const result = await response.json();
        const items = result.data || [];

        // Calculate stats
        const statsData = {
          total: items.length,
          owned: items.filter((i: any) => i.status === 'OWNED').length,
          wishlist: items.filter((i: any) => i.status === 'WISHLIST').length,
          completed: items.filter((i: any) => i.status === 'COMPLETED').length,
        };
        setStats(statsData);

        // Get recent items (last 6)
        const recent = items
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6)
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
        setRecentItems(recent);

        // Get in progress items
        const progress = items
          .filter((i: any) => i.status === 'USING')
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
        setInProgress(progress);

        // Calculate type breakdown
        const breakdown: Record<string, number> = {};
        items.forEach((item: any) => {
          const type = item.media.type.toLowerCase();
          breakdown[type] = (breakdown[type] || 0) + 1;
        });
        setTypeBreakdown(breakdown);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1.5 animate-slide-up">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Good evening, Ali
          </h1>
          <span className="text-xl">👋</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Your collection is looking great today.
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
            <Sparkles className="h-2.5 w-2.5" />
            {formatDate(new Date().toISOString())}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          title="Total Items"
          value={stats.total}
          icon={Library}
          subtitle="In your collection"
          trend={{ value: 3, label: "this month" }}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10"
          accentColor="from-indigo-500/6 to-transparent"
        />
        <StatCard
          title="Owned"
          value={stats.owned}
          icon={Package}
          subtitle="Physical & digital"
          iconColor="text-sky-400"
          iconBg="bg-sky-500/10"
          accentColor="from-sky-500/6 to-transparent"
        />
        <StatCard
          title="Wishlist"
          value={stats.wishlist}
          icon={Heart}
          subtitle="Saved for later"
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          accentColor="from-purple-500/6 to-transparent"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          subtitle="Finished items"
          trend={{ value: 1, label: "this week" }}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          accentColor="from-emerald-500/6 to-transparent"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recently Added */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">Recently Added</h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
              <Link href="/collection">View all →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 stagger-children">
            {recentItems.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Currently Playing/Reading */}
          {inProgress.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-foreground">In Progress</h2>
              </div>
              <div className="space-y-2">
                {inProgress.map((item) => (
                  <Link
                    key={item.id}
                    href={`/collection/${item.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-accent transition-all duration-200 group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                      {TYPE_ICONS[item.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{item.creator}</p>
                    </div>
                    <Badge variant="playing" className="shrink-0">Playing</Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Activity feed */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
            </div>
            <div className="space-y-1">
              {ACTIVITY.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/50 transition-colors duration-200 group cursor-pointer"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                    {TYPE_ICONS[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">
                      <span className="font-semibold">{activity.title}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats by type */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">By Type</h2>
            {(["movie", "music", "game", "book", "tv"] as const).map((type) => {
              const count = typeBreakdown[type] || 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-base w-5 shrink-0">{TYPE_ICONS[type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground capitalize">{type === "tv" ? "TV Shows" : type + "s"}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
