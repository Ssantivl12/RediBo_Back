
/* SAMUEL
export.realizarPagoQr( /*vas a tener el mismo Bodi que crearPago, parametros de entrada*/
/*aqui modificar para qr
if(metodoPago=="QR"){
 validarPago = validarQR();
 if(validarPago){
  llamar a esta funcion y recien crear el pago (export const crearPago = async (req: Request, res: Response) => {)
 }
  al momento de validar el qr tienes que recuperar el codigo de comprobante y recien cuando se haga todas las validaciones se manda a la siguiente funcion para registra
  export const registrarPago = async (
  correo: string,
  rentalId: number,
  monto: number,
  metodoPago: MetodoPago,
  referencia: string,
  comprobante: string
): Promise<any> => {
}

}*/

/* ABRAHAM body desde el formulario para validar tarjeta
if(metodoPago=="Tarjeta-Credito"){
  validarPago = validarTarjeta();
  if(validarPago){
  const nuevoPago = await PagoService.crearPago(req.body);
  }
 }
 */
// pago.controller.ts
import { Request, Response } from 'express';
import * as PagoService from '../services/pago.service';
import { sendEmail } from '../utils/mailer';
import { generarImagenPago } from '../utils/generarImagen';
import { MetodoPago } from '@prisma/client';







export const registrarPago = async (
  correo: string,
  rentalId: number,
  monto: number,
  metodoPago: MetodoPago,
  referencia: string,
  comprobante: string
): Promise<any> => {
  try {
    if (!correo) {
      return { error: 'El correo es obligatorio' };
    }

    if (!rentalId || isNaN(rentalId)) {
      return { error: 'El ID del alquiler (rentalId) es obligatorio y debe ser un número' };
    }

    if (monto <= 0) {
      return { error: 'El monto debe ser mayor a cero' };
    }

    if (!referencia) {
      return { error: 'La referencia es obligatoria' };
    }

    if (!comprobante) {
      return { error: 'El comprobante es obligatorio' };
    }

    const nuevoPago = await PagoService.registrarPago(
      rentalId,
      monto,
      metodoPago,
      referencia,
      comprobante
    );

    const imagePath = await generarImagenPago(nuevoPago);

    const correoHtml = `
      <h2>Confirmación de Pago</h2>
      <p>Detalles del pago:</p>
      <ul>
        <li>Método: ${metodoPago}</li>
        <li>Monto: $${monto}</li>
        <li>Referencia: ${referencia}</li>
      </ul>
    `;

    const exito = await sendEmail(
      correo,
      'Confirmación de Pago - RediBo',
      correoHtml,
      imagePath
    );

    if (!exito) {
      throw new Error('Error al enviar el correo');
    }

    return {
      message: 'Pago registrado correctamente',
      pago: nuevoPago,
      imagen: imagePath
    };

  } catch (error) {
    console.error('Error al registrar el pago:', error);
    return { error: 'Error interno al registrar el pago' };
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

// Función para generar un código de comprobante aleatorio
export const generarCodigoComprobante = (): string => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let comprobante = '';
  for (let i = 0; i < 12; i++) {
    comprobante += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return comprobante;
};