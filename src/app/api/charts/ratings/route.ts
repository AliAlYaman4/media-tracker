import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MediaType } from '@prisma/client';

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
    const type = searchParams.get('type') as MediaType | null;

    const where: any = {
      userId,
      rating: {
        not: null,
      },
    };

    if (type && Object.values(MediaType).includes(type)) {
      where.media = {
        type,
      };
    }

    const collectionItems = await prisma.collectionItem.findMany({
      where,
      include: {
        media: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    const ratingDistribution = Array.from({ length: 10 }, (_, i) => {
      const rating = i + 1;
      return {
        rating,
        count: collectionItems.filter((item) => item.rating === rating).length,
      };
    });

    const topRated = collectionItems
      .slice(0, 10)
      .map((item) => ({
        id: item.id,
        title: item.media.title,
        creator: item.media.creator,
        type: item.media.type,
        rating: item.rating,
        genre: item.media.genre,
      }));

    const averageByType = Object.values(MediaType).map((mediaType) => {
      const items = collectionItems.filter(
        (item) => item.media.type === mediaType && item.rating !== null
      );
      const average = items.length > 0
        ? items.reduce((sum, item) => sum + (item.rating || 0), 0) / items.length
        : 0;
      return {
        type: mediaType,
        average: parseFloat(average.toFixed(2)),
        count: items.length,
      };
    });

    const averageByGenre: Record<string, { total: number; count: number }> = {};
    collectionItems.forEach((item) => {
      if (item.media.genre && item.rating) {
        if (!averageByGenre[item.media.genre]) {
          averageByGenre[item.media.genre] = { total: 0, count: 0 };
        }
        averageByGenre[item.media.genre].total += item.rating;
        averageByGenre[item.media.genre].count += 1;
      }
    });

    const genreAverages = Object.entries(averageByGenre)
      .map(([genre, data]) => ({
        genre,
        average: parseFloat((data.total / data.count).toFixed(2)),
        count: data.count,
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 10);

    return NextResponse.json({
      ratingDistribution,
      topRated,
      averageByType,
      averageByGenre: genreAverages,
      totalRated: collectionItems.length,
    });
  } catch (error) {
    console.error('Error fetching rating charts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
