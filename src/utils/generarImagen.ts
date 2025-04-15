// generarImagen.ts
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

export const generarImagenPago = async (pago: any): Promise<string> => {
  const width = 600;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fondo
  ctx.fillStyle = '#f9f9f9';
  ctx.fillRect(0, 0, width, height);

  // Texto
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.fillText('🔖 Confirmación de Pago', 20, 40);
  ctx.font = '16px Arial';
  ctx.fillText(`Método: ${pago.metodo}`, 20, 80);
  ctx.fillText(`Monto: $${pago.monto}`, 20, 110);
  ctx.fillText(`Fecha: ${new Date(pago.fecha).toLocaleString()}`, 20, 140);
  ctx.fillText(`Referencia: ${pago.referencia || 'N/A'}`, 20, 170);
  ctx.fillText(`Estado: ${pago.estado || 'N/A'}`, 20, 200);

  const tempDir = path.join(__dirname, '..', '..', 'temp');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const imagePath = path.join(tempDir, `pago_${Date.now()}.png`);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(imagePath, buffer);

  return imagePath;
};
