// controllers/autoController.ts

import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

// Función para marcar auto como Activo
async function marcarAutoComoActivo(idAuto: number) {
  return await prisma.auto.update({
    where: { idAuto: idAuto },
    data: { estado: 'ACTIVO' }
  });
}

// Controlador para manejar la solicitud de marcar un auto como activo
export const marcarActivo = async (req: Request, res: Response) => {
  try {
    const idAuto = parseInt(req.params.idAuto);
    
    // Validar id del auto
    if (isNaN(idAuto)) {
      return res.status(400).json({ error: 'ID de auto inválido' });
    }
    
    const autoActualizado = await marcarAutoComoActivo(idAuto);
    
    return res.status(200).json({
      mensaje: 'Auto marcado como activo exitosamente',
      auto: autoActualizado
    });
    
  } catch (error: any) {
    console.error('Error al marcar auto como activo:', error);
    
    // Manejar y devolver errores especificos
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Auto no encontrado' });
    }
    
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Función para marcar auto como inactivo
async function marcarAutoComoInactivo(idAuto: number) {
  return await prisma.auto.update({
    where: { idAuto: idAuto },
    data: { estado: 'INACTIVO' }
  });
}

// Controlador para manejar la solicitud de marcar un auto como inactivo
export const marcarInactivo = async (req: Request, res: Response) => {
  try {
    const autoId = parseInt(req.params.id);
    
    // Validar id del auto
    if (isNaN(autoId)) {
      return res.status(400).json({ error: 'ID de auto inválido' });
    }
    
    const autoActualizado = await marcarAutoComoInactivo(autoId);
    
    return res.status(200).json({
      mensaje: 'Auto marcado como inactivo exitosamente',
      auto: autoActualizado
    });
    
  } catch (error: any) {
    console.error('Error al marcar auto como inactivo:', error);
    
    // Manejar y devolver errores especificos
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Auto no encontrado' });
    }
    
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Función para poner un auto en mantenimiento
async function ponerAutoEnMantenimiento(
  idAuto: number, 
  data: {
    descripcion?: string, 
    tipoMantenimiento: 'PREVENTIVO' | 'CORRECTIVO' | 'REVISION', 
    kilometraje: number,
    costo?: number,
    fechaInicio?: Date,
    fechaFin?: Date
  }
) {
  return await prisma.$transaction(async (tx) => {
    // Crear registro de mantenimiento
    const mantenimiento = await tx.historialMantenimiento.create({
      data: {
        idAuto: idAuto,
        descripcion: data.descripcion || 'Mantenimiento general',
        fechaInicio: data.fechaInicio || new Date(),
        fechaFin: data.fechaFin ?? null, // Puede ser null para mantenimiento indefinido
        tipoMantenimiento: data.tipoMantenimiento,
        kilometraje: data.kilometraje,
        costo: data.costo ? new Prisma.Decimal(data.costo) : null
      }
    });

    // Crear registro de no disponibilidad
    await tx.disponibilidad.create({
      data: {
        idAuto: idAuto,
        fechaInicio: data.fechaInicio || new Date(),
        fechaFin: data.fechaFin || new Date(0),
        motivo: 'MANTENIMIENTO',
        descripcion: data.descripcion || 'Mantenimiento del vehículo'
      }
    });

    // Marcar auto como inactivo
    await tx.auto.update({
      where: { idAuto: idAuto },
      data: { estado: 'INACTIVO' }
    });

    return mantenimiento;
  });
}

// Controlador para poner un auto en mantenimiento
export const ponerEnMantenimiento = async (req: Request, res: Response) => {
  try {
    const idAuto = parseInt(req.params.idAuto);
    const { 
      descripcion, 
      tipoMantenimiento, 
      kilometraje, 
      costo, 
      fechaInicio, 
      fechaFin 
    } = req.body;
    
    // Validaciones
    if (isNaN(idAuto)) {
      return res.status(400).json({ error: 'ID de auto inválido' });
    }

    if (!tipoMantenimiento || !['PREVENTIVO', 'CORRECTIVO', 'REVISION'].includes(tipoMantenimiento)) {
      return res.status(400).json({ error: 'Tipo de mantenimiento inválido' });
    }

    if (!kilometraje || kilometraje <= 0) {
      return res.status(400).json({ error: 'Kilometraje inválido' });
    }

    // Verificar que el auto exista antes de ponerlo en mantenimiento
    const autoExistente = await prisma.auto.findUnique({
      where: { idAuto: idAuto }
    });

    if (!autoExistente) {
      return res.status(404).json({ error: 'Auto no encontrado' });
    }

    // Poner el auto en mantenimiento
    const mantenimiento = await ponerAutoEnMantenimiento(idAuto, {
      descripcion,
      tipoMantenimiento,
      kilometraje,
      costo,
      fechaInicio,
      fechaFin: fechaFin ? new Date(fechaFin) : undefined
    });
    
    return res.status(200).json({
      mensaje: 'Auto puesto en mantenimiento exitosamente',
      mantenimiento: mantenimiento
    });
    
  } catch (error: any) {
    console.error('Error al poner auto en mantenimiento:', error);
    
    return res.status(500).json({ error: 'Error al procesar la solicitud de mantenimiento' });
  }
};



