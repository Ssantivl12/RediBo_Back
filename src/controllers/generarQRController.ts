import { Request, Response } from 'express';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { generarCodigoComprobante } from './pago.controller';

export const generarQR = async (req: Request, res: Response) => {
  try {
    const { monto, referencia } = req.params;

    if (!monto || !referencia) {
      return res.status(400).json({ error: 'Monto y referencia son obligatorios.' });
    }

    const comprobante = 'QR-' + generarCodigoComprobante();
    const tempDir = path.join(__dirname, '..', 'temp');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const nombreBase = `qr_${Date.now()}`;
    const rutaJson = path.join(tempDir, `${nombreBase}.json`);
    const rutaQR = path.join(tempDir, `${nombreBase}.png`);

    const datos = {
      comprobante,
      monto,
      referencia,
      fecha: new Date().toISOString()
    };

    // Guardar JSON
    fs.writeFileSync(rutaJson, JSON.stringify(datos, null, 2), 'utf-8');

    // Guardar imagen QR con contenido del nombre del JSON
    await QRCode.toFile(rutaQR, `${nombreBase}.json`);

    return res.json({
      mensaje: 'QR generado correctamente',
      archivoQR: `${nombreBase}.png`,
      archivoJSON: `${nombreBase}.json`,
      comprobante
    });

  } catch (error) {
    console.error('Error al generar QR:', error);
    return res.status(500).json({ error: 'Error interno al generar el QR.' });
  }
};
