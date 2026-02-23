import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        isPublic: true,
        createdAt: true,
        _count: {
          select: {
            collectionItems: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isPublic) {
      return NextResponse.json(
        { error: 'This profile is private' },
        { status: 403 }
      );
    }

    const collectionItems = await prisma.collectionItem.findMany({
      where: { userId: user.id },
      include: {
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json({
      user,
      collection: collectionItems,
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
