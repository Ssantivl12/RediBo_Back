import { Request, Response } from 'express';
import { obtenerTopVehiculos } from '../services/vehiculoService';

export const getTopVehiculos = async (_req: Request, res: Response) => {
  try {
    const data = await obtenerTopVehiculos();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    res.status(500).json({ error: 'Error al obtener los vehículos con mejor calificación' });
  }
};
