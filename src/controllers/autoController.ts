// controllers/autoController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
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

