# 🎬 MediaVault - Personal Media Collection Tracker

> A modern, AI-powered application to track and manage your movies, music, games, and more.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://media-tracker-ashen.vercel.app/dashboard)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

## 🚀 Live Demo

**[https://media-tracker-ashen.vercel.app/dashboard](https://media-tracker-ashen.vercel.app/dashboard)**

---

## ✨ Features

### Core Functionality
- 📚 **Multi-Media Support** - Track movies, music, games, books, and TV shows
- 🏷️ **Smart Organization** - Organize by status (Owned, Wishlist, Completed, Using)
- ⭐ **Rating System** - Rate items 1-10 and track your favorites
- 📝 **Personal Notes** - Add custom notes and descriptions
- 🔍 **Advanced Search** - Filter by type, genre, status, and more
- 📊 **Analytics Dashboard** - View collection statistics and insights

### AI-Powered Features ✨
- 🤖 **AI Recommendations** - Personalized suggestions based on your collection
- 💡 **Smart Enrichment** - Auto-generate summaries and genre tags
- 🔗 **Similar Items** - Discover related content in your collection
- 📈 **Preference Analysis** - Understand your viewing/listening patterns
- 🎯 **Intelligent Insights** - AI-powered analysis for each item

### User Experience
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode
- ⚡ **Fast & Smooth** - Optimized performance with Next.js 14
- 📱 **Mobile Friendly** - Works seamlessly on all devices
- 🔐 **Secure Authentication** - NextAuth with Google OAuth support
- 🎭 **Rich Metadata** - Cover images, release dates, creators, and more

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Production database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication
- **[OpenAI API](https://openai.com/)** - AI-powered features (optional)

### Deployment
- **[Vercel](https://vercel.com/)** - Hosting and deployment
- **[Vercel Postgres](https://vercel.com/storage/postgres)** - Database hosting

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or use Vercel Postgres)

### 1. Clone the repository
```bash
git clone https://github.com/AliAlYaman4/media-tracker.git
cd media-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/media_tracker"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI API (optional - for AI features)
OPENAI_API_KEY="sk-your-openai-api-key"
```

### 4. Set up the database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run seed
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 AI Features

MediaVault includes powerful AI features that work with or without an OpenAI API key:

### With OpenAI API Key
- GPT-3.5 powered summaries and descriptions
- Intelligent genre suggestions
- Advanced content analysis
- Smart recommendations

### Without OpenAI API Key
- Template-based summaries
- Type-based genre defaults
- Database-driven recommendations
- All core features still work!

**See [AI_FEATURES.md](./AI_FEATURES.md) for detailed documentation.**

---

## 📁 Project Structure

```
media-tracker/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Seed data
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── collection/      # Collection pages
│   │   ├── dashboard/       # Dashboard & recommendations
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── ui/             # UI primitives
│   │   ├── layout/         # Layout components
│   │   └── *.tsx           # Feature components
│   ├── contexts/           # React Context providers
│   ├── lib/                # Utilities & services
│   │   ├── ai-service.ts  # AI features
│   │   ├── auth.ts        # NextAuth config
│   │   └── prisma.ts      # Prisma client
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── AI_FEATURES.md         # AI features documentation
├── CONTEXT_README.md      # Architecture guide
└── package.json
```

---

## 🎨 Key Features Walkthrough

### 1. Dashboard
- Overview of your collection statistics
- Quick access to recent items
- Status breakdown (Owned, Wishlist, Completed)

### 2. Collection Management
- Add new media with detailed information
- Edit and update existing items
- Delete items from your collection
- Bulk operations and filtering

### 3. AI Recommendations
**Location:** Sidebar → "AI Recommendations" (✨ icon)
- Personalized suggestions based on your collection
- Preference insights (top genres, types, ratings)
- Refresh for new recommendations

### 4. AI Enrichment
**Location:** Add Media Modal → AI Toggle
- Auto-generate summaries
- Suggest relevant genres
- Find similar items

### 5. Item Details
- Rich metadata display
- AI-powered insights card
- Related items suggestions
- Personal notes and ratings

---

## 🔐 Authentication

MediaVault supports multiple authentication methods:

1. **Email/Password** - Traditional credentials
2. **Google OAuth** - Sign in with Google (requires setup)

Configure authentication in `src/lib/auth.ts`.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Set up Database**
   - Use Vercel Postgres or external PostgreSQL
   - Add `DATABASE_URL` to environment variables
   - Migrations run automatically via `postinstall` script

### Environment Variables for Production
Make sure to add all required environment variables in Vercel:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` (optional)
- `GOOGLE_CLIENT_SECRET` (optional)
- `OPENAI_API_KEY` (optional)

---

## 📊 Database Schema

Key models:
- **User** - User accounts and authentication
- **MediaItem** - Movies, music, games, etc.
- **CollectionItem** - User's collection entries
- **Activity** - User activity tracking

See `prisma/schema.prisma` for complete schema.

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Social features (share collections, follow users)
- [ ] Import from external sources (IMDb, Spotify, etc.)
- [ ] Advanced analytics and charts
- [ ] Collaborative collections
- [ ] API for third-party integrations
- [ ] Browser extension for quick adds

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Ali Yaman**
- GitHub: [@AliAlYaman4](https://github.com/AliAlYaman4)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Prisma](https://www.prisma.io/) - Database ORM
- [Radix UI](https://www.radix-ui.com/) - Component primitives
- [OpenAI](https://openai.com/) - AI capabilities
- [Lucide](https://lucide.dev/) - Icon library

---

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and AI**