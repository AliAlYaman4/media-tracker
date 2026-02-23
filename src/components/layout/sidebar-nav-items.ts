import {
  LayoutDashboard,
  Library,
  Heart,
  CheckCircle2,
  User,
  Settings,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Collection", href: "/collection", icon: Library },
      { label: "Completed", href: "/completed", icon: CheckCircle2 },
      { label: "AI Recommendations", href: "/dashboard/recommendations", icon: Sparkles },
    ],
  },
  {
    title: "Library",
    items: [
      { label: "Wishlist", href: "/wishlist", icon: Heart, badge: 3 },
      { label: "Completed", href: "/completed", icon: CheckCircle2, badge: 5 },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
