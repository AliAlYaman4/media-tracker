import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MediaType, CollectionStatus } from '@prisma/client';

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

    const collectionItems = await prisma.collectionItem.findMany({
      where: { userId },
      include: {
        media: true,
      },
    });

    const totalItems = collectionItems.length;

    const byStatus = Object.values(CollectionStatus).reduce((acc, status) => {
      acc[status] = collectionItems.filter((item) => item.status === status).length;
      return acc;
    }, {} as Record<CollectionStatus, number>);

    const byType = Object.values(MediaType).reduce((acc, type) => {
      acc[type] = collectionItems.filter((item) => item.media.type === type).length;
      return acc;
    }, {} as Record<MediaType, number>);

    const genreCount: Record<string, number> = {};
    collectionItems.forEach((item) => {
      if (item.media.genre) {
        genreCount[item.media.genre] = (genreCount[item.media.genre] || 0) + 1;
      }
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));

    const ratedItems = collectionItems.filter((item) => item.rating !== null);
    const averageRating = ratedItems.length > 0
      ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) / ratedItems.length
      : 0;

    const ratingDistribution = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => ({
      rating,
      count: collectionItems.filter((item) => item.rating === rating).length,
    }));

    const completedItems = collectionItems.filter(
      (item) => item.status === CollectionStatus.COMPLETED
    );

    const monthlyActivity: Record<string, number> = {};
    collectionItems.forEach((item) => {
      const month = new Date(item.createdAt).toISOString().slice(0, 7);
      monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
    });

    const monthlyData = Object.entries(monthlyActivity)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([month, count]) => ({ month, count }));

    return NextResponse.json({
      summary: {
        totalItems,
        ratedItems: ratedItems.length,
        averageRating: parseFloat(averageRating.toFixed(2)),
        completedItems: completedItems.length,
      },
      byStatus,
      byType,
      topGenres,
      ratingDistribution,
      monthlyActivity: monthlyData,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
