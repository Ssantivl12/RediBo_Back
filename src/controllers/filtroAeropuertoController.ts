/*
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
    idaeropuerto: z.coerce.number().int(), // convierte string a número
  });

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ mensaje: 'Debe seleccionar un aeropuerto válido.' });
  }

  try {
    const aeropuerto = await prisma.aeropuerto.findUnique({
      where: { idaeropuerto: parsed.data.idaeropuerto },
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
*/

import { Request, Response } from 'express';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
const R = 6371;
const dLat = (lat2 - lat1) * (Math.PI / 180);
const dLon = (lon2 - lon1) * (Math.PI / 180);
const a =
Math.sin(dLat / 2) ** 2 +
Math.cos(lat1 * Math.PI / 180) *
Math.cos(lat2 * Math.PI / 180) *
Math.sin(dLon / 2) ** 2;
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return R * c;
}

export const autocompletarAeropuerto = async (req: Request, res: Response) => {
const { q } = req.query;

const mockAeropuertos = [
{ id: 1, nombre: 'Aeropuerto Internacional A', latitud: -34.6, longitud: -58.4 },
{ id: 2, nombre: 'Aeropuerto Norte', latitud: -34.5, longitud: -58.3 },
{ id: 3, nombre: 'Aeropuerto Sur', latitud: -34.7, longitud: -58.5 }
];

if (typeof q !== 'string' || q.trim() === '') {
return res.status(400).json({ mensaje: 'Debe ingresar un nombre de aeropuerto.' });
}

const resultados = mockAeropuertos.filter(a =>
a.nombre.toLowerCase().includes(q.toLowerCase())
).slice(0, 5);

if (resultados.length === 0) {
return res.status(404).json({ mensaje: 'No se encontraron resultados.' });
}

return res.json(resultados);
};

export const obtenerVehiculosCercanos = async (req: Request, res: Response) => {
const { idaeropuerto } = req.body;

if (!idaeropuerto || typeof idaeropuerto !== 'number') {
return res.status(400).json({ mensaje: 'Debe seleccionar un aeropuerto válido.' });
}

const aeropuerto = { latitud: -34.6, longitud: -58.4 };

const mockVehiculos = [
{
idvehiculo: 101,
imagen: 'https://via.placeholder.com/100',
tarifa: 15000,
ubicacion: { latitud: -34.61, longitud: -58.41 }
},
{
idvehiculo: 102,
imagen: 'https://via.placeholder.com/100',
tarifa: 18000,
ubicacion: { latitud: -34.65, longitud: -58.45 }
}
];

const vehiculosCercanos = mockVehiculos.map(v => {
const distancia = getDistanceFromLatLonInKm(
aeropuerto.latitud,
aeropuerto.longitud,
v.ubicacion.latitud,
v.ubicacion.longitud
);

return {
  id: v.idvehiculo,
  imagen: v.imagen,
  precio: v.tarifa,
  distancia: `${distancia.toFixed(2)} km`
};
});

return res.json(vehiculosCercanos);
};