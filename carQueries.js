const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTopRentedVehicles() {
  try {
    const topVehicles = await prisma.vehicle.findMany({
      orderBy: {
        rentals: {
          _count: 'desc'
        }
      },
      take: 5,
    });
    return topVehicles;
  } catch (error) {
    console.error('Error al obtener los vehículos más alquilados:', error);
    return [];
  }
}

// Exporta la función
module.exports = { getTopRentedVehicles };
