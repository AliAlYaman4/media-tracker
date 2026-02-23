"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CollectionStats {
  total: number;
  wishlist: number;
  completed: number;
  owned: number;
  using: number;
}

interface CollectionContextType {
  stats: CollectionStats;
  refreshStats: () => Promise<void>;
  isLoading: boolean;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<CollectionStats>({
    total: 0,
    wishlist: 0,
    completed: 0,
    owned: 0,
    using: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/collection');
      if (response.ok) {
        const result = await response.json();
        const items = result.data || [];
        setStats({
          total: items.length,
          wishlist: items.filter((i: any) => i.status === 'WISHLIST').length,
          completed: items.filter((i: any) => i.status === 'COMPLETED').length,
          owned: items.filter((i: any) => i.status === 'OWNED').length,
          using: items.filter((i: any) => i.status === 'USING').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch collection stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return (
    <CollectionContext.Provider value={{ stats, refreshStats, isLoading }}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}
