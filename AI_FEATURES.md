# 🤖 AI Features Documentation

This document outlines all AI-powered features in the MediaVault application and where to find them in the UI.

---

## 📍 AI Feature Locations

### 1. **AI Recommendations Page** ✨
**Location:** Dashboard → AI Recommendations (in sidebar navigation)  
**URL:** `/dashboard/recommendations`  
**Visual Indicator:** Sparkles icon (✨) in navigation menu

**What it does:**
- Analyzes your entire collection to understand your preferences
- Identifies your favorite genres, media types, and highly-rated items
- Suggests new media you might enjoy based on these patterns
- Shows personalized insights about your collection

**Key Features:**
- **Smart Algorithm:** Uses genre frequency, media type preferences, and ratings to score recommendations
- **Preference Dashboard:** Displays your top genres, preferred types, and average rating
- **Refresh Button:** Get new recommendations on demand
- **Visual Indicators:** Purple/pink gradient badges and icons mark AI-powered sections

**How to use:**
1. Navigate to "AI Recommendations" in the sidebar (look for the ✨ icon)
2. View personalized recommendations based on your collection
3. Click "Refresh" to get new suggestions
4. Click any recommended item to view details or add to collection

---

### 2. **AI Enrichment Toggle** ✨
**Location:** Add Media Modal (when adding new items)  
**Visual Indicator:** Purple/pink gradient toggle with Sparkles icon

**What it does:**
- Automatically generates concise summaries for media items
- Suggests relevant genre tags based on title, creator, and description
- Finds similar items already in your collection
- Provides instant AI-powered insights

**Key Features:**
- **Smart Summaries:** AI generates 2-3 sentence descriptions
- **Genre Suggestions:** Get 3-5 relevant genre tags automatically
- **Similar Media:** Discover related items in your collection
- **Fallback Mode:** Works even without OpenAI API key (uses smart defaults)

**How to use:**
1. Click "Add to Collection" button anywhere in the app
2. Look for the AI Enrichment section at the top of the modal (purple/pink gradient)
3. Toggle the switch ON to enable AI features
4. Fill in media details (title, creator, type)
5. AI will automatically enrich your entry when you save

**Visual Cues:**
- **OFF State:** Gray toggle, muted icon
- **ON State:** Purple/pink gradient toggle, glowing Sparkles icon, "ON" badge
- **Tooltip:** Hover for detailed explanation of AI features

---

### 3. **AI Insights Card** ✨
**Location:** Collection Detail Pages (when viewing individual items)  
**URL:** `/collection/[id]`  
**Visual Indicator:** Purple/pink gradient card with "AI-Powered" badge

**What it does:**
- Provides AI-generated analysis for each media item
- Shows intelligent summaries and genre suggestions
- Lists similar items from your collection
- Offers contextual recommendations

**Key Features:**
- **AI Summary:** Concise overview of the media
- **Suggested Genres:** AI-recommended genre tags
- **Similar Items:** Related media from your collection with similarity scores
- **Smart Context:** Analysis based on your entire collection

**How to use:**
1. Click any item in your collection to view details
2. Scroll down to find the "AI Insights" card (purple/pink gradient)
3. View AI-generated summary, genres, and similar items
4. Click similar items to explore related content

**Visual Cues:**
- Purple/pink gradient border and background
- Sparkles icon (✨) in card header
- "AI-Powered" badge in top-right corner
- Loading animation while AI analyzes

---

### 4. **AI Onboarding Tutorial** ✨
**Location:** Appears automatically on first visit  
**Visual Indicator:** Modal with gradient headers and Sparkles icons

**What it does:**
- Introduces users to AI features
- Explains how to use AI enrichment
- Highlights the AI recommendations feature
- Provides setup instructions

**Key Features:**
- **3-Step Tutorial:** Welcome → AI Enrichment → Recommendations
- **Visual Guide:** Gradient backgrounds and icons for each step
- **Progress Dots:** Track your position in the tutorial
- **Skip Option:** Dismiss anytime, won't show again

**How to trigger:**
- Automatically shows on first app visit
- Stored in localStorage (`ai-onboarding-completed`)
- Clear localStorage to see it again

---

## 🎨 Visual Design System

All AI features use consistent visual indicators:

### Colors
- **Primary Gradient:** Purple (#a855f7) to Pink (#ec4899)
- **Background:** Purple/pink gradient at 5-10% opacity
- **Borders:** Purple at 20-30% opacity
- **Text:** Purple-700 (light) / Purple-300 (dark)

### Icons
- **Primary Icon:** Sparkles (✨) from Lucide React
- **Secondary Icons:** Lightbulb, Tag, Link2, TrendingUp

### Badges
- **"AI-Powered" Badge:** Purple/pink gradient background
- **"ON" Badge:** Small purple pill when AI toggle is active

### Interactive Elements
- **Hover Effects:** Subtle scale and glow on AI cards
- **Loading States:** Purple spinner with "Analyzing with AI..." text
- **Transitions:** Smooth 200-300ms animations

---

## 🔧 Technical Implementation

### AI Service (`src/lib/ai-service.ts`)

**Functions:**
1. `isAIEnabled()` - Check if OpenAI API key is configured
2. `generateMediaSummary()` - Create AI summaries with fallback
3. `suggestGenreTags()` - Generate genre suggestions with fallback
4. `findSimilarMedia()` - Find related items in collection
5. `enrichMediaItem()` - Combine all AI features

**Fallback Behavior:**
- Works without OpenAI API key
- Provides sensible defaults based on media type
- Never fails silently - always returns useful data

### API Routes

**`/api/media/enrich` (POST)**
- Accepts: title, creator, type, description, genre
- Returns: summary, suggestedGenres, similarMedia
- Used by: AddMediaModal, AIInsightsCard

**`/api/recommendations` (GET)**
- Query params: limit (default: 10, max: 50)
- Returns: recommended media + preference insights
- Used by: AI Recommendations page

### Components

**`AIInsightsCard.tsx`**
- Displays AI analysis on detail pages
- Auto-loads on mount
- Shows loading state during analysis

**`AIOnboarding.tsx`**
- First-time user tutorial
- 3-step walkthrough
- localStorage persistence

**`AddMediaModal.tsx`**
- AI toggle in header section
- Real-time enrichment on save
- Toast notifications for results

---

## 🚀 Setup Instructions

### Required Environment Variables

```env
# Optional - AI features work without this but use fallbacks
OPENAI_API_KEY=sk-...
```

### With OpenAI API Key
1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env` file
3. Restart development server
4. AI features will use GPT-3.5-turbo for intelligent analysis

### Without OpenAI API Key
1. AI features work automatically with smart fallbacks
2. Summaries use template-based generation
3. Genres use type-based defaults
4. Similar media uses database queries only

---

## 📊 AI Feature Comparison

| Feature | With API Key | Without API Key |
|---------|-------------|-----------------|
| **Summaries** | GPT-3.5 generated | Template-based |
| **Genres** | AI-suggested | Type defaults |
| **Similar Media** | Database + AI scoring | Database only |
| **Recommendations** | Smart algorithm | Smart algorithm |
| **Speed** | 1-3 seconds | Instant |
| **Cost** | ~$0.001 per request | Free |

---

## 🎯 User Benefits

### For Casual Users
- **Automatic Organization:** AI suggests genres and tags
- **Discovery:** Find similar items you already own
- **Smart Summaries:** Quick overviews without manual entry

### For Power Users
- **Deep Insights:** Understand your collection patterns
- **Personalized Recommendations:** Discover new media based on preferences
- **Time Savings:** Bulk enrichment with AI toggle

### For Collectors
- **Pattern Recognition:** See your genre and type preferences
- **Collection Analysis:** AI-powered statistics and insights
- **Related Items:** Discover connections in your collection

---

## 🔍 Finding AI Features - Quick Reference

**Look for these visual indicators:**

1. **✨ Sparkles Icon** - Marks all AI-powered features
2. **Purple/Pink Gradients** - AI sections have distinctive colors
3. **"AI-Powered" Badges** - Clear labeling on AI components
4. **Gradient Toggles** - AI enrichment switches glow when active

**Navigation Shortcuts:**
- Sidebar → "AI Recommendations" (4th item)
- Add Media → Top section (AI Enrichment toggle)
- Item Details → Scroll down (AI Insights card)

---

## 💡 Tips & Best Practices

### Getting Better Recommendations
1. Add more items to your collection (10+ recommended)
2. Rate items you've completed (helps AI understand preferences)
3. Use consistent genre tags
4. Refresh recommendations periodically

### Using AI Enrichment Effectively
1. Enable AI toggle when adding new items
2. Provide descriptions for better summaries
3. Review suggested genres before saving
4. Check similar items for duplicates

### Troubleshooting
- **No recommendations?** Add more items to your collection
- **AI toggle not working?** Check browser console for API errors
- **Slow responses?** OpenAI API may be experiencing delays
- **Generic summaries?** Add more details (description, genre)

---

## 📝 Future Enhancements

Planned AI features:
- [ ] Smart duplicate detection
- [ ] Automatic cover image suggestions
- [ ] AI-powered search and filtering
- [ ] Collection insights dashboard
- [ ] Collaborative filtering recommendations
- [ ] Natural language queries ("Find sci-fi movies I'd like")

---

**Last Updated:** February 23, 2026  
**Version:** 1.0.0  
**AI Model:** GPT-3.5-turbo (when API key provided)
