import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MediaType } from '@prisma/client';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const existingMedia = await prisma.mediaItem.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { title, creator, description, releaseDate, genre, type } = body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title must be a non-empty string' },
          { status: 400 }
        );
      }
    }

    if (creator !== undefined) {
      if (typeof creator !== 'string' || creator.trim().length === 0) {
        return NextResponse.json(
          { error: 'Creator must be a non-empty string' },
          { status: 400 }
        );
      }
    }

    if (type !== undefined && !Object.values(MediaType).includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${Object.values(MediaType).join(', ')}` },
        { status: 400 }
      );
    }

    if (description !== undefined && description !== null && typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string or null' },
        { status: 400 }
      );
    }

    if (genre !== undefined && genre !== null && typeof genre !== 'string') {
      return NextResponse.json(
        { error: 'Genre must be a string or null' },
        { status: 400 }
      );
    }

    let parsedReleaseDate: Date | null | undefined;
    if (releaseDate !== undefined) {
      if (releaseDate === null) {
        parsedReleaseDate = null;
      } else {
        parsedReleaseDate = new Date(releaseDate);
        if (isNaN(parsedReleaseDate.getTime())) {
          return NextResponse.json(
            { error: 'Invalid release date format' },
            { status: 400 }
          );
        }
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (creator !== undefined) updateData.creator = creator.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (releaseDate !== undefined) updateData.releaseDate = parsedReleaseDate;
    if (genre !== undefined) updateData.genre = genre?.trim() || null;
    if (type !== undefined) updateData.type = type;

    const updatedMedia = await prisma.mediaItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedMedia);
  } catch (error) {
    console.error('Error updating media item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const existingMedia = await prisma.mediaItem.findUnique({
      where: { id },
      include: {
        _count: {
          select: { collectionItems: true },
        },
      },
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      );
    }

    await prisma.mediaItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Media item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting media item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
