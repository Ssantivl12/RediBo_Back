import prisma from '../prisma/client';

interface PagoConTarjetaDTO {
  metodo: string;
  monto: number;
  referencia?: string;
  estado?: string;
  vehiculoid?: number;
}

export const procesarPagoConTarjeta = async (data: PagoConTarjetaDTO) => {
  const nuevoPago = await prisma.pago.create({
    data: {
      metodo: data.metodo,
      monto: data.monto,
      referencia: data.referencia ?? 'Pago simulado',
      estado: data.estado ?? 'Completado',
      vehiculoid: data.vehiculoid ?? null,
    },
  });

  return nuevoPago;
};
