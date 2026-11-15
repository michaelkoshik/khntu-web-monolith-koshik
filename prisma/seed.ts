import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding for EventTicketing...');

  const user = await prisma.user.upsert({
    where: { email: 'm.koshyk@khntu.edu.ua' },
    update: {},
    create: {
      email: 'm.koshyk@khntu.edu.ua',
      password: 'hashed_placeholder_password',
      fullName: 'ошик ихайло Сергійович',
      role: 'ADMIN'
    }
  });

  const venue = await prisma.venue.create({
    data: {
      name: 'алац культури «країна»',
      city: 'иїв',
      address: 'вул. елика асильківська, 103',
      capacity: 3714
    }
  });

  const event1 = await prisma.event.create({
    data: {
      venueId: venue.id,
      title: 'Симфонічний рок-концерт «кеан звуку»',
      eventDate: new Date('2026-12-10T19:00:00Z'),
      basePrice: 850,
      availableTickets: 420
    }
  });

  const event2 = await prisma.event.create({
    data: {
      venueId: venue.id,
      title: 'TechConf Ukraine: Modern Web & Cloud 2026',
      eventDate: new Date('2026-12-20T10:00:00Z'),
      basePrice: 1200,
      availableTickets: 95
    }
  });

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      status: 'PAID',
      totalAmount: 2900,
      tickets: {
        create: [
          {
            eventId: event1.id,
            quantity: 2,
            priceAtPurchase: 850,
            seatZone: 'VIP'
          },
          {
            eventId: event2.id,
            quantity: 1,
            priceAtPurchase: 1200,
            seatZone: 'STANDARD'
          }
        ]
      }
    }
  });

  console.log('Seeding completed! Created booking ID:', booking.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });