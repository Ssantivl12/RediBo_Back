import { Request, Response } from 'express';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// Función para generar un código de comprobante aleatorio
const generarComprobante = (): string => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let comprobante = '';
  for (let i = 0; i < 12; i++) {
    comprobante += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return comprobante;
};

export const generarQR = async (req: Request, res: Response) => {
  try {
    const { monto, referencia } = req.params;

    const comprobante = generarComprobante();

    const qrData = `Monto: ${monto}, Referencia: ${referencia}, Comprobante: ${comprobante}`;
    const fileName = `qr_${Date.now()}.png`;
    const filePath = path.join(__dirname, '..', 'temp', fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await QRCode.toFile(filePath, qrData, {
      color: {
        dark: '#000',
        light: '#FFF'
      }
    });

     // Guardar también los datos en JSON
     const jsonData = { monto, referencia, comprobante };
     const jsonPath = filePath.replace('.png', '.json');
     fs.writeFileSync(jsonPath, JSON.stringify(jsonData));
 

    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo QR ${fileName}:`, err);
        } else {
          console.log(`Archivo QR eliminado: ${fileName}`);
        }
      });
    }, 10 * 60 * 1000); // 10 minutos

    // Envía la imagen como respuesta
    res.sendFile(filePath, () => {
      console.log(`QR enviado. Comprobante: ${comprobante}`);
    });
  } catch (error) {
    console.error('Error generando QR:', error);
    res.status(500).json({ error: 'No se pudo generar el QR' });
  }
};
