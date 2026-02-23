# Library Management System - Context & Architecture Guide

> **Purpose**: This document serves as a reference for building similar projects with the same stack, principles, and patterns. Use this as context when starting new projects with similar requirements.

---

## 📚 Table of Contents
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Design System](#design-system)
- [Component Patterns](#component-patterns)
- [Authentication & Authorization](#authentication--authorization)
- [Database & ORM](#database--orm)
- [File Structure](#file-structure)
- [Development Principles](#development-principles)
- [Key Learnings](#key-learnings)

---

## 🛠 Tech Stack

### Core Framework
- **Next.js latest** (App Router)
  - Server Components by default
  - Client Components with `'use client'` directive
  - File-based routing in `src/app/`
  - API routes in `src/app/api/`

### Styling & UI
- **Tailwind CSS latest**
  - Custom CSS variables for theming
  - Design tokens approach
  - Dark mode support via `class` strategy
- **Lucide React** - Icon library (tree-shakeable, modern)
- **class-variance-authority (CVA)** - Type-safe variant styling
- **tailwind-merge + clsx** - Conditional className merging

### State & Data
- **Prisma ORM** - Type-safe database client
  - PostgreSQL (production-ready)
  - Schema-first approach
  - Migrations in `prisma/migrations/`
- **NextAuth.js** - Authentication
  - Credentials provider
  - Google OAuth provider
  - JWT strategy
  - Session management

### UI Libraries
- **Sonner** - Toast notifications (beautiful, accessible)
- **Custom UI Components** - shadcn/ui inspired patterns

---

## 🏗 Project Architecture

### App Router Structure
```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (metadata, providers)
│   ├── page.tsx                 # Home page (redirects)
│   ├── globals.css              # Global styles + Tailwind
│   ├── auth/                    # Auth pages (signin, signup)
│   ├── dashboard/               # Dashboard route
│   ├── books/                   # Books listing & details
│   ├── admin/                   # Admin-only routes
│   └── api/                     # API routes
│       ├── auth/                # NextAuth endpoints
│       ├── books/               # Book CRUD
│       ├── borrow/              # Borrow operations
│       └── return/              # Return operations
├── components/                   # React components
│   ├── ui/                      # Reusable UI primitives
│   ├── layout/                  # Layout components
│   └── *.tsx                    # Feature components
├── contexts/                     # React Context providers
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── middleware.ts                 # Next.js middleware (auth guards)
```

### Component Architecture

**Three-tier component structure:**

1. **UI Primitives** (`src/components/ui/`)
   - Reusable, generic components
   - No business logic
   - Variant-based styling with CVA
   - Examples: Button, Badge, Card, Skeleton

2. **Layout Components** (`src/components/layout/`)
   - Page structure components
   - Navigation, sidebars, headers
   - Responsive behavior
   - Examples: AppLayout, Sidebar, TopNav, MobileNav

3. **Feature Components** (`src/components/`)
   - Business logic components
   - Domain-specific
   - Examples: AddBookModal, BorrowReturnButton, SearchBar

---

## 🎨 Design System

### Color Palette (CSS Variables)
```css
/* Light Mode */
--background: 0 0% 100%;           /* Pure white */
--foreground: 222.2 84% 4.9%;      /* Near black */
--card: 0 0% 100%;                 /* White cards */
--primary: 221.2 83.2% 53.3%;      /* Modern blue */
--destructive: 0 84.2% 60.2%;      /* Red for errors */
--success: 142 76% 36%;            /* Green for success */
--warning: 38 92% 50%;             /* Orange for warnings */
--muted: 210 40% 96.1%;            /* Light gray */
--border: 214.3 31.8% 91.4%;       /* Subtle borders */

/* Dark Mode - automatically applied via .dark class */
```

### Spacing Scale
- Uses Tailwind's default spacing (4px base unit)
- Common gaps: `gap-2`, `gap-4`, `gap-6`, `gap-8`
- Padding: `p-4`, `p-6`, `p-8` for containers
- Margins: Minimal, prefer gap/space utilities

### Border Radius
- Small: `rounded-lg` (0.5rem / 8px)
- Medium: `rounded-xl` (0.75rem / 12px)
- Large: `rounded-2xl` (1rem / 16px)
- Full: `rounded-full` for avatars/icons

### Shadows
- Subtle: `shadow-sm`
- Default: `shadow`
- Elevated: `shadow-lg`
- Avoid heavy shadows (modern, flat aesthetic)

### Typography
- Font: Inter (Google Fonts)
- Headings: `font-bold`, `tracking-tight`
- Body: `text-sm` or `text-base`
- Muted text: `text-muted-foreground`

### Animation Utilities
```css
/* Defined in globals.css */
.animate-fade-in        /* Opacity 0 → 1 */
.animate-slide-up       /* Translate Y + fade */
.animate-slide-down     /* Translate Y + fade */
.animate-scale-in       /* Scale 0.95 → 1 + fade */
.animate-shimmer        /* Loading skeleton effect */
```

---

## 🧩 Component Patterns

### 1. Button Component
```tsx
// src/components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### 2. Card Component
```tsx
// src/components/ui/card.tsx
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}
```

### 3. Modal Pattern
```tsx
// Backdrop + centered content + escape key handling
export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 animate-scale-in">
        {children}
      </div>
    </div>
  );
}
```

### 4. Toast Notifications
```tsx
import { toast } from 'sonner';

// Success
toast.success('Book added successfully!');

// Error
toast.error('Failed to add book');

// Loading
const toastId = toast.loading('Adding book...');
// Later: toast.success('Done!', { id: toastId });

// Custom
toast('Custom message', {
  description: 'Additional details',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
});
```

### 5. Empty State Pattern
```tsx
export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

---

## 🔐 Authentication & Authorization

### NextAuth Configuration
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Validate credentials
        // Return user object or null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: { strategy: 'jwt' },
};
```

### Middleware (Route Protection)
```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Role-based access control
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/books/:path*', '/admin/:path*'],
};
```

### Server-Side Auth Utilities
```typescript
// src/lib/auth-utils.ts
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') redirect('/unauthorized');
  return user;
}
```

### Client-Side Auth Hook
```typescript
// src/hooks/useUserRole.ts
export function useUserRole() {
  const { data: session } = useSession();
  const user = session?.user;

  return {
    isAdmin: user?.role === 'ADMIN',
    isLibrarian: user?.role === 'LIBRARIAN' || user?.role === 'ADMIN',
    canManageBooks: user?.role === 'LIBRARIAN' || user?.role === 'ADMIN',
    role: user?.role,
  };
}
```

---

## 🗄 Database & ORM

### Prisma Schema Pattern
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  LIBRARIAN
  MEMBER
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String?   // Null for OAuth users
  role          UserRole  @default(MEMBER)
  image         String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  borrows       Borrow[]
  
  @@map("users")
}

model Book {
  id              String   @id @default(cuid())
  title           String
  author          String
  description     String?
  genre           String
  publishedYear   Int
  totalCopies     Int      @default(1)
  availableCopies Int      @default(1)
  viewCount       Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  borrows         Borrow[]
  
  @@index([title, author])
  @@map("books")
}

model Borrow {
  id          String    @id @default(cuid())
  userId      String
  bookId      String
  borrowedAt  DateTime  @default(now())
  dueDate     DateTime
  returnedAt  DateTime?
  penalty     Float     @default(0)
  
  user        User      @relation(fields: [userId], references: [id])
  book        Book      @relation(fields: [bookId], references: [id])
  
  @@index([userId])
  @@index([bookId])
  @@map("borrows")
}
```

### Prisma Best Practices

**1. Use transactions for multi-step operations:**
```typescript
await prisma.$transaction(async (tx) => {
  const book = await tx.book.update({
    where: { id: bookId },
    data: { availableCopies: { decrement: 1 } },
  });
  
  const borrow = await tx.borrow.create({
    data: { userId, bookId, dueDate },
  });
  
  return { book, borrow };
});
```

**2. Select only needed fields:**
```typescript
const books = await prisma.book.findMany({
  select: {
    id: true,
    title: true,
    author: true,
    availableCopies: true,
  },
});
```

**3. Implement pagination:**
```typescript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const [books, total] = await Promise.all([
  prisma.book.findMany({ skip, take: limit }),
  prisma.book.count(),
]);
```

**4. Use indexes for queried fields:**
```prisma
@@index([email])
@@index([title, author])
```

---

## 📁 File Structure

### Complete Directory Tree
```
library-management/
├── prisma/
│   ├── migrations/              # Database migrations
│   └── schema.prisma            # Database schema
├── public/                      # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   └── analytics/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   ├── books/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── search/route.ts
│   │   │   ├── borrow/
│   │   │   │   └── [bookId]/route.ts
│   │   │   └── return/
│   │   │       └── [bookId]/route.ts
│   │   ├── auth/
│   │   │   ├── signin/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── books/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── unauthorized/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── stat-card.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarNav.tsx
│   │   │   ├── TopNav.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── AddBookButton.tsx
│   │   ├── AddBookModal.tsx
│   │   ├── BorrowReturnButton.tsx
│   │   ├── DeleteBookButton.tsx
│   │   ├── Providers.tsx
│   │   ├── SearchBar.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   └── useUserRole.ts
│   ├── lib/
│   │   ├── analytics.ts
│   │   ├── auth.ts
│   │   ├── auth-utils.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .env                        # Environment variables
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 💡 Development Principles

### 1. **Server Components by Default**
- Use Server Components unless you need:
  - Client-side interactivity (onClick, useState)
  - Browser APIs (localStorage, window)
  - React hooks (useEffect, useContext)
- Add `'use client'` only when necessary

### 2. **Type Safety**
- Use TypeScript strictly
- Define interfaces for props
- Use Prisma-generated types
- Avoid `any` type

### 3. **Component Composition**
- Small, focused components
- Single Responsibility Principle
- Compose complex UIs from simple primitives
- Extract reusable logic to hooks

### 4. **Styling Conventions**
- Use Tailwind utility classes
- Design tokens for colors (CSS variables)
- Avoid inline styles
- Use `cn()` utility for conditional classes
```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className // Allow override
)} />
```

### 5. **Error Handling**
- Try-catch in async operations
- Display user-friendly error messages
- Use toast notifications for feedback
- Log errors for debugging

### 6. **Performance**
- Lazy load heavy components
- Use `loading.tsx` for Suspense boundaries
- Optimize images with Next.js Image
- Implement pagination for large lists
- Use React.memo for expensive renders

### 7. **Accessibility**
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast compliance

### 8. **Security**
- Never expose sensitive data client-side
- Validate inputs server-side
- Use environment variables for secrets
- Implement CSRF protection
- Hash passwords with bcrypt
- Use prepared statements (Prisma handles this)

---

## 🎯 Key Learnings

### Server/Client Component Boundaries
**Problem**: Cannot pass functions/components from Server to Client Components.

**Solution**:
```typescript
// ❌ Wrong - Passing icon component from server to client
export async function ServerComponent() {
  const items = [{ icon: LucideIcon, label: 'Item' }];
  return <ClientNav items={items} />; // Error!
}

// ✅ Correct - Make parent component client-side
'use client';
export function ClientComponent() {
  const items = [{ icon: LucideIcon, label: 'Item' }];
  return <ClientNav items={items} />;
}
```

### Context Providers Must Always Provide
**Problem**: Early returns in providers cause "must be used within Provider" errors.

**Solution**:
```typescript
// ❌ Wrong
export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  
  if (!mounted) {
    return <>{children}</>; // Context not available!
  }
  
  return <ThemeContext.Provider>{children}</ThemeContext.Provider>;
}

// ✅ Correct
export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  
  return (
    <ThemeContext.Provider value={...}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### useSearchParams Requires Suspense
**Problem**: `useSearchParams()` causes build errors in Next.js 14.

**Solution**:
```typescript
// Wrap component using useSearchParams in Suspense
function SearchForm() {
  const searchParams = useSearchParams(); // Needs Suspense
  // ...
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchForm />
    </Suspense>
  );
}
```

### Prisma Client Singleton
**Problem**: Multiple Prisma instances in development.

**Solution**:
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

---

## 🚀 Quick Start Checklist

When starting a new project with this stack:

- [ ] Initialize Next.js with TypeScript
  ```bash
  npx create-next-app@latest --typescript --tailwind --app
  ```

- [ ] Install dependencies
  ```bash
  npm install prisma @prisma/client next-auth bcryptjs
  npm install -D @types/bcryptjs
  npm install sonner lucide-react class-variance-authority tailwind-merge clsx
  ```

- [ ] Setup Prisma
  ```bash
  npx prisma init
  # Edit schema.prisma
  npx prisma migrate dev --name init
  ```

- [ ] Copy design system files:
  - `globals.css` (CSS variables + animations)
  - `tailwind.config.ts` (theme extension)
  - `lib/utils.ts` (cn utility)

- [ ] Setup authentication:
  - Create `lib/auth.ts` (NextAuth config)
  - Create `app/api/auth/[...nextauth]/route.ts`
  - Create `middleware.ts` (route protection)

- [ ] Create base components:
  - `components/ui/` primitives
  - `components/layout/` structure
  - `components/Providers.tsx`

- [ ] Configure environment variables
  - Copy `.env.example` to `.env`
  - Fill in database URL and secrets

---

## 📝 Notes for AI Context

When using this document as context for a new project:

1. **Adapt, don't copy blindly** - Adjust patterns to fit the specific domain
2. **Maintain consistency** - Follow the same architectural decisions
3. **Preserve type safety** - Keep TypeScript strict
4. **Use the same component patterns** - Button, Card, Modal, etc.
5. **Follow the same file structure** - Easier to navigate and maintain
6. **Apply the same styling principles** - Design tokens, spacing, animations
7. **Implement similar auth patterns** - Role-based access, middleware
8. **Use the same database patterns** - Transactions, indexes, pagination

**Key files to reference:**
- Design system: `globals.css`, `tailwind.config.ts`
- Component patterns: `components/ui/*`
- Auth: `lib/auth.ts`, `middleware.ts`
- Database: `prisma/schema.prisma`, `lib/prisma.ts`
- Utils: `lib/utils.ts`, `hooks/useUserRole.ts`

---

**Last Updated**: February 23, 2026  
**Project**: Library Management System  
**Stack Version**: Next.js 14.2.0, React 18, Tailwind CSS 3.4, Prisma 5.22.0
