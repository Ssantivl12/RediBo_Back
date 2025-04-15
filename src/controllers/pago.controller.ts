import { Request, Response } from 'express';
import * as PagoService from '../services/pago.service';

export const crearPago = async (req: Request, res: Response) => {
  try {
    const nuevoPago = await PagoService.crearPago(req.body);
    res.json(nuevoPago);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pago' });
  }
};

export const obtenerPagos = async (_req: Request, res: Response) => {
  try {
    const pagos = await PagoService.obtenerPagos();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
};
