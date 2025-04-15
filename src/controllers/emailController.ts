import { Request, Response } from 'express';
import { sendEmail } from '../utils/mailer';

export const enviarCorreoPrueba = async (req: Request, res: Response) => {
  const { para, asunto, mensaje } = req.body;

  const rutaImagen = 'src/temp/comprobante_pago.png'; 

  const success = await sendEmail(
    para,
    asunto || 'Correo de prueba desde RediBo',
    mensaje || '<p>Este es un mensaje de prueba.</p>',
    rutaImagen
  );

  if (success) {
    res.json({ mensaje: 'Correo enviado exitosamente.' });
  } else {
    res.status(500).json({ mensaje: 'Error al enviar el correo.' });
  }
};
