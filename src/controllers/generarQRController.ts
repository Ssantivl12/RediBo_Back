import { Request, Response } from 'express';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
// Asegúrate de que importar `generarCodigoComprobante` no sea circular
import { generarCodigoComprobante } from './pago.controller';

export const generarQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const { monto, referencia } = req.params;

    const comprobante = 'QR-' + generarCodigoComprobante();

    const qrData = `Monto: ${monto}, Referencia: ${referencia}, Comprobante: ${comprobante}`;
    const fileName = `qr_${Date.now()}.png`;
    const filePath = path.join(__dirname, '..', 'temp', fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await QRCode.toFile(filePath, qrData, {
      color: {
        dark: '#000',
        light: '#FFF',
      },
    });

    // Enviar el QR como archivo directamente (sin validación aquí)
    res.sendFile(filePath, () => {
      console.log(`QR enviado. Comprobante: ${comprobante}`);
    });

    // Borrar el archivo después de 10 minutos
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo QR ${fileName}:`, err);
        } else {
          console.log(`Archivo QR eliminado: ${fileName}`);
        }
      });
    }, 10 * 60 * 1000);
  } catch (error) {
    console.error('Error generando QR:', error);
    res.status(500).json({ error: 'No se pudo generar el QR' });
  }
};
