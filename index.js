require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Ruta GET para obtener los 5 vehículos mejor puntuados según rating promedio
app.get('/vehiculos', async (req, res) => {
  try {
    const vehiculos = await prisma.vehicle.findMany({
      include: {
        rentals: {
          select: { rating: true },
        },
      },
    });

    // Calcular el promedio de rating para cada vehículo
    const vehiculosConPromedio = vehiculos.map(vehiculo => {
      const ratings = vehiculo.rentals.map(r => r.rating);
      const promedio = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        ...vehiculo,
        promedioRating: promedio,
      };
    });

    // Ordenar por promedioRating descendente y tomar los top 5
    const topVehiculos = vehiculosConPromedio
      .sort((a, b) => b.promedioRating - a.promedioRating)
      .slice(0, 5);

    res.json(topVehiculos);
  } catch (error) {
    console.error('Error en /vehiculos:', error);
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
});

// Ruta POST para agregar vehículos manualmente (para pruebas)
app.post('/vehiculos', async (req, res) => {
  try {
    const nuevoVehiculo = await prisma.vehicle.create({
      data: {
        model: req.body.model,
        brand: req.body.brand,
        pricePerDay: req.body.pricePerDay,
        availability: true,
        imageUrl: req.body.imageUrl,
      },
    });
    res.status(201).json(nuevoVehiculo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear vehículo' });
  }
});

// Levantar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});