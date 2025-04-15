import { Request, Response } from 'express';
import * as PagoService from '../services/pago.service';
import { sendEmail } from '../utils/mailer';
import { generarImagenPago } from '../utils/generarImagen';

export const crearPago = async (req: Request, res: Response) => {
  try {

    if (!req.body.metodo || !req.body.monto) {
      throw new Error('El método de pago y el monto son obligatorios');
    }


    const nuevoPago = await PagoService.crearPago(req.body);


    const imagePath = await generarImagenPago(nuevoPago);


    const fechaPago = nuevoPago.fecha ? new Date(nuevoPago.fecha).toLocaleString() : 'Fecha no disponible';


    const correoHtml = `
      <h2>Confirmación de Pago</h2>
      <p>Detalles del pago:</p>
      <ul>
        <li>Método: ${nuevoPago.metodo}</li>
        <li>Monto: $${nuevoPago.monto}</li>
        <li>Fecha: ${fechaPago}</li>
        <li>Referencia: ${nuevoPago.referencia || 'N/A'}</li>
        <li>Estado: ${nuevoPago.estado || 'N/A'}</li>
      </ul>
    `;

    // Enviar el correo
    const exito = await sendEmail(
      req.body.correo,
      'Confirmación de Pago - RediBo',
      correoHtml,
      imagePath
    );

    if (exito) {
      res.json({ mensaje: 'Pago registrado y correo enviado exitosamente.' });
    } else {
      throw new Error('Error al enviar el correo');
    }

  } catch (error) {
    console.error('Error al crear el pago:', error);
    res.status(500).json({ error: 'Error al crear el pago' });
  }
};

export const obtenerPagos = async (_req: Request, res: Response) => {
  try {
    const pagos = await PagoService.obtenerPagos();
    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
};
