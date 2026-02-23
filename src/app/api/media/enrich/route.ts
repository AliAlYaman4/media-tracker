import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { enrichMediaItem } from '@/lib/ai-service';
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
    const { title, creator, type, description, genre } = body;

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

    const enrichment = await enrichMediaItem(
      title,
      creator,
      type,
      description,
      genre
    );

    return NextResponse.json(enrichment);
  } catch (error) {
    console.error('Error enriching media item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
