import fs from 'fs';
import path from 'path';

export function validarQR(comprobante: string) {
  const tempDir = path.join(__dirname, '..', 'temp');
  const archivos = fs.readdirSync(tempDir);

  // Buscar archivo JSON por nombre del comprobante
  const archivoJson = archivos.find(archivo =>
    archivo.endsWith('.json') && archivo.includes(comprobante)
  );

  if (!archivoJson) {
    return {
      valido: false,
      errores: ['No se encontró comprobante QR válido.']
    };
  }

  const data = JSON.parse(fs.readFileSync(path.join(tempDir, archivoJson), 'utf-8'));
  return {
    valido: true,
    datos: data
  };
}
