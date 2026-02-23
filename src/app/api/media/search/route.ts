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
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query (q) is required' },
        { status: 400 }
      );
    }

    if (page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const searchTerm = query.trim();

    const where = {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          creator: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          genre: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
      ],
    };

    const [mediaItems, total] = await Promise.all([
      prisma.mediaItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.mediaItem.count({ where }),
    ]);

    return NextResponse.json({
      data: mediaItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query: searchTerm,
      },
    });
  } catch (error) {
    console.error('Error searching media items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
