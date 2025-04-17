import prisma from '../config/database';
import { sendToUser } from './webSocketServer';
import { TipoDeNotificacion, PrioridadNotificacion } from '@prisma/client';

type CrearNotificacionInput = {
  usuarioId: string;
  tipo: TipoDeNotificacion;
  titulo: string;
  mensaje: string;
  prioridad?: PrioridadNotificacion;
  entidadId?: string;
  tipoEntidad?: string;
};

/**
 * Crea una notificación única (por usuario, tipo y entidad) y la envía en tiempo real si el usuario está conectado.
 */
export async function crearYNotificar(input: CrearNotificacionInput): Promise<void> {
  const {
    usuarioId,
    tipo,
    titulo,
    mensaje,
    prioridad = 'MEDIUM',
    entidadId,
    tipoEntidad,
  } = input;

  const now = new Date();

  try {
    // Verificamos si ya existe una notificación con la misma combinación de usuario, tipo y entidadId
    const notificacionExistente = await prisma.notificacion.findFirst({
      where: {
        usuarioId,
        tipo,
        entidadId, // Buscar por entidadId (permitimos que sea null si no se proporciona)
      },
    });

    if (notificacionExistente) {
      // Si ya existe, solo la actualizamos
      await prisma.notificacion.update({
        where: {
          id: notificacionExistente.id,
        },
        data: {
          titulo,
          mensaje,
          prioridad,
          leido: false,
          leidoEn: null,
          actualizadoEn: now,
        },
      });

      console.log(`[Notificaciones] Notificación actualizada para el usuario ${usuarioId}`);
    } else {
      // Si no existe, creamos una nueva notificación
      const nuevaNotificacion = await prisma.notificacion.create({
        data: {
          usuarioId,
          tipo,
          titulo,
          mensaje,
          prioridad,
          entidadId, // Esto puede ser null si no se especifica
          tipoEntidad,
          creadoEn: now,
          actualizadoEn: now,
        },
      });

      console.log(`[Notificaciones] Notificación creada para el usuario ${usuarioId}`);

      // Enviar notificación al usuario en tiempo real
      sendToUser(usuarioId, {
        type: 'notificacion',
        payload: {
          id: nuevaNotificacion.id,
          titulo,
          mensaje,
          tipo,
          prioridad,
          entidadId,
          tipoEntidad,
          creadoEn: nuevaNotificacion.creadoEn,
        },
      });
    }
  } catch (error) {
    console.error('[Notificaciones] Error al crear o actualizar notificación:', error);
  }
}

/**
 * Marca una notificación como leída
 */
export async function marcarComoLeida(notificacionId: string): Promise<void> {
  await prisma.notificacion.update({
    where: { id: notificacionId },
    data: {
      leido: true,
      leidoEn: new Date(),
    },
  });
}

/**
 * Devuelve todas las notificaciones no leídas para un usuario
 */
export async function obtenerNoLeidas(userId: string) {
  return prisma.notificacion.findMany({
    where: {
      usuarioId: userId,
      leido: false,
    },
    orderBy: {
      creadoEn: 'desc',
    },
  });
}