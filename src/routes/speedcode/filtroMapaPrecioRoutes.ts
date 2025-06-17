import { Router } from 'express';
import {
  filtrarVehiculos,
} from '../../controllers/speedcode/filtroMapaController';
import { autocompletarAeropuerto } from '../../controllers/speedcode/filtroAeropuertoController';
import { listarReservasAprobadas, getDetalleReserva } from "../../controllers/speedcode/reservasAprobadasController";
import { getTopAutos } from '../../controllers/speedcode/topAutosController';
import { generarQR } from '../../controllers/speedcode/generarQRController';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  asignarConductores,
  obtenerConductores,
  eliminarConductor,
} from '../../controllers/speedcode/conductoresController';
import {
  obtenerUltimasBusquedas,
  registrarBusqueda,
  autocompletarBusquedas
} from "../../controllers/speedcode/historialBusquedaController";
import * as PagoController from '../../controllers/speedcode/pago.controller';
import {
  cancelarExpiradas,
  cancelarReserva,
} from '../../controllers/speedcode/reservas.controller';

const router = Router();

router.post('/cancelar-expiradas', cancelarExpiradas);
router.post('/cancelar/:idreserva', cancelarReserva);

router.post('/pagarConTarjeta/:reserva_idreserva', PagoController.realizarPagoTarjeta);
router.post('/pagarConQR/:reserva_idreserva', PagoController.realizarPagoQR);
router.get('/obtenerPagos', PagoController.obtenerPagos);

router.get("/ultimas", obtenerUltimasBusquedas);
router.post("/registrar", registrarBusqueda);
router.get("/autocompletar", autocompletarBusquedas);

router.post('/conductores/asignar', asignarConductores);
router.get('/conductores/:idReserva', obtenerConductores);
router.delete('/conductores/:idReserva/:idUsuario', eliminarConductor);

router.get('/generarQR/:tipo/:monto/:idReserva', asyncHandler(generarQR));

router.get('/filtroMapaPrecio', filtrarVehiculos);
router.get('/autocompletar/aeropuerto', autocompletarAeropuerto);
router.get("/reservas/aprobadas", listarReservasAprobadas);

//para mostrar detalle de reserva
router.get("/reservas/:id", getDetalleReserva);

//para el carrousel
router.get('/autos-top', getTopAutos);

export default router;