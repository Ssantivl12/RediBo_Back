import { Request, Response } from 'express';
import {obtenerVehiculosDisponibles} from '../services/filtroMapaPrecioService';

export const getVehiculosDisponibles = async (req: Request, res: Response): Promise<any> => {
  try {
    const vehiculos = await obtenerVehiculosDisponibles();
    res.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos disponibles:', error);
    res.status(500).json({ mensaje: 'Error al obtener los vehículos' });
  }
};
