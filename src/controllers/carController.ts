// src/controllers/carController.ts
import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const autos = await prisma.auto.findMany({
      select: {
        idAuto: true,
        marca: true,
        modelo: true,
        vecesAlquilado: true,
        diasTotalRenta: true,
        // Solo la primera imagen
        imagenes: {
          select: {
            direccionImagen: true
          },
          take: 1
        }
      }
    });

    // Transformar datos para que coincidan con el tipo Car del frontend
    const carsFormatted = autos.map(auto => ({
      id: auto.idAuto,
      brand: auto.marca,
      model: auto.modelo,
      totalRentals: auto.vecesAlquilado || 0,
      totalUsageDays: auto.diasTotalRenta || 0,
      image: auto.imagenes[0]?.direccionImagen || null
    }));

    res.json(carsFormatted);
  } catch (error) {
    console.error('Error al obtener todos los autos:', error);
    res.status(500).json({ error: 'Error al obtener los autos' });
  }
};

export const getCarById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }
  
  try {
    const auto = await prisma.auto.findUnique({
      where: { idAuto: id },
      select: {
        idAuto: true,
        marca: true,
        modelo: true,
        color: true,
        vecesAlquilado: true,
        estado: true,
        // Información del propietario
        propietario: {
          select: {
            nombreCompleto: true
          }
        },
        // Solo la primera imagen
        imagenes: {
          select: {
            direccionImagen: true
          },
          take: 1
        }
      }
    });
    
    if (!auto) {
      res.status(404).json({ message: 'Auto no encontrado' });
      return;
    }

    // Transformar datos para el modal
    const carFormatted = {
      id: auto.idAuto,
      brand: auto.marca,
      model: auto.modelo,
      color: auto.color,
      totalRentals: auto.vecesAlquilado || 0,
      owner: auto.propietario.nombreCompleto,
      status: auto.estado === 'ACTIVO' ? 'Disponible' : 
              auto.estado === 'INACTIVO' ? 'Rentado' : auto.estado,
      image: auto.imagenes[0]?.direccionImagen || null,
      topRank: null // Este campo no está en tu esquema, puedes calcularlo si es necesario
    };
    
    res.json(carFormatted);
  } catch (error) {
    console.error('Error al obtener el auto:', error);
    res.status(500).json({ error: 'Error al obtener el auto' });
  }
};

export const getCarSummaryController = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    const auto = await prisma.auto.findUnique({
      where: { idAuto: id },
      select: {
        idAuto: true,
        marca: true,
        modelo: true,
        año: true,
        vecesAlquilado: true
      }
    });
    
    if (!auto) {
      res.status(404).json({ message: 'Auto no encontrado' });
      return;
    }
    
    const resultado = {
      id: auto.idAuto,
      resumen: `${auto.marca} ${auto.modelo} - ${auto.año}`,
      vecesAlquilado: auto.vecesAlquilado || 0
    };
    
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener resumen del auto:', error);
    res.status(500).json({ error: 'Error al obtener el resumen del auto' });
  }
};