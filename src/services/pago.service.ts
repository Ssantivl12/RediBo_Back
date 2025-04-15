import { prisma } from '../config/database';
import { MetodoPago } from '@prisma/client'; 

export const registrarPago = async (
  rentalId: number,
  monto: number,
  metodoPago: MetodoPago,
  referencia: string,
  comprobante: string
) => {
  try {
    const pagoData = {
      rentalId,
      monto,
      metodoPago,
      comprobante,
      referencia, 
    };

    const nuevoPago = await prisma.pago.create({
      data: pagoData,
    });

    return nuevoPago;

  } catch (error) {
    console.error('Error al crear el pago:', error);
    throw new Error('Error al crear el pago');
  }
};
export const obtenerPagos = async () => {
  try {
    return await prisma.pago.findMany();
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    throw new Error('Error al obtener los pagos');
  }
};