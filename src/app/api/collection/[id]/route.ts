import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CollectionStatus } from '@prisma/client';

export async function GET(
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

    const userId = session.user.id;
    const { id } = params;

    const collectionItem = await prisma.collectionItem.findUnique({
      where: { id },
      include: {
        media: true,
      },
    });

    if (!collectionItem) {
      return NextResponse.json(
        { error: 'Collection item not found' },
        { status: 404 }
      );
    }

    if (collectionItem.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own collection items' },
        { status: 403 }
      );
    }

    return NextResponse.json(collectionItem);
  } catch (error) {
    console.error('Error fetching collection item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const userId = session.user.id;
    const { id } = params;

    const existingItem = await prisma.collectionItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Collection item not found' },
        { status: 404 }
      );
    }

    if (existingItem.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own collection items' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status, rating, notes } = body;

    if (status !== undefined && !Object.values(CollectionStatus).includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${Object.values(CollectionStatus).join(', ')}` },
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

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes?.trim() || null;

    const updatedItem = await prisma.collectionItem.update({
      where: { id },
      data: updateData,
      include: {
        media: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating collection item:', error);
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

    const userId = session.user.id;
    const { id } = params;

    const existingItem = await prisma.collectionItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Collection item not found' },
        { status: 404 }
      );
    }

    if (existingItem.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own collection items' },
        { status: 403 }
      );
    }

    await prisma.collectionItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Collection item removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting collection item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
