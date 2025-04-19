import { Request, Response } from 'express';
import { cars } from '../data/cars';
import { getCarSummary } from '@/query/carQuery';

export const getAllCars = (req: Request, res: Response): void => {
  res.json(cars);
};

export const getCarById = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const car = cars.find(c => c.id === id);
  if (!car) {
    res.status(404).json({ message: 'Auto no encontrado' });
    return;
  }
  res.json(car);
};

export const getCarSummaryController = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return; 
  }

  try {
    const resultado = await getCarSummary(id);
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener resumen del auto:', error);
    res.status(500).json({ error: 'Error al obtener el resumen del auto' });
  }
};