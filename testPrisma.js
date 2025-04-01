const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Usuarios:", users);

  const vehicles = await prisma.vehicle.findMany();
  console.log("Vehículos:", vehicles);

  const rentals = await prisma.rental.findMany();
  console.log("Alquileres:", rentals);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
