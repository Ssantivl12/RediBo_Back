import { Request, Response } from 'express';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { generarCodigoComprobante } from './pago.controller';

export const generarQR = async (req: Request, res: Response) => {
  try {
    const { monto } = req.params;

    if (!monto) {
      return res.status(400).json({ error: 'Monto obligatorio para generar QR..' });
    }

    const referencia = 'QR-' + generarCodigoComprobante();
    const tempDir = path.join(__dirname, '..', 'temp');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const nombreBase = `qr_${Date.now()}`;
    const rutaJson = path.join(tempDir, `${nombreBase}.json`);
    const rutaQR = path.join(tempDir, `${nombreBase}.png`);
    const fecha= new Date().toISOString()
    const datos = {
      referencia,
      monto,
      fecha
    };

    fs.writeFileSync(rutaJson, JSON.stringify(datos, null, 2), 'utf-8');

    const contenidoQR = `Monto: ${monto}, Referencia: ${referencia}, Fecha: ${fecha}`;

    await QRCode.toFile(rutaQR, contenidoQR);

    setTimeout(() => {
      try {
        fs.unlinkSync(rutaQR);
        fs.unlinkSync(rutaJson);
        console.log(`Archivos eliminados: ${rutaQR}, ${rutaJson}`);
      } catch (err) {
        console.error('Error al eliminar archivos temporales:', err);
      }
    }, 10 * 60 * 1000);

    return res.json({
      mensaje: 'QR generado correctamente',
      archivoQR: `${nombreBase}.png`,
      archivoJSON: `${nombreBase}.json`,
      referencia
    });

  } catch (error) {
    console.error('Error al generar QR:', error);
    return res.status(500).json({ error: 'Error interno al generar el QR.' });
  }
};