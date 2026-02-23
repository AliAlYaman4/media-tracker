"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";
import { AddMediaModal } from "@/components/AddMediaModal";
import { Toaster } from "sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0 relative">
        <Sidebar onAddMedia={() => setAddModalOpen(true)} />
      </div>

      {/* Mobile Nav */}
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onAddMedia={() => setAddModalOpen(true)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopNav
          onMenuToggle={() => setMobileNavOpen(true)}
          onAddMedia={() => setAddModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Add Media Modal */}
      <AddMediaModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "bg-card border border-border text-card-foreground shadow-lg rounded-xl",
            title: "text-sm font-semibold",
            description: "text-xs text-muted-foreground",
          },
        }}
      />
    </div>
  );
}
