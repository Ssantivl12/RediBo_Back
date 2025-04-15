
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
import {validarTarjeta} from '../middlewares/validarTarjeta'
import {validarQR} from '../middlewares/validarQR'


export const realizarPagoQR = async (req: Request, res: Response) => {
  try {
    const { nombreArchivoQR, monto, rentalId, referencia, correo } = req.body;

    // Validaciones mínimas antes de continuar
    if (!nombreArchivoQR || !monto || !rentalId || !referencia || !correo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    // Validar que el comprobante (nombre del archivo JSON) exista
    const comprobante = validarQR(nombreArchivoQR); // corregir para recuperar solo el campo comprobantes que es un codigo textual en formato string
    const codigoComprobante = comprobante.comprobante;
    if (!comprobante.valido) {
      return res.status(400).json({ error: comprobante.errores });
    }
     
    const metodoPago: MetodoPago = MetodoPago.QR;
    // Registrar el pago utilizando la función central
    const resultadoPago = await registrarPago(
      correo,
      rentalId,
      monto,
      metodoPago,
      referencia,
      codigoComprobante
    );
  
    if (resultadoPago.error) {
      return res.status(400).json({ error: resultadoPago.error });
    }

    return res.json({
      mensaje: 'Pago QR registrado correctamente.',
      pago: resultadoPago.pago,
      imagen: resultadoPago.imagen
    });

  } catch (error) {
    console.error('Error al registrar pago QR:', error);
    return res.status(500).json({ error: 'Error interno al procesar el pago.' });
  }
};





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

export const realizarPagoTarjeta = async (req: Request, res: Response) => {
  try {
    const { nombreTitular, numeroTarjeta, fechaExpiracion, cvv, direccion, correoElectronico } = req.body;

    const { valido, errores } = validarTarjeta(nombreTitular, numeroTarjeta, fechaExpiracion, cvv, direccion, correoElectronico);
    
    if (!valido) {
      return res.status(400).json({ error: 'Errores en la validación de la tarjeta', detalles: errores });
    }

    const { monto, rentalId, referencia } = req.body;

    if (!monto || !rentalId || !referencia) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const metodoPago: MetodoPago = MetodoPago.TARJETA_DEBITO;

    const comprobante = 'TC-' + generarCodigoComprobante();

    const nuevoPago = await registrarPago(correoElectronico, rentalId, monto, metodoPago, referencia, comprobante);

    return res.json({ mensaje: 'Pago con tarjeta registrado correctamente.', pago: nuevoPago });

  } catch (error) {
    console.error('Error al registrar pago con tarjeta:', error);
    return res.status(500).json({ error: 'Error interno al procesar el pago.' });
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