import { prisma } from '../config/database';

export const registrarPago = async (rentalId, monto, fechaPago, metodoPago, referencia, comprobante) => {
  try {
    const pagoData = {
      rentalId,
      monto,
      fechaPago,
      metodoPago,
      comprobante,
      ...(referencia && { referencia }),
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
