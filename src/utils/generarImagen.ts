import { createCanvas } from 'canvas';
import path from 'path';
import fs from 'fs';

export const generarImagenPago = async (pago: any): Promise<string> => {
  const width = 800; // Relación 4:5, tamaño vertical para Instagram
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fondo
  ctx.fillStyle = '#f9f9f9';
  ctx.fillRect(0, 0, width, height);

  // Colores
  const colorPrimario = '#ff7f00'; // Naranja
  const colorSecundario = '#0077ff'; // Azul

  // Fondo de título
  ctx.fillStyle = colorPrimario;
  ctx.fillRect(0, 0, width, 80);

  // Texto
  ctx.fillStyle = '#ffffff';
  ctx.font = '30px Arial';
  ctx.fillText('🔖 Confirmación de Pago', 20, 50);

  // Detalles del pago
  ctx.fillStyle = colorSecundario;
  ctx.font = '20px Arial';
  ctx.fillText(`Método: ${pago.metodo}`, 20, 120);
  ctx.fillText(`Monto: $${pago.monto}`, 20, 150);
  ctx.fillText(`Fecha: ${new Date(pago.fecha).toLocaleString()}`, 20, 180);
  ctx.fillText(`Referencia: ${pago.referencia || 'N/A'}`, 20, 210);
  ctx.fillText(`Estado: ${pago.estado || 'N/A'}`, 20, 240);

  // Añadir la fecha del servidor
  ctx.fillStyle = '#666666';
  ctx.font = '16px Arial';
  const fechaServidor = new Date().toLocaleString();
  ctx.fillText(`Fecha del servidor: ${fechaServidor}`, 20, 270);

  // Crear el directorio de la imagen si no existe
  const tempDir = path.join(__dirname, '..', '..', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Guardar la imagen en el sistema de archivos
  const imagePath = path.join(tempDir, `pago_${Date.now()}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(imagePath, buffer);

  return imagePath;
};
