
/* SAMUEL
export.realizarPagoQr( /*vas a tener el mismo Bodi que crearPago, parametros de entrada*/
/*aqui modificar para qr
if(metodoPago=="QR"){
 validarPago = validarQR();
 if(validarPago){
  llamar a esta funcion y recien crear el pago (export const crearPago = async (req: Request, res: Response) => {)
 }
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
//import { validarQR, validarTarjeta } from '../utils/validadores'; // asumiendo que existen estas funciones

/*export const realizarPago = async (req: Request, res: Response) => {
  try {
    const { metodoPago, monto, rentalId, referencia, comprobante, correo } = req.body;

    if (!metodoPago || !monto || !rentalId || !referencia || !comprobante || !correo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
  
    let validado = false;

    if (metodoPago === 'QR') {
      validado = validarQR();
    } else if (metodoPago === 'TARJETA_DEBITO') {
      validado = validarTarjeta();
    }
   
    if (!validado) {
      return res.status(400).json({ error: 'Validación del método de pago fallida.' });
    }

    const nuevoPago = await PagoService.crearPago({
      metodoPago,
      monto,
      rentalId,
      referencia,
      comprobante
    });

    const imagePath = await generarImagenPago(nuevoPago);

    const fechaPago = nuevoPago.fechaPago
      ? new Date(nuevoPago.fechaPago).toLocaleString()
      : 'Fecha no disponible';

    const correoHtml = `
      <h2>Confirmación de Pago</h2>
      <p>Detalles del pago:</p>
      <ul>
        <li>Método: ${nuevoPago.metodoPago}</li>
        <li>Monto: $${nuevoPago.monto}</li>
        <li>Fecha: ${fechaPago}</li>
        <li>Referencia: ${nuevoPago.referencia}</li>
      </ul>
    `;

    const exito = await sendEmail(
      correo,
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
    console.error('Error al realizar el pago:', error);
    res.status(500).json({ error: 'Error al realizar el pago' });
  }
};

*/export const registrarPago = async (correo, rentalId, monto, metodoPago, referencia, comprobante) => {
  try {
    // Validaciones
    if (!correo) {
      return { error: 'El correo es obligatorio' };
    }

    if (!rentalId) {
      return { error: 'El ID del alquiler (rentalId) es obligatorio' };
    }

    if (!metodoPago) {
      return { error: 'El método de pago es obligatorio' };
    }

    if (monto === undefined || monto === null) {
      return { error: 'El monto es obligatorio' };
    }

    if (Number(monto) <= 0) {
      return { error: 'El monto debe ser mayor a cero' };
    }

    if (!comprobante) {
      return { error: 'El comprobante es obligatorio' };
    }

    // Fecha actual del sistema
    const fechaPago = new Date();

    // Registrar el pago
    const nuevoPago = await PagoService.registrarPago(
      rentalId,
      monto,
      fechaPago,
      metodoPago,
      referencia || null,
      comprobante
    );

    // Generar imagen del pago
    const imagePath = await generarImagenPago(nuevoPago);

    // Preparar contenido del correo
    const correoHtml = `
      <h2>Confirmación de Pago</h2>
      <p>Detalles del pago:</p>
      <ul>
        <li>Método: ${nuevoPago.metodoPago}</li>
        <li>Monto: $${nuevoPago.monto}</li>
        <li>Fecha: ${fechaPago.toLocaleString()}</li>
        <li>Referencia: ${nuevoPago.referencia || 'N/A'}</li>
      </ul>
    `;

    // Enviar correo
    const exito = await sendEmail(
      correo,
      'Confirmación de Pago - RediBo',
      correoHtml,
      imagePath
    );

    if (!exito) {
      return { error: 'Pago registrado pero error al enviar el correo' };
    }

    // Éxito
    return {
      mensaje: 'Pago registrado y correo enviado exitosamente.',
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


