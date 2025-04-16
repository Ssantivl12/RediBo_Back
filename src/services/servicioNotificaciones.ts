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
 * Crea una notificación y la envía en tiempo real si el usuario está conectado.
 * Si ya existe una notificación única con ese tipo, usuario y entidad, no la duplica.
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

  try {
    const notificacion = await prisma.notificacion.upsert({
      where: {
        notificacionUnicaUsuarioEntidad: {
          usuarioId,
          entidadId: entidadId ?? '',
          tipo,
        },
      },
      update: {
        titulo,
        mensaje,
        prioridad,
        leido: false,
        leidoEn: null,
        actualizadoEn: new Date(),
      },
      create: {
        usuarioId,
        tipo,
        titulo,
        mensaje,
        prioridad,
        entidadId,
        tipoEntidad,
      },
    });

    sendToUser(usuarioId, {
      type: 'notificacion',
      payload: {
        id: notificacion.id,
        titulo,
        mensaje,
        tipo,
        prioridad,
        entidadId,
        tipoEntidad,
        creadoEn: notificacion.creadoEn,
      },
    });
  } catch (error) {
    console.error('[Notificaciones] Error al crear notificación:', error);
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