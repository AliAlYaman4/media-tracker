import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CollectionStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const { mediaId, status, rating, notes } = body;

    if (!mediaId || typeof mediaId !== 'string') {
      return NextResponse.json(
        { error: 'Media ID is required and must be a string' },
        { status: 400 }
      );
    }

    if (!status || !Object.values(CollectionStatus).includes(status)) {
      return NextResponse.json(
        { error: `Status is required and must be one of: ${Object.values(CollectionStatus).join(', ')}` },
        { status: 400 }
      );
    }

    if (rating !== undefined && rating !== null) {
      if (typeof rating !== 'number' || !Number.isInteger(rating)) {
        return NextResponse.json(
          { error: 'Rating must be an integer' },
          { status: 400 }
        );
      }
      if (rating < 1 || rating > 10) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 10' },
          { status: 400 }
        );
      }
    }

    if (notes !== undefined && notes !== null && typeof notes !== 'string') {
      return NextResponse.json(
        { error: 'Notes must be a string or null' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const mediaItem = await tx.mediaItem.findUnique({
        where: { id: mediaId },
      });

      if (!mediaItem) {
        throw new Error('MEDIA_NOT_FOUND');
      }

      const existingItem = await tx.collectionItem.findUnique({
        where: {
          userId_mediaId: {
            userId,
            mediaId,
          },
        },
      });

      if (existingItem) {
        throw new Error('ALREADY_IN_COLLECTION');
      }

      const collectionItem = await tx.collectionItem.create({
        data: {
          userId,
          mediaId,
          status,
          rating: rating || null,
          notes: notes?.trim() || null,
        },
        include: {
          media: true,
        },
      });

      return collectionItem;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error adding to collection:', error);

    if (error.message === 'MEDIA_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      );
    }

    if (error.message === 'ALREADY_IN_COLLECTION') {
      return NextResponse.json(
        { error: 'Media item already in your collection' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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
    const status = searchParams.get('status');
    const mediaType = searchParams.get('mediaType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

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

    const where: any = { userId };

    if (status && Object.values(CollectionStatus).includes(status as CollectionStatus)) {
      where.status = status;
    }

    if (mediaType) {
      where.media = {
        type: mediaType,
      };
    }

    const [collectionItems, total] = await Promise.all([
      prisma.collectionItem.findMany({
        where,
        skip,
        take: limit,
        include: {
          media: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.collectionItem.count({ where }),
    ]);

    return NextResponse.json({
      data: collectionItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
