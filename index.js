const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Ruta para obtener todos los vehículos
app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving vehicles' });
  }
});

// Ruta para obtener los 5 vehículos con mejor promedio de rating
app.get('/vehicles/top', async (req, res) => {
  try {
    const topVehicles = await prisma.vehicle.findMany({
      include: {
        rentals: true,
      },
    });

    const vehiclesWithAverage = topVehicles
      .map(vehicle => {
        const ratings = vehicle.rentals.map(r => r.rating);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;
        return {
          ...vehicle,
          averageRating: avgRating,
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    res.json(vehiclesWithAverage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving top vehicles' });
  }
});

// Ruta para crear un nuevo vehículo
app.post('/vehicles', async (req, res) => {
  const { model, brand, pricePerDay, availability, imageUrl } = req.body;

  try {
    const newVehicle = await prisma.vehicle.create({
      data: {
        model,
        brand,
        pricePerDay: parseFloat(pricePerDay),
        availability,
        imageUrl,
      },
    });
    res.json(newVehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating vehicle' });
  }
});

// Ruta para crear una nueva renta (rental)
app.post('/rentals', async (req, res) => {
  const { userId, vehicleId, rating } = req.body;

  try {
    const rental = await prisma.rental.create({
      data: {
        userId: parseInt(userId),
        vehicleId: parseInt(vehicleId),
        rating: parseFloat(rating),
      },
    });

    res.json(rental);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating rental' });
  }
});

app.listen(3000, () => {
  console.log('🚗 Server running on http://localhost:3000');
});
