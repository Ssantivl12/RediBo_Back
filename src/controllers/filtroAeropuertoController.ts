import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getDistanceFromLatLonInKm } from '../utils/distance';
console.log('getDistanceFromLatLonInKm es:', getDistanceFromLatLonInKm);

const prisma = new PrismaClient();
const MAX_DISTANCE_KM = 3;

export const autocompletarAeropuerto = async (req: Request, res: Response) : Promise<any> => {
  const { q } = req.query;

  if (typeof q !== 'string' || q.trim() === '') {
    return res.status(400).json({ mensaje: 'Debe ingresar un nombre de aeropuerto.' });
  }

  try {
    const resultados = await prisma.aeropuerto.findMany({
      where: {
        nombre: {
          contains: q,
          mode: 'insensitive',
        },
      },
      take: 5,
      orderBy: {
        nombre: 'asc',
      },
    });

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron resultados.' });
    }

    return res.json(resultados);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error de red al buscar aeropuertos.' });
  }
};

export const obtenerVehiculosCercanos = async (req: Request, res: Response): Promise<any> => {
  const schema = z.object({
    id: z.coerce.number().int(), // <-- importante: coerce para aceptar string
  });

  const parsed = schema.safeParse(req.params); // <-- se usa req.params

  if (!parsed.success) {
    return res.status(400).json({ mensaje: 'Debe proporcionar un ID de aeropuerto válido.' });
  }

  try {
    const aeropuerto = await prisma.aeropuerto.findUnique({
      where: { idaeropuerto: parsed.data.id },
    });

    if (!aeropuerto) {
      return res.status(404).json({ mensaje: 'Aeropuerto no encontrado.' });
    }

    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        OR: [
          { entregaAeropuerto: true },
          { ubicacion: { latitud: { not: null }, amplitud: { not: null } } },
        ],
      },
      include: { ubicacion: true },
    });

    const vehiculosCercanos = vehiculos
      .map((v) => {
        const distancia = getDistanceFromLatLonInKm(
          aeropuerto.latitud,
          aeropuerto.longitud,
          v.ubicacion?.latitud ?? 0,
          v.ubicacion?.amplitud ?? 0
        );
        return { ...v, distancia };
      })
      .filter((v) => v.distancia <= MAX_DISTANCE_KM)
      .sort((a, b) => a.distancia - b.distancia);

    if (vehiculosCercanos.length === 0) {
      return res.status(200).json({ mensaje: 'No se encontraron vehículos disponibles cerca.' });
    }

    return res.json(
      vehiculosCercanos.map((v) => ({
        id: v.idvehiculo,
        imagen: v.imagen,
        precio: v.tarifa,
        distancia: `${v.distancia.toFixed(2)} km`,
      }))
    );
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error de red al obtener vehículos.' });
  }
};
