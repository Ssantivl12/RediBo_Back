import fs from 'fs';
import path from 'path';

export function validarQR(nombreArchivoQR: string) {
  const tempDir = path.join(__dirname, '..', 'temp');

  // Asegurarse de quitar la extensión si viene .png o .json
  const nombreBase = path.parse(nombreArchivoQR).name;
  const rutaJson = path.join(tempDir, `${nombreBase}.json`);

  if (!fs.existsSync(rutaJson)) {
    return {
      valido: false,
      errores: ['No se encontró comprobante QR válido.']
    };
  }

  try {
    const data = JSON.parse(fs.readFileSync(rutaJson, 'utf-8'));

    // Validar que tenga el comprobante dentro
    if (!data.comprobante) {
      return {
        valido: false,
        errores: ['El archivo JSON no contiene un comprobante válido.']
      };
    }

    return {
      valido: true,
      comprobante: data.comprobante, // <- Aquí lo regresamos directamente
      datos: data // opcional, si quieres seguir usando monto y referencia también
    };
  } catch (err) {
    console.error('Error al leer el archivo JSON del QR:', err);
    return {
      valido: false,
      errores: ['Error al leer o parsear el archivo JSON.']
    };
  }
}
