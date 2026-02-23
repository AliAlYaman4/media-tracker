import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MediaType, CollectionStatus } from '@prisma/client';

interface MediaScore {
  mediaId: string;
  score: number;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    const userCollection = await prisma.collectionItem.findMany({
      where: { userId },
      include: {
        media: true,
      },
    });

    if (userCollection.length === 0) {
      return NextResponse.json({
        data: [],
        meta: {
          message: 'Add items to your collection to get personalized recommendations',
          total: 0,
        },
      });
    }

    const ownedMediaIds = userCollection.map((item) => item.mediaId);

    const genreFrequency = new Map<string, number>();
    const typeFrequency = new Map<MediaType, number>();
    let totalRatings = 0;
    let ratingCount = 0;

    userCollection.forEach((item) => {
      if (item.media.genre) {
        genreFrequency.set(
          item.media.genre,
          (genreFrequency.get(item.media.genre) || 0) + 1
        );
      }

      typeFrequency.set(
        item.media.type,
        (typeFrequency.get(item.media.type) || 0) + 1
      );

      if (item.rating) {
        totalRatings += item.rating;
        ratingCount++;
      }

      if (item.status === CollectionStatus.COMPLETED && item.rating && item.rating >= 8) {
        if (item.media.genre) {
          genreFrequency.set(
            item.media.genre,
            (genreFrequency.get(item.media.genre) || 0) + 2
          );
        }
        typeFrequency.set(
          item.media.type,
          (typeFrequency.get(item.media.type) || 0) + 2
        );
      }
    });

    const topGenres = Array.from(genreFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    const topTypes = Array.from(typeFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([type]) => type);

    const candidateMedia = await prisma.mediaItem.findMany({
      where: {
        id: {
          notIn: ownedMediaIds,
        },
        OR: [
          {
            genre: {
              in: topGenres,
            },
          },
          {
            type: {
              in: topTypes,
            },
          },
        ],
      },
      take: limit * 3,
    });

    const scoredMedia: MediaScore[] = candidateMedia.map((media) => {
      let score = 0;

      if (media.genre && topGenres.includes(media.genre)) {
        const genreRank = topGenres.indexOf(media.genre);
        score += (3 - genreRank) * 10;
      }

      if (topTypes.includes(media.type)) {
        const typeRank = topTypes.indexOf(media.type);
        score += (2 - typeRank) * 5;
      }

      const genreMatchCount = userCollection.filter(
        (item) => item.media.genre === media.genre
      ).length;
      score += genreMatchCount * 2;

      const typeMatchCount = userCollection.filter(
        (item) => item.media.type === media.type
      ).length;
      score += typeMatchCount;

      return {
        mediaId: media.id,
        score,
      };
    });

    scoredMedia.sort((a, b) => b.score - a.score);

    const topRecommendationIds = scoredMedia
      .slice(0, limit)
      .map((item) => item.mediaId);

    const recommendations = await prisma.mediaItem.findMany({
      where: {
        id: {
          in: topRecommendationIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const orderedRecommendations = topRecommendationIds
      .map((id) => recommendations.find((media) => media.id === id))
      .filter((media) => media !== undefined);

    return NextResponse.json({
      data: orderedRecommendations,
      meta: {
        total: orderedRecommendations.length,
        basedOn: {
          collectionSize: userCollection.length,
          topGenres,
          topTypes,
          averageRating: ratingCount > 0 ? (totalRatings / ratingCount).toFixed(1) : null,
        },
      },
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
