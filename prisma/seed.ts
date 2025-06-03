import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Usuarios
  await prisma.usuario.createMany({
    data: [
      { id: '24fdafde-3838-475c-90b5-d4c56dba5f5a', rol: 'Arrendador', nombre: 'Juan', apellido: 'Pérez' },
      { id: 'Usuario2', rol: 'Arrendador', nombre: 'Armando', apellido: 'Gomez' },
    ],
  });

  // Autos
  await prisma.auto.createMany({
    data: [
      {
        id: '95bab5fc-42cf-4b09-86fe-6742f7547d3f',
        marca: 'Honda',
        modelo: 'Civic',
        año: 2020,
        placa: 'XYZ456',
        color: 'Rojo',
        precioRentaDiario: 600.0,
        montoGarantia: 1600.0,
        estado: 'DISPONIBLE',
        fechaAdquisicion: new Date('2025-05-03T15:10:25.126Z'),
        kilometraje: 0,
        propietarioId: '24fdafde-3838-475c-90b5-d4c56dba5f5a',
        imagenes: 'https://i.imgur.com/lbERP1a.jpeg',
      },
      {
        id: 'bc0e0a71-e920-4c3a-ad7b-f64984b8bec7',
        marca: 'Ford',
        modelo: 'Focus',
        año: 2022,
        placa: 'LMN789',
        color: 'Negro',
        precioRentaDiario: 550.0,
        montoGarantia: 1400.0,
        estado: 'DISPONIBLE',
        fechaAdquisicion: new Date('2025-05-03T15:10:25.127Z'),
        kilometraje: 0,
        propietarioId: '24fdafde-3838-475c-90b5-d4c56dba5f5a',
        imagenes: 'https://i.imgur.com/ymVHxNc.jpeg',
      },
      {
        id: '874325e7-6739-4563-b5dd-a9e3d2661b69',
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2021,
        placa: 'ABC123',
        color: 'Gris Oscuro',
        precioRentaDiario: 500.0,
        montoGarantia: 1500.0,
        estado: 'DISPONIBLE',
        fechaAdquisicion: new Date('2025-05-03T15:10:25.119Z'),
        kilometraje: 0,
        propietarioId: 'Usuario2',
        imagenes: 'https://i.imgur.com/jcTD61j.jpeg',
      },
    ],
  });

  // Reservas
  await prisma.reserva.createMany({
    data: [
      {
        idReserva: 'reserva02',
        fechaInicio: new Date('2025-04-01'),
        fechaFin: new Date('2025-04-05'),
        autoId: '95bab5fc-42cf-4b09-86fe-6742f7547d3f',
        idCliente: '24fdafde-3838-475c-90b5-d4c56dba5f5a',
        estado: 'CONFIRMADA',
        fechaSolicitud: new Date('2025-05-03T15:10:25.131Z'),
        fechaLimitePago: new Date('2025-03-29'),
        montoTotal: 3000,
        estaPagada: true,
        montoPagado: 3000,
      },
      {
        idReserva: 'reserva01',
        fechaInicio: new Date('2025-05-01'),
        fechaFin: new Date('2025-05-10'),
        autoId: '874325e7-6739-4563-b5dd-a9e3d2661b69',
        idCliente: '24fdafde-3838-475c-90b5-d4c56dba5f5a',
        estado: 'CONFIRMADA',
        fechaSolicitud: new Date('2025-05-03T15:10:25.129Z'),
        fechaLimitePago: new Date('2025-05-30T21:06:00'),
        montoTotal: 5000,
        estaPagada: true,
        montoPagado: 5000,
      },
      {
        idReserva: 'reserva03',
        fechaInicio: new Date('2025-04-10'),
        fechaFin: new Date('2025-04-12'),
        autoId: 'bc0e0a71-e920-4c3a-ad7b-f64984b8bec7',
        idCliente: 'Usuario2',
        estado: 'CONFIRMADA',
        fechaSolicitud: new Date('2025-05-03T15:10:25.132Z'),
        fechaLimitePago: new Date('2025-05-18'),
        montoTotal: 3200,
        estaPagada: true,
        montoPagado: 3200,
      },
    ],
  });

  // Renta
  await prisma.renta.createMany({
    data: [
      {
        id: 'renta03',
        fechaInicio: new Date('2025-06-03T15:22:11'),
        fechaFin: new Date('2025-06-03T15:22:15'),
        autoId: '874325e7-6739-4563-b5dd-a9e3d2661b69',
        clienteId: '24fdafde-3838-475c-90b5-d4c56dba5f5a',
        fechaAprobacion: new Date('2025-06-03T15:22:42'),
        montoTotal: 5000,
        kilometrajeInicial: 20000,
        kilometrajeFinal: 20000,
        reservaId: 'reserva01',
        estatus: 'FINALIZADA',
      },
      {
        id: 'renta02',
        fechaInicio: new Date('2025-04-15'),
        fechaFin: new Date('2025-04-18'),
        autoId: 'bc0e0a71-e920-4c3a-ad7b-f64984b8bec7',
        clienteId: 'Usuario2',
        fechaAprobacion: new Date('2025-04-10'),
        montoTotal: 3200,
        kilometrajeInicial: 5000,
        kilometrajeFinal: 5000,
        reservaId: 'reserva03',
        estatus: 'FINALIZADA',
      },
      {
        id: 'renta01',
        fechaInicio: new Date('2025-04-01'),
        fechaFin: new Date('2025-04-05'),
        autoId: '95bab5fc-42cf-4b09-86fe-6742f7547d3f',
        clienteId: 'Usuario2',
        fechaAprobacion: new Date('2025-03-28'),
        montoTotal: 3000,
        kilometrajeInicial: 10000,
        kilometrajeFinal: 10500,
        reservaId: 'reserva02',
        estatus: 'FINALIZADA',
      },
    ],
  });

  // Calificaciones
  await prisma.calificacion.createMany({
    data: [
      {
        id: 'comentario1',
        puntuacion: 5,
        rentaId: 'renta01',
        fechaCreacion: new Date('2025-05-03T15:10:25.140Z'),
        texto: 'Excelente auto, muy cómodo y limpio.',
      },
      {
        id: 'comentario2',
        puntuacion: 3,
        rentaId: 'renta02',
        fechaCreacion: new Date('2025-06-03T17:18:51.501Z'),
        texto: 'No me termino de convencer el auto, pero aun asi no me quejo.',
      },
    ],
  });

  // Comentarios
  await prisma.comentario.createMany({
    data: [
      {
        idComentario: 1,
        contenido: 'Excelente auto, muy cómodo y limpio.',
        fechaCreacion: new Date('2025-06-03T11:20:16'),
        idAuto: '95bab5fc-42cf-4b09-86fe-6742f7547d3f',
        idUsuario: 'Usuario2',
        idCalificacion: 'comentario1',
        idReserva: 'reserva02',
      },
      {
        idComentario: 2,
        contenido: 'No me termino de convencer el auto, pero aun asi no me quejo.',
        fechaCreacion: new Date('2025-06-03T14:44:28'),
        idAuto: 'bc0e0a71-e920-4c3a-ad7b-f64984b8bec7',
        idUsuario: 'Usuario2',
        idCalificacion: 'comentario2',
        idReserva: 'reserva01',
      },
    ],
  });

  console.log('✅ Datos insertados exitosamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());