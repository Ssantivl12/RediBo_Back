//C:\Users\H P\Documents\IS 2025\PROYECTO IS 1_2025\RediBo_Back\src\services\pagoConTarjetaService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearPagoConTarjeta = async (metodo: string, monto: number, referencia?: string, estado?: string, vehiculoid?: number) => {
    try {
      const pago = await prisma.pago.create({
        data: {
          metodo,
          monto: parseFloat(monto.toFixed(2)), 
          referencia,
          estado,
          vehiculoid,
        },
      });
      return pago;
    } catch (error) {
      console.error("Error al crear el pago:", error);
      throw new Error("Error al procesar el pago");
    }
  };
  