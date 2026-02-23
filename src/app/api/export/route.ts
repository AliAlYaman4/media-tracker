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

    const userId = session.user.id;

    const collectionItems = await prisma.collectionItem.findMany({
      where: { userId },
      include: {
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const csvHeaders = [
      'Title',
      'Creator',
      'Type',
      'Genre',
      'Release Date',
      'Status',
      'Rating',
      'Notes',
      'Added Date',
    ];

    const csvRows = collectionItems.map((item) => [
      `"${item.media.title.replace(/"/g, '""')}"`,
      `"${item.media.creator.replace(/"/g, '""')}"`,
      item.media.type,
      item.media.genre ? `"${item.media.genre.replace(/"/g, '""')}"` : '',
      item.media.releaseDate
        ? new Date(item.media.releaseDate).toISOString().split('T')[0]
        : '',
      item.status,
      item.rating || '',
      item.notes ? `"${item.notes.replace(/"/g, '""')}"` : '',
      new Date(item.createdAt).toISOString().split('T')[0],
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="media-collection-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
