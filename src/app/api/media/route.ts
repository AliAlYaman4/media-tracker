import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MediaType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, creator, description, releaseDate, genre, type } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!creator || typeof creator !== 'string' || creator.trim().length === 0) {
      return NextResponse.json(
        { error: 'Creator is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!type || !Object.values(MediaType).includes(type)) {
      return NextResponse.json(
        { error: `Type is required and must be one of: ${Object.values(MediaType).join(', ')}` },
        { status: 400 }
      );
    }

    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string' },
        { status: 400 }
      );
    }

    if (genre !== undefined && typeof genre !== 'string') {
      return NextResponse.json(
        { error: 'Genre must be a string' },
        { status: 400 }
      );
    }

    let parsedReleaseDate: Date | undefined;
    if (releaseDate) {
      parsedReleaseDate = new Date(releaseDate);
      if (isNaN(parsedReleaseDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid release date format' },
          { status: 400 }
        );
      }
    }

    const mediaItem = await prisma.mediaItem.create({
      data: {
        title: title.trim(),
        creator: creator.trim(),
        description: description?.trim() || null,
        releaseDate: parsedReleaseDate,
        genre: genre?.trim() || null,
        type,
      },
    });

    return NextResponse.json(mediaItem, { status: 201 });
  } catch (error) {
    console.error('Error creating media item:', error);
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

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
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

    const where: any = {};

    if (type && Object.values(MediaType).includes(type as MediaType)) {
      where.type = type;
    }

    if (genre) {
      where.genre = {
        contains: genre,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          creator: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

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
      },
    });
  } catch (error) {
    console.error('Error fetching media items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
