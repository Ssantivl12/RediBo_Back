import prisma from '../config/database';
import { NotificacionDTO, NotificacionFiltro } from '../types/notificacion.types';
import { PrioridadNotificacion } from '@prisma/client';
import { SSEService } from './sse.service';

export class NotificacionService {
    private sseService: SSEService;
    private static instance: NotificacionService;

    private constructor() {
        this.sseService = SSEService.getInstance();
    }

    public static getInstance(): NotificacionService {
        if (!NotificacionService.instance) {
            NotificacionService.instance = new NotificacionService();
        }
        return NotificacionService.instance;
    }

    async crearNotificacion(notificacionData: NotificacionDTO) {
        try {
            const data = {
                ...notificacionData,
                prioridad: notificacionData.prioridad || PrioridadNotificacion.MEDIA,
            };
    
            const nuevaNotificacion = await prisma.notificacion.create({
                data
            });
    
            try {
                await this.sseService.enviarNotificacion({
                    evento: 'NUEVA_NOTIFICACION',
                    data: nuevaNotificacion,
                    usuarioId: notificacionData.usuarioId
                });
            } catch (sseError) {
                console.error('Error al enviar notificación via SSE:', sseError);
            }
    
            return nuevaNotificacion;
        } catch (error) {
            console.error('Error al crear notificación:', error);
            throw new Error('No se pudo crear la notificación');
        }
    }    

    async obtenerNotificaciones(filtros: NotificacionFiltro) {
        try {
          const where: any = {};
      
          if (filtros.usuarioId)   where.usuarioId   = filtros.usuarioId;
          if (filtros.tipo)        where.tipo        = filtros.tipo;
          if (filtros.leido !== undefined) where.leido = filtros.leido;
          if (filtros.prioridad)   where.prioridad   = filtros.prioridad;
          if (filtros.tipoEntidad) where.tipoEntidad = filtros.tipoEntidad;

          where.haSidoBorrado = false;
      
          if (filtros.desde || filtros.hasta) {
            where.creadoEn = {};
            if (filtros.desde) where.creadoEn.gte = filtros.desde;
            if (filtros.hasta) where.creadoEn.lte = filtros.hasta;
          }
      
          const take = filtros.limit  || 10;
          const skip = filtros.offset || 0;

          const [rawNotificaciones, total] = await Promise.all([
            prisma.notificacion.findMany({
              where,
              orderBy: { creadoEn: 'desc' },
              take,
              skip,
            }),
            prisma.notificacion.count({ where })
          ]);
      
          // 2) Por cada notificación, chequeamos entidadId + tipoEntidad
          //    y vamos a la tabla correspondiente para obtener imagenAuto
          const notificacionesConImagen = await Promise.all(
            rawNotificaciones.map(async (n) => {
              let imagenAuto: string | null = null;
              const idEnt = n.entidadId;
              const tipoEnt = n.tipoEntidad?.toLowerCase();
      
              if (idEnt && tipoEnt) {
                switch (tipoEnt) {
                  case 'renta': {
                    // renta → reserva → auto → imágenes
                    const renta = await prisma.renta.findUnique({
                      where: { id: idEnt },
                      include: {
                        reserva: {
                          include: {
                            auto: { select: { imagenes: true } }
                          }
                        }
                      }
                    });
                    imagenAuto = renta?.reserva?.auto?.imagenes ?? null;
                    break;
                  }
                  case 'reserva': {
                    // reserva → auto → imágenes
                    const reserva = await prisma.reserva.findUnique({
                      where: { idReserva: idEnt },
                      include: { auto: { select: { imagenes: true } } }
                    });
                    imagenAuto = reserva?.auto?.imagenes ?? null;
                    break;
                  }
                  case 'calificacion': {
                    // calificacion → renta → reserva → auto → imágenes
                    const calif = await prisma.calificacion.findUnique({
                      where: { id: idEnt },
                      include: {
                        renta: {
                          include: {
                            reserva: {
                              include: {
                                auto: { select: { imagenes: true } }
                              }
                            }
                          }
                        }
                      }
                    });
                    imagenAuto = calif?.renta?.reserva?.auto?.imagenes ?? null;
                    break;
                  }
                  default:
                    imagenAuto = null;
                }
              }
      
              return {
                ...n,
                imagenAuto
              };
            })
          );
      
          return {
            notificaciones: notificacionesConImagen,
            total,
            page:  Math.floor(skip / take) + 1,
            limit: take
          };
        } catch (error) {
          console.error('Error al obtener notificaciones:', error);
          throw new Error('No se pudieron obtener las notificaciones');
        }
    }         

    async obtenerDetalleNotificacion(id: string, usuarioId: string) {
        try {
            const notificacion = await prisma.notificacion.findUnique({
                where: { id },
            });
    
            if (!notificacion) {
                throw new Error('Notificación no encontrada');
            }
    
            if (notificacion.usuarioId !== usuarioId) {
                throw new Error('No tienes permiso para ver esta notificación');
            }
    
            // Ahora, obtener la imagen del auto asociada a esta notificación
            let imagenAuto: string | null = null;
            const idEnt = notificacion.entidadId;
            const tipoEnt = notificacion.tipoEntidad?.toLowerCase();
    
            if (idEnt && tipoEnt) {
                switch (tipoEnt) {
                    case 'renta': {
                        // renta → reserva → auto → imágenes
                        const renta = await prisma.renta.findUnique({
                            where: { id: idEnt },
                            include: {
                                reserva: {
                                    include: {
                                        auto: { select: { imagenes: true } },
                                    },
                                },
                            },
                        });
                        imagenAuto = renta?.reserva?.auto?.imagenes ?? null;
                        break;
                    }
                    case 'reserva': {
                        // reserva → auto → imágenes
                        const reserva = await prisma.reserva.findUnique({
                            where: { idReserva: idEnt },
                            include: { auto: { select: { imagenes: true } } },
                        });
                        imagenAuto = reserva?.auto?.imagenes ?? null;
                        break;
                    }
                    case 'calificacion': {
                        // calificacion → renta → reserva → auto → imágenes
                        const calif = await prisma.calificacion.findUnique({
                            where: { id: idEnt },
                            include: {
                                renta: {
                                    include: {
                                        reserva: {
                                            include: {
                                                auto: { select: { imagenes: true } },
                                            },
                                        },
                                    },
                                },
                            },
                        });
                        imagenAuto = calif?.renta?.reserva?.auto?.imagenes ?? null;
                        break;
                    }
                    default:
                        imagenAuto = null;
                }
            }
    
            // Retorna la notificación con la imagen del auto
            return {
                ...notificacion,
                imagenAuto,
            };
        } catch (error) {
            console.error('Error al obtener detalle de notificación:', error);
            throw error;
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

            this.sseService.enviarNotificacion({
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

            const actualizada = await prisma.notificacion.update({
                where: { id },
                data: {
                    haSidoBorrado: true
                }
            });

            this.sseService.enviarNotificacion({
                evento: 'NOTIFICACION_ELIMINADA',
                data: { id },
                usuarioId
            });

            return { id, eliminada: true };
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
            throw error;
        }
    }

    async obtenerConteoNoLeidas(usuarioId: string) {
        try {
            const count = await prisma.notificacion.count({
                where: {
                    usuarioId,
                    leido: false,
                    haSidoBorrado: false
                }
            });

            return { count, totalNoLeidas: count };
        } catch (error) {
            console.error('Error al obtener conteo de notificaciones:', error);
            throw new Error('No se pudo obtener el conteo de notificaciones');
        }
    }
}

export async function obtenerNoLeidas(userId: string) {
    return prisma.notificacion.findMany({
      where: {
        usuarioId: userId,
        leido: false,
        haSidoBorrado: false
      },
      orderBy: {
        creadoEn: 'desc',
      },
    });
}