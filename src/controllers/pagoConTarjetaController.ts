import { Request, Response } from 'express';
import { procesarPagoConTarjeta } from '../services/pagoConTarjetaService';

export const realizarPagoConTarjeta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { monto, metodo, referencia, estado, vehiculoid } = req.body;


    if (!monto || !metodo) {
      return res.status(400).json({ error: 'Faltan datos obligatorios: monto y método son requeridos' });
    }

    const nuevoPago = await procesarPagoConTarjeta({
      monto,
      metodo,
      referencia,
      estado,
      vehiculoid,
    });

    return res.status(201).json({
      mensaje: 'Pago con tarjeta registrado con éxito',
      pago: nuevoPago,
    });
  } catch (error) {
    console.error('Error al realizar el pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
