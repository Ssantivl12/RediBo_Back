import { Router } from 'express';
import * as PagoController from '../controllers/pago.controller';

const router = Router();

router.post('/pagarConTarjeta/:rentalId/:monto/:referencia', (req, res, next) => {
    console.log('Ruta alcanzada:', req.originalUrl);
    next();  
  }, PagoController.realizarPagoTarjeta);
router.post('/pagarConQR', PagoController.realizarPagoQR);
router.get('/', PagoController.obtenerPagos);

export default router;

/*
EJEPLO API PARA PROBAR PAGO CON TARJETA
http://localhost:3000/pagos/pagarConTarjeta/123/1000/ABCD1234
{
  "nombreTitular": "Juan Pérez",
  "numeroTarjeta": "1234567812345678",
  "fechaExpiracion": "12/25",
  "cvv": "123",
  "direccion": "Calle Falsa 123",
  "correoElectronico": "juanperez@example.com"
}
*/