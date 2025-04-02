const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTopRentedCars() {
  try {
    const cars = await prisma.car.findMany({
      take: 5, // Traer los 5 más alquilados
      orderBy: {
        rentals: { _count: 'desc' } // Ordenar por cantidad de alquileres
      },
      include: {
        rentals: true, // Incluir detalles de alquileres
      }
    });
    return cars;
  } catch (error) {
    console.error('Error al obtener los autos más alquilados:', error);
    return [];
  }
}

module.exports = { getTopRentedCars };
