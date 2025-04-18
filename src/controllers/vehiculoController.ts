import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const getTopRatedVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        rentals: {
          select: { rating: true },
        },
      },
    });

    const vehiclesWithRating = vehicles.map(vehicle => ({
      ...vehicle,
      averageRating: vehicle.rentals.reduce((acc, curr) => acc + curr.rating, 0) / vehicle.rentals.length || 0,
    }));

    res.json(vehiclesWithRating.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching vehicles' });
  }
};

export const getMostRentedVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        rentals: {
          _count: 'desc',
        },
      },
      take: 5,
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching vehicles' });
  }
};