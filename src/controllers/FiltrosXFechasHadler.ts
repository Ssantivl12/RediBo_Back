import { Request, Response } from 'express';

export async function FiltroXfechasHandler(req: Request, res: Response) {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Debes proporcionar ambas fechas.' });
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  try {
    const vehicles = await getAvailableVehiclesByDate(start, end); // asegúrate que esta función exista
    res.json(vehicles);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}