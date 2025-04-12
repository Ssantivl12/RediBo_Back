// controllers/autoController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Función para marcar auto como ocupado
async function marcarAutoComoOcupado(autoId: number) {
  return await prisma.auto.update({
    where: { id: autoId },
    data: { estado: 'OCUPADO' }
  });
}

// Controlador para manejar la solicitud de marcar un auto como ocupado
export const marcarOcupado = async (req: Request, res: Response) => {
  try {
    const autoId = parseInt(req.params.id);
    
    // Validar id del auto
    if (isNaN(autoId)) {
      return res.status(400).json({ error: 'ID de auto inválido' });
    }
    
    const autoActualizado = await marcarAutoComoOcupado(autoId);
    
    return res.status(200).json({
      mensaje: 'Auto marcado como ocupado exitosamente',
      auto: autoActualizado
    });
    
  } catch (error: any) {
    console.error('Error al marcar auto como ocupado:', error);
    
    // Manejar y devolver errores especificos
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Auto no encontrado' });
    }
    
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};