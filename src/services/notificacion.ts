import prisma from '../config/database';
import { NotificacionDTO, NotificacionFiltro } from '../types/notification.types';
import { PrioridadNotificacion } from '@prisma/client';
import { WebSocketService } from './websocket';

export class NotificacionService {
    private wsService: WebSocketService;

    constructor(wsService: WebSocketService) {
        this.wsService = wsService;
    }

    async crearNotificacion(notificacionData: NotificacionDTO) {
        try {
            const data = {
                ...notificacionData,
                prioridad: notificacionData.prioridad || PrioridadNotificacion.MEDIA,
            };

            if (notificacionData.entidadId && notificacionData.tipo) {
                const existente = await prisma.notificacion.findFirst({
                    where: {
                        usuarioId: notificacionData.usuarioId,
                        entidadId: notificacionData.entidadId,
                        tipo: notificacionData.tipo
                    }
                });

                if (existente) {
                    const actualizada = await prisma.notificacion.update({
                        where: { id: existente.id },
                        data: {
                            titulo: data.titulo,
                            mensaje: data.mensaje,
                            prioridad: data.prioridad,
                            leido: false,
                            leidoEn: null,
                        }
                    });

                    this.wsService.enviarNotificacion({
                        evento: 'NUEVA_NOTIFICACION',
                        data: actualizada,
                        usuarioId: notificacionData.usuarioId
                    });

                    return actualizada;
                }
            }

            const nuevaNotificacion = await prisma.notificacion.create({
                data
            });

            this.wsService.enviarNotificacion({
                evento: 'NUEVA_NOTIFICACION',
                data: nuevaNotificacion,
                usuarioId: notificacionData.usuarioId
            });

            return nuevaNotificacion;
        } catch (error) {
            console.error('Error al crear notificación:', error);
            throw new Error('No se pudo crear la notificación');
        }
    }

    async obtenerNotificaciones(filtros: NotificacionFiltro) {
        try {
            const where: any = {};

            if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;
            if (filtros.tipo) where.tipo = filtros.tipo;
            if (filtros.leido !== undefined) where.leido = filtros.leido;
            if (filtros.prioridad) where.prioridad = filtros.prioridad;
            if (filtros.tipoEntidad) where.tipoEntidad = filtros.tipoEntidad;

            if (filtros.desde || filtros.hasta) {
                where.creadoEn = {};
                if (filtros.desde) where.creadoEn.gte = filtros.desde;
                if (filtros.hasta) where.creadoEn.lte = filtros.hasta;
            }

            const take = filtros.limit || 10;
            const skip = filtros.offset || 0;

            const [notificaciones, total] = await Promise.all([
                prisma.notificacion.findMany({
                    where,
                    orderBy: { creadoEn: 'desc' },
                    take,
                    skip
                }),
                prisma.notificacion.count({ where })
            ]);

            return {
                notificaciones,
                total,
                page: Math.floor(skip / take) + 1,
                limit: take
            };
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
            throw new Error('No se pudieron obtener las notificaciones');
        }
    }

    async marcarComoLeida(id: string, usuarioId: string) {
        try {
            const notificacion = await prisma.notificacion.findUnique({
                where: { id }
            });

            if (!notificacion) {
                throw new Error('Notificación no encontrada');
            }

            if (notificacion.usuarioId !== usuarioId) {
                throw new Error('No tienes permiso para actualizar esta notificación');
            }

            const actualizada = await prisma.notificacion.update({
                where: { id },
                data: {
                    leido: true,
                    leidoEn: new Date()
                }
            });

            this.wsService.enviarNotificacion({
                evento: 'NOTIFICACION_LEIDA',
                data: actualizada,
                usuarioId
            });

            return actualizada;
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            throw new Error('No se pudo actualizar la notificación');
        }
    }

    async eliminarNotificacion(id: string, usuarioId: string) {
        try {
            const notificacion = await prisma.notificacion.findUnique({
                where: { id }
            });

            if (!notificacion) {
                throw new Error('Notificación no encontrada');
            }

            if (notificacion.usuarioId !== usuarioId) {
                throw new Error('No tienes permiso para eliminar esta notificación');
            }

            await prisma.notificacion.delete({
                where: { id }
            });

            this.wsService.enviarNotificacion({
                evento: 'NOTIFICACION_ELIMINADA',
                data: { id },
                usuarioId
            });

            return { id, eliminada: true };
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
            throw new Error('No se pudo eliminar la notificación');
        }
    }

    async obtenerConteoNoLeidas(usuarioId: string) {
        try {
            const count = await prisma.notificacion.count({
                where: {
                    usuarioId,
                    leido: false
                }
            });

            return { count };
        } catch (error) {
            console.error('Error al obtener conteo de notificaciones:', error);
            throw new Error('No se pudo obtener el conteo de notificaciones');
        }
    }
}
