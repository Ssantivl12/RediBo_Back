const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear usuarios de prueba
  const user1 = await prisma.user.create({
    data: {
      name: 'liz Pérezi',
      email: 'jlizl@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'lizas Rodriguez',
      email: 'asda@example.com',
    },
  });

  // Crear vehículos de prueba
  const vehicle1 = await prisma.vehicle.create({
    data: {
      model: 'sdfad',
      brand: 'asdf',
      pricePerDay: 50.0,
      availability: true,
      imageUrl: 'https://example.com/adf-toy.jpg',
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      model: 'asdfg',
      brand: 'asdfg',
      pricePerDay: 55.0,
      availability: true,
      imageUrl: 'https://example.com/asdf-ci.jpg',
    },
  });

  // Crear alquileres de prueba
  await prisma.rental.create({
    data: {
      userId: user1.id,
      vehicleId: vehicle1.id,
      rating: 2.5,
    },
  });

  await prisma.rental.create({
    data: {
      userId: user2.id,
      vehicleId: vehicle2.id,
      rating: 2.8,
    },
  });

  console.log('🚀 Datos de prueba insertados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
