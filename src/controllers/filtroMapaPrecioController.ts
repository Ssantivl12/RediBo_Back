import { Request, Response } from 'express';
import { getAllVehiculos } from '../services/filtroMapaPrecioService';

export const obtenerTodosLosVehiculos = async (req: Request, res: Response) => {
  try {
    const vehiculos = await getAllVehiculos();
    res.status(200).json(vehiculos);
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    res.status(500).json({ error: 'Error al obtener los vehículos' });
  }
};
