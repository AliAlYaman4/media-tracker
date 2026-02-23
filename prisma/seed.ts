import { PrismaClient, UserRole, MediaType, CollectionStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const demoPassword = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@mediatracker.com' },
    update: {},
    create: {
      email: 'demo@mediatracker.com',
      name: 'Demo User',
      username: 'demouser',
      bio: 'This is a demo account for testing the Media Tracker application',
      isPublic: true,
      role: UserRole.USER,
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  const mediaItems = [
    // Movies
    {
      title: 'The Matrix',
      creator: 'Wachowski Sisters',
      description: 'A computer hacker learns about the true nature of reality',
      releaseDate: new Date('1999-03-31'),
      genre: 'Sci-Fi',
      type: MediaType.MOVIE,
      image: 'https://picsum.photos/seed/matrix/400/600.jpg',
    },
    {
      title: 'Inception',
      creator: 'Christopher Nolan',
      description: 'A thief who steals corporate secrets through dream-sharing technology',
      releaseDate: new Date('2010-07-16'),
      genre: 'Sci-Fi',
      type: MediaType.MOVIE,
      image: 'https://picsum.photos/seed/inception/400/600.jpg',
    },
    {
      title: 'The Dark Knight',
      creator: 'Christopher Nolan',
      description: 'Batman faces the Joker in Gotham City',
      releaseDate: new Date('2008-07-18'),
      genre: 'Action',
      type: MediaType.MOVIE,
      image: 'https://picsum.photos/seed/darkknight/400/600.jpg',
    },
    {
      title: 'Dune: Part Two',
      creator: 'Denis Villeneuve',
      description: 'Paul Atreides unites with Chani and the Fremen',
      releaseDate: new Date('2024-03-01'),
      genre: 'Sci-Fi',
      type: MediaType.MOVIE,
      image: 'https://picsum.photos/seed/dune2/400/600.jpg',
    },
    {
      title: 'Oppenheimer',
      creator: 'Christopher Nolan',
      description: 'The story of J. Robert Oppenheimer and the atomic bomb',
      releaseDate: new Date('2023-07-21'),
      genre: 'Biography',
      type: MediaType.MOVIE,
      image: 'https://picsum.photos/seed/oppenheimer/400/600.jpg',
    },
    {
      title: 'Interstellar',
      creator: 'Christopher Nolan',
      description: 'A team of explorers travel through a wormhole in space',
      releaseDate: new Date('2014-11-07'),
      genre: 'Sci-Fi',
      type: MediaType.MOVIE,
      image: 'https://picsum.photos/seed/interstellar/400/600.jpg',
    },
    // Games
    {
      title: 'The Witcher 3',
      creator: 'CD Projekt Red',
      description: 'An open-world RPG following Geralt of Rivia',
      releaseDate: new Date('2015-05-19'),
      genre: 'RPG',
      type: MediaType.GAME,
      image: 'https://picsum.photos/seed/witcher3/400/400.jpg',
    },
    {
      title: 'Elden Ring',
      creator: 'FromSoftware',
      description: 'An action RPG set in the Lands Between',
      releaseDate: new Date('2022-02-25'),
      genre: 'Action RPG',
      type: MediaType.GAME,
      image: 'https://picsum.photos/seed/eldenring/400/400.jpg',
    },
    {
      title: 'Baldur\'s Gate 3',
      creator: 'Larian Studios',
      description: 'A story-rich RPG set in the Dungeons & Dragons universe',
      releaseDate: new Date('2023-08-03'),
      genre: 'RPG',
      type: MediaType.GAME,
      image: 'https://picsum.photos/seed/bg3/400/400.jpg',
    },
    {
      title: 'Cyberpunk 2077',
      creator: 'CD Projekt Red',
      description: 'An open-world action-adventure set in Night City',
      releaseDate: new Date('2020-12-10'),
      genre: 'Action RPG',
      type: MediaType.GAME,
      image: 'https://picsum.photos/seed/cyberpunk/400/400.jpg',
    },
    {
      title: 'Red Dead Redemption 2',
      creator: 'Rockstar Games',
      description: 'An epic tale of life in America\'s unforgiving heartland',
      releaseDate: new Date('2018-10-26'),
      genre: 'Action',
      type: MediaType.GAME,
      image: 'https://picsum.photos/seed/rdr2/400/400.jpg',
    },
    // Music
    {
      title: 'Random Access Memories',
      creator: 'Daft Punk',
      description: 'Fourth studio album by French electronic duo',
      releaseDate: new Date('2013-05-17'),
      genre: 'Electronic',
      type: MediaType.MUSIC,
      image: 'https://picsum.photos/seed/ram/400/400.jpg',
    },
    {
      title: 'Abbey Road',
      creator: 'The Beatles',
      description: 'Eleventh studio album by The Beatles',
      releaseDate: new Date('1969-09-26'),
      genre: 'Rock',
      type: MediaType.MUSIC,
      image: 'https://picsum.photos/seed/abbeyroad/400/400.jpg',
    },
    {
      title: 'The Dark Side of the Moon',
      creator: 'Pink Floyd',
      description: 'Eighth studio album by Pink Floyd',
      releaseDate: new Date('1973-03-01'),
      genre: 'Progressive Rock',
      type: MediaType.MUSIC,
      image: 'https://picsum.photos/seed/darkside/400/400.jpg',
    },
    {
      title: 'Thriller',
      creator: 'Michael Jackson',
      description: 'Sixth studio album by Michael Jackson',
      releaseDate: new Date('1982-11-30'),
      genre: 'Pop',
      type: MediaType.MUSIC,
      image: 'https://picsum.photos/seed/thriller/400/400.jpg',
    },
    {
      title: 'Cowboy Carter',
      creator: 'Beyoncé',
      description: 'Eighth studio album exploring country music',
      releaseDate: new Date('2024-03-29'),
      genre: 'Country',
      type: MediaType.MUSIC,
      image: 'https://picsum.photos/seed/cowboy/400/400.jpg',
    },
  ];

  for (const mediaData of mediaItems) {
    const existing = await prisma.mediaItem.findFirst({
      where: {
        title: mediaData.title,
        creator: mediaData.creator,
      },
    });

    if (!existing) {
      await prisma.mediaItem.create({
        data: mediaData,
      });
    }
  }

  console.log(`✅ Created ${mediaItems.length} media items`);

  const allMedia = await prisma.mediaItem.findMany();

  const collectionData = [
    // Completed items
    { mediaTitle: 'The Matrix', status: CollectionStatus.COMPLETED, rating: 10, notes: 'Mind-blowing classic!' },
    { mediaTitle: 'Inception', status: CollectionStatus.COMPLETED, rating: 9, notes: 'Amazing visuals and story' },
    { mediaTitle: 'The Witcher 3', status: CollectionStatus.COMPLETED, rating: 10, notes: 'Best RPG ever' },
    { mediaTitle: 'Interstellar', status: CollectionStatus.COMPLETED, rating: 9, notes: 'Emotional and beautiful' },
    { mediaTitle: 'The Dark Side of the Moon', status: CollectionStatus.COMPLETED, rating: 10, notes: 'Timeless masterpiece' },
    // Currently using/playing
    { mediaTitle: 'Elden Ring', status: CollectionStatus.USING, rating: 8, notes: 'Currently playing, very challenging' },
    { mediaTitle: 'Baldur\'s Gate 3', status: CollectionStatus.USING, rating: 9, notes: 'Amazing D&D experience' },
    // Owned items
    { mediaTitle: 'The Dark Knight', status: CollectionStatus.OWNED, rating: 9, notes: 'Best Batman movie' },
    { mediaTitle: 'Random Access Memories', status: CollectionStatus.OWNED, rating: 9, notes: 'Great album' },
    { mediaTitle: 'Cyberpunk 2077', status: CollectionStatus.OWNED, rating: 7, notes: 'Good after patches' },
    { mediaTitle: 'Red Dead Redemption 2', status: CollectionStatus.OWNED, rating: 10, notes: 'Masterpiece' },
    { mediaTitle: 'Thriller', status: CollectionStatus.OWNED, rating: 10, notes: 'Legendary album' },
    // Wishlist items
    { mediaTitle: 'Abbey Road', status: CollectionStatus.WISHLIST, rating: null, notes: 'Want to listen to this' },
    { mediaTitle: 'Dune: Part Two', status: CollectionStatus.WISHLIST, rating: null, notes: 'Must watch in IMAX' },
    { mediaTitle: 'Oppenheimer', status: CollectionStatus.WISHLIST, rating: null, notes: 'Heard great things' },
    { mediaTitle: 'Cowboy Carter', status: CollectionStatus.WISHLIST, rating: null, notes: 'Beyoncé\'s new direction' },
  ];

  for (const item of collectionData) {
    const media = allMedia.find((m) => m.title === item.mediaTitle);
    if (media) {
      await prisma.collectionItem.upsert({
        where: {
          userId_mediaId: {
            userId: demoUser.id,
            mediaId: media.id,
          },
        },
        update: {},
        create: {
          userId: demoUser.id,
          mediaId: media.id,
          status: item.status,
          rating: item.rating,
          notes: item.notes,
        },
      });
    }
  }

  console.log(`✅ Created ${collectionData.length} collection items for demo user`);

  const activities = [
    { type: 'ADDED_TO_COLLECTION', mediaTitle: 'The Matrix' },
    { type: 'COMPLETED_MEDIA', mediaTitle: 'The Matrix' },
    { type: 'RATED_MEDIA', mediaTitle: 'The Matrix' },
    { type: 'ADDED_TO_COLLECTION', mediaTitle: 'Inception' },
    { type: 'COMPLETED_MEDIA', mediaTitle: 'Inception' },
  ];

  for (const activity of activities) {
    const media = allMedia.find((m) => m.title === activity.mediaTitle);
    if (media) {
      await prisma.activity.create({
        data: {
          userId: demoUser.id,
          type: activity.type as any,
          mediaId: media.id,
          metadata: JSON.stringify({ title: media.title }),
        },
      });
    }
  }

  console.log(`✅ Created ${activities.length} activities for demo user`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📧 Demo User Credentials:');
  console.log('   Email: demo@mediatracker.com');
  console.log('   Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
