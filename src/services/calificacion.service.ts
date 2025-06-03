import prisma  from '../config/database';

export class CalificacionService {
    async crearCalificacion({
        rentaId,
        puntuacion,
        texto
    }: {
        rentaId: string,
        puntuacion: number,
        texto?: string
    }) {
        // Verifica que la renta esté finalizada
        const renta = await prisma.renta.findUnique({ where: { id: rentaId } });
        if (!renta || renta.estatus !== 'FINALIZADA') {
            throw new Error('Solo puedes calificar rentas finalizadas.');
        }

        // Crea la calificación con comentario
        return await prisma.calificacion.create({
            data: {
                rentaId,
                puntuacion,
                texto
            }
        });
    }
}