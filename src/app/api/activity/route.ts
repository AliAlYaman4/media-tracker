import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const following = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(session.user.id);

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: {
          userId: {
            in: followingIds,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.activity.count({
        where: {
          userId: {
            in: followingIds,
          },
        },
      }),
    ]);

    const activitiesWithMedia = await Promise.all(
      activities.map(async (activity) => {
        if (activity.mediaId) {
          const media = await prisma.mediaItem.findUnique({
            where: { id: activity.mediaId },
            select: {
              id: true,
              title: true,
              creator: true,
              type: true,
            },
          });
          return { ...activity, media };
        }
        return activity;
      })
    );

    return NextResponse.json({
      data: activitiesWithMedia,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
