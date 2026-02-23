"use client";

import { useState, useEffect } from "react";
import { User, Library, CheckCircle2, Star, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const [stats, setStats] = useState({ total: 0, completed: 0, wishlist: 0 });
  const [avgRating, setAvgRating] = useState(0);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collection');
      if (response.ok) {
        const result = await response.json();
        const items = result.data || [];

        // Calculate stats
        setStats({
          total: items.length,
          completed: items.filter((i: any) => i.status === 'COMPLETED').length,
          wishlist: items.filter((i: any) => i.status === 'WISHLIST').length,
        });

        // Calculate average rating
        const ratedItems = items.filter((i: any) => i.rating != null);
        if (ratedItems.length > 0) {
          const avg = ratedItems.reduce((sum: number, i: any) => sum + i.rating, 0) / ratedItems.length;
          setAvgRating(avg);
        }

        // Get top rated items
        const top = items
          .filter((i: any) => i.rating != null)
          .sort((a: any, b: any) => b.rating - a.rating)
          .slice(0, 5)
          .map((item: any) => ({
            id: item.id,
            title: item.media.title,
            creator: item.media.creator,
            type: item.media.type.toLowerCase(),
            rating: item.rating,
          }));
        setTopItems(top);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-3xl mx-auto animate-fade-in">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          <Avatar className="h-20 w-20 ring-4 ring-primary/20">
            <AvatarFallback className="text-xl font-bold">AY</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary ring-2 ring-background">
            <span className="text-[10px] text-white">✨</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Ali Yaman</h1>
              <p className="text-sm text-muted-foreground mt-0.5">ali@mediavault.io</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="text-[11px]">Pro Member</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined Jan 2024
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: stats.total, icon: Library, color: "text-indigo-500" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Avg. Rating", value: avgRating > 0 ? avgRating.toFixed(1) : '0.0', icon: Star, color: "text-yellow-500" },
          { label: "Wishlist", value: stats.wishlist, icon: User, color: "text-purple-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4 text-center">
            <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Top rated */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          Top Rated
        </h2>
        <div className="rounded-2xl border border-border overflow-hidden">
          {topItems.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-4 py-3 hover:bg-accent/40 transition-colors ${
                i < topItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-xs font-bold text-muted-foreground/50 tabular-nums w-4">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.creator}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold tabular-nums">
                  {item.rating?.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
