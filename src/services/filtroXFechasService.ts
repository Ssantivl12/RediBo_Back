import { prisma } from '../config/database';
import { isBefore, addMonths } from 'date-fns';

export async function getAvailableVehiclesByDate(startDate: Date, endDate: Date) {
  const now = new Date();
  
  // Validaciones de fechas
  if (isBefore(startDate, now)) {
    throw new Error('La fecha de inicio no puede ser menor a hoy.');
  }
  
  if (isBefore(endDate, startDate)) {
    throw new Error('La fecha fin no puede ser menor a la fecha de inicio.');
  }
  
  const maxDate = addMonths(now, 12);
  if (endDate > maxDate) {
    throw new Error('El rango de fechas no puede exceder los 12 meses desde hoy.');
  }
  
  // Buscar vehículos disponibles para el rango de fechas solicitado
  const vehicles = await prisma.vehiculo.findMany({
    where: {
      disponible: 'sí',
      estado: 'activo',
      // Un vehículo está disponible si no tiene ninguna reserva superpuesta
      // con el periodo solicitado (startDate a endDate)
      reservas: {
        none: {
          // Una reserva se superpone si su periodo (fecha_inicio a fecha_fin)
          // coincide en algún punto con el periodo solicitado
          AND: [
            { fecha_inicio: { lte: endDate } },   // La reserva comienza antes o en la fecha fin solicitada
            { fecha_fin: { gte: startDate } }     // La reserva termina después o en la fecha inicio solicitada
          ]
        }
      }
    }
  });
  
  return vehicles;
}