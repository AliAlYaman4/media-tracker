import OpenAI from 'openai';
import { prisma } from './prisma';
import { MediaType } from '@prisma/client';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const AI_ENABLED = !!process.env.OPENAI_API_KEY;

export function isAIEnabled(): boolean {
  return AI_ENABLED;
}

export interface MediaEnrichmentResult {
  summary: string | null;
  suggestedGenres: string[];
  similarMedia: Array<{
    id: string;
    title: string;
    creator: string;
    type: MediaType;
    similarity: string;
  }>;
}

export async function generateMediaSummary(
  title: string,
  creator: string,
  type: MediaType,
  description?: string
): Promise<string | null> {
  try {
    if (!openai) {
      console.warn('OpenAI API key not configured, using fallback summary');
      return `${title} by ${creator} - A ${type.toLowerCase()} that showcases unique creativity and storytelling.`;
    }

    const prompt = `Generate a concise 2-3 sentence summary for this ${type.toLowerCase()}:
Title: ${title}
Creator: ${creator}
${description ? `Description: ${description}` : ''}

Provide only the summary, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates brief, informative summaries of media content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content?.trim();
    return result || `${title} by ${creator} - A ${type.toLowerCase()} worth experiencing.`;
  } catch (error) {
    console.error('Error generating summary:', error);
    return `${title} by ${creator} - A ${type.toLowerCase()} worth experiencing.`;
  }
}

export async function suggestGenreTags(
  title: string,
  creator: string,
  type: MediaType,
  description?: string
): Promise<string[]> {
  try {
    if (!openai) {
      console.warn('OpenAI API key not configured, using fallback genres');
      const fallbackGenres: Record<MediaType, string[]> = {
        MOVIE: ['Drama', 'Action', 'Thriller'],
        MUSIC: ['Pop', 'Alternative', 'Indie'],
        GAME: ['Adventure', 'Action', 'RPG'],
      };
      return fallbackGenres[type] || [];
    }

    const prompt = `Suggest 3-5 genre tags for this ${type.toLowerCase()}:
Title: ${title}
Creator: ${creator}
${description ? `Description: ${description}` : ''}

Return only genre names separated by commas (e.g., "Action, Sci-Fi, Thriller").`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a media classification expert. Provide accurate genre tags.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 50,
      temperature: 0.5,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    if (!response) {
      const fallbackGenres: Record<MediaType, string[]> = {
        MOVIE: ['Drama', 'Action'],
        MUSIC: ['Pop', 'Alternative'],
        GAME: ['Adventure', 'Action'],
      };
      return fallbackGenres[type] || [];
    }

    return response
      .split(',')
      .map((genre) => genre.trim())
      .filter((genre) => genre.length > 0)
      .slice(0, 5);
  } catch (error) {
    console.error('Error suggesting genres:', error);
    const fallbackGenres: Record<MediaType, string[]> = {
      MOVIE: ['Drama'],
      MUSIC: ['Pop'],
      GAME: ['Adventure'],
    };
    return fallbackGenres[type] || [];
  }
}

export async function findSimilarMedia(
  title: string,
  creator: string,
  type: MediaType,
  genre?: string,
  limit: number = 5
): Promise<MediaEnrichmentResult['similarMedia']> {
  try {
    const where: any = {
      type,
      NOT: {
        title,
      },
    };

    if (genre) {
      where.genre = {
        contains: genre,
        mode: 'insensitive',
      };
    }

    const similarByGenre = await prisma.mediaItem.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (similarByGenre.length >= limit) {
      return similarByGenre.map((media) => ({
        id: media.id,
        title: media.title,
        creator: media.creator,
        type: media.type,
        similarity: 'Same genre and type',
      }));
    }

    const similarByType = await prisma.mediaItem.findMany({
      where: {
        type,
        NOT: {
          OR: [
            { title },
            { id: { in: similarByGenre.map((m) => m.id) } },
          ],
        },
      },
      take: limit - similarByGenre.length,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const combined = [
      ...similarByGenre.map((media) => ({
        id: media.id,
        title: media.title,
        creator: media.creator,
        type: media.type,
        similarity: 'Same genre and type',
      })),
      ...similarByType.map((media) => ({
        id: media.id,
        title: media.title,
        creator: media.creator,
        type: media.type,
        similarity: 'Same type',
      })),
    ];

    return combined;
  } catch (error) {
    console.error('Error finding similar media:', error);
    return [];
  }
}

export async function enrichMediaItem(
  title: string,
  creator: string,
  type: MediaType,
  description?: string,
  genre?: string
): Promise<MediaEnrichmentResult> {
  const [summary, suggestedGenres, similarMedia] = await Promise.all([
    generateMediaSummary(title, creator, type, description),
    suggestGenreTags(title, creator, type, description),
    findSimilarMedia(title, creator, type, genre),
  ]);

  return {
    summary,
    suggestedGenres,
    similarMedia,
  };
}
