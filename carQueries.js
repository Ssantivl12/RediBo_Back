const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTopRentedCars() {
    try {
        const topCars = await prisma.car.findMany({
            where: {
                rentals: {
                    some: {} // Verifica que tenga alquileres
                },
                available: true // Solo autos disponibles
            },
            include: {
                rentals: true, // Trae los datos de los alquileres
                reviews: true  // Trae las puntuaciones
            },
            orderBy: [
                {
                    rentals: { _count: 'desc' } // Ordena por más alquilados
                },
                {
                    reviews: { _avg: { rating: 'desc' } } // Prioriza mejor puntuados
                }
            ],
            take: 5 // Solo los 5 primeros
        });

        return topCars;
    } catch (error) {
        console.error("Error obteniendo los modelos más alquilados:", error);
        return [];
    }
}

module.exports = { getTopRentedCars };
