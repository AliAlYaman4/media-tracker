'use client';

import { SessionProvider } from 'next-auth/react';
import { CollectionProvider } from "@/contexts/CollectionContext";
import { AIOnboarding } from "@/components/AIOnboarding";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CollectionProvider>
        {children}
        <AIOnboarding />
      </CollectionProvider>
    </SessionProvider>
  );
}
