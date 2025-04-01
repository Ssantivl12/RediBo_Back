const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear usuarios de prueba
  const user1 = await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Maria López',
      email: 'maria@example.com',
    },
  });

  // Crear vehículos de prueba
  const vehicle1 = await prisma.vehicle.create({
    data: {
      model: 'Corolla',
      brand: 'Toyota',
      pricePerDay: 50.0,
      availability: true,
      imageUrl: 'https://example.com/toyota-corolla.jpg',
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      model: 'Civic',
      brand: 'Honda',
      pricePerDay: 55.0,
      availability: true,
      imageUrl: 'https://example.com/honda-civic.jpg',
    },
  });

  // Crear alquileres de prueba
  await prisma.rental.create({
    data: {
      userId: user1.id,
      vehicleId: vehicle1.id,
      rating: 4.5,
    },
  });

  await prisma.rental.create({
    data: {
      userId: user2.id,
      vehicleId: vehicle2.id,
      rating: 4.8,
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
