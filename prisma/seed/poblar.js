// prisma/seed/index.ts
import { PrismaClient, EstadoAuto, EstadoReserva, MetodoPago, TipoMantenimiento, EstadoGarantia, MotivoNoDisponibilidad, TipoPago } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la siembra de datos...');

  // Crear usuarios
  const passwordHash = await hash('password123', 10);
  
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@rentaautos.com',
      telefono: '555-123-4567',
      direccion: 'Av. Principal #123',
      contraseña: passwordHash,
      esAdmin: true,
    }
  });

  const propietario1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '555-987-6543',
      direccion: 'Calle Norte #456',
      contraseña: passwordHash,
    }
  });

  const propietario2 = await prisma.usuario.create({
    data: {
      nombre: 'María',
      apellido: 'González',
      email: 'maria@example.com',
      telefono: '555-567-8901',
      direccion: 'Av. Sur #789',
      contraseña: passwordHash,
    }
  });

  const cliente1 = await prisma.usuario.create({
    data: {
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      email: 'carlos@example.com',
      telefono: '555-234-5678',
      direccion: 'Calle Este #345',
      contraseña: passwordHash,
    }
  });

  const cliente2 = await prisma.usuario.create({
    data: {
      nombre: 'Ana',
      apellido: 'Martínez',
      email: 'ana@example.com',
      telefono: '555-876-5432',
      direccion: 'Av. Oeste #678',
      contraseña: passwordHash,
    }
  });

  console.log('Usuarios creados.');

  // Crear autos
  const auto1 = await prisma.auto.create({
    data: {
      marca: 'Toyota',
      modelo: 'Corolla',
      año: 2022,
      placa: 'ABC-123',
      color: 'Blanco',
      precioRentaDiario: 350.00,
      montoGarantia: 5000.00,
      estado: EstadoAuto.ACTIVO,
      kilometraje: 15000,
      descripcion: 'Sedán compacto, perfecto para ciudad, consumo eficiente de combustible.',
      propietarioId: propietario1.id,
      imagenes: 'toyota_corolla_2022.jpg',
    }
  });

  const auto2 = await prisma.auto.create({
    data: {
      marca: 'Honda',
      modelo: 'CR-V',
      año: 2021,
      placa: 'XYZ-789',
      color: 'Gris',
      precioRentaDiario: 450.00,
      montoGarantia: 6000.00,
      estado: EstadoAuto.ACTIVO,
      kilometraje: 20000,
      descripcion: 'SUV espaciosa, ideal para viajes familiares con amplio espacio para equipaje.',
      propietarioId: propietario1.id,
      imagenes: 'honda_crv_2021.jpg',
    }
  });

  const auto3 = await prisma.auto.create({
    data: {
      marca: 'Nissan',
      modelo: 'Sentra',
      año: 2020,
      placa: 'DEF-456',
      color: 'Azul',
      precioRentaDiario: 300.00,
      montoGarantia: 4500.00,
      estado: EstadoAuto.ACTIVO,
      kilometraje: 30000,
      descripcion: 'Sedán de tamaño medio con excelente rendimiento de combustible.',
      propietarioId: propietario2.id,
      imagenes: 'nissan_sentra_2020.jpg',
    }
  });

  const auto4 = await prisma.auto.create({
    data: {
      marca: 'Ford',
      modelo: 'Escape',
      año: 2022,
      placa: 'GHI-789',
      color: 'Rojo',
      precioRentaDiario: 400.00,
      montoGarantia: 5500.00,
      estado: EstadoAuto.INACTIVO,
      kilometraje: 12000,
      descripcion: 'SUV compacta con características de seguridad avanzadas.',
      propietarioId: propietario2.id,
      imagenes: 'ford_escape_2022.jpg',
    }
  });

  console.log('Autos creados.');

  // Crear periodos de no disponibilidad
  await prisma.disponibilidad.create({
    data: {
      autoId: auto4.id,
      fechaInicio: new Date('2025-04-15'),
      fechaFin: new Date('2025-04-30'),
      motivo: MotivoNoDisponibilidad.MANTENIMIENTO,
      descripcion: 'Mantenimiento programado anual',
    }
  });

  await prisma.disponibilidad.create({
    data: {
      autoId: auto2.id,
      fechaInicio: new Date('2025-05-10'),
      fechaFin: new Date('2025-05-15'),
      motivo: MotivoNoDisponibilidad.USO_PERSONAL,
      descripcion: 'Uso por parte del propietario',
    }
  });

  console.log('Periodos de no disponibilidad creados.');

  // Crear reservas (diferentes estados)
  // 1. Reserva solicitada (aún no aprobada)
  const reserva1 = await prisma.reserva.create({
    data: {
      fechaInicio: new Date('2025-05-01'),
      fechaFin: new Date('2025-05-05'),
      autoId: auto1.id,
      clienteId: cliente1.id,
      estado: EstadoReserva.SOLICITADA,
      fechaLimitePago: new Date('2025-04-25'),
      montoTotal: 1750.00, // 5 días * 350
    }
  });

  // 2. Reserva aprobada pero no pagada
  const reserva2 = await prisma.reserva.create({
    data: {
      fechaInicio: new Date('2025-05-10'),
      fechaFin: new Date('2025-05-15'),
      autoId: auto1.id,
      clienteId: cliente2.id,
      estado: EstadoReserva.APROBADA,
      fechaAprobacion: new Date('2025-04-10'),
      fechaLimitePago: new Date('2025-05-01'),
      montoTotal: 1750.00, // 5 días * 350
    }
  });

  // 3. Reserva confirmada (pagada)
  const reserva3 = await prisma.reserva.create({
    data: {
      fechaInicio: new Date('2025-06-01'),
      fechaFin: new Date('2025-06-05'),
      autoId: auto3.id,
      clienteId: cliente1.id,
      estado: EstadoReserva.CONFIRMADA,
      fechaAprobacion: new Date('2025-04-05'),
      fechaLimitePago: new Date('2025-05-15'),
      montoTotal: 1500.00, // 5 días * 300
      estaPagada: true,
    }
  });

  // 4. Reserva en curso
  const reserva4 = await prisma.reserva.create({
    data: {
      fechaInicio: new Date('2025-04-10'),
      fechaFin: new Date('2025-04-20'),
      autoId: auto2.id,
      clienteId: cliente2.id,
      estado: EstadoReserva.EN_CURSO,
      fechaAprobacion: new Date('2025-03-15'),
      fechaLimitePago: new Date('2025-04-01'),
      montoTotal: 4500.00, // 10 días * 450
      estaPagada: true,
      kilometrajeInicial: 20000,
    }
  });

  // 5. Reserva finalizada
  const reserva5 = await prisma.reserva.create({
    data: {
      fechaInicio: new Date('2025-03-01'),
      fechaFin: new Date('2025-03-05'),
      autoId: auto3.id,
      clienteId: cliente1.id,
      estado: EstadoReserva.FINALIZADA,
      fechaAprobacion: new Date('2025-02-15'),
      fechaLimitePago: new Date('2025-02-25'),
      montoTotal: 1500.00, // 5 días * 300
      estaPagada: true,
      kilometrajeInicial: 29000,
      kilometrajeFinal: 29800,
    }
  });

  // 6. Reserva cancelada
  const reserva6 = await prisma.reserva.create({
    data: {
      fechaInicio: new Date('2025-04-25'),
      fechaFin: new Date('2025-04-30'),
      autoId: auto1.id,
      clienteId: cliente2.id,
      estado: EstadoReserva.CANCELADA,
      fechaAprobacion: new Date('2025-04-01'),
      fechaLimitePago: new Date('2025-04-15'),
      montoTotal: 1750.00, // 5 días * 350
    }
  });

  console.log('Reservas creadas.');

  // Crear pagos
  await prisma.pago.create({
    data: {
      reservaId: reserva3.id,
      monto: 1500.00,
      metodoPago: MetodoPago.QR,
      referencia: 'PAG-12345',
      comprobante: 'comprobante_12345.jpg',
      tipo: TipoPago.RENTA,
    }
  });

  await prisma.pago.create({
    data: {
      reservaId: reserva4.id,
      monto: 4500.00,
      metodoPago: MetodoPago.TARJETA_DEBITO,
      referencia: 'PAG-67890',
      comprobante: 'comprobante_67890.jpg',
      tipo: TipoPago.RENTA,
    }
  });

  await prisma.pago.create({
    data: {
      reservaId: reserva5.id,
      monto: 1500.00,
      metodoPago: MetodoPago.QR,
      referencia: 'PAG-24680',
      comprobante: 'comprobante_24680.jpg',
      tipo: TipoPago.RENTA,
    }
  });

  console.log('Pagos creados.');

  // Crear garantías
  await prisma.garantia.create({
    data: {
      reservaId: reserva3.id,
      monto: 4500.00,
      estado: EstadoGarantia.DEPOSITADA,
      comprobante: 'garantia_12345.jpg',
    }
  });

  await prisma.garantia.create({
    data: {
      reservaId: reserva4.id,
      monto: 6000.00,
      estado: EstadoGarantia.DEPOSITADA,
      comprobante: 'garantia_67890.jpg',
    }
  });

  await prisma.garantia.create({
    data: {
      reservaId: reserva5.id,
      monto: 4500.00,
      estado: EstadoGarantia.LIBERADA,
      fechaLiberacion: new Date('2025-03-06'),
      comprobante: 'garantia_24680.jpg',
    }
  });

  console.log('Garantías creadas.');

  // Crear historial de mantenimiento
  await prisma.historialMantenimiento.create({
    data: {
      autoId: auto1.id,
      fechaInicio: new Date('2024-12-10'),
      fechaFin: new Date('2024-12-12'),
      descripcion: 'Cambio de aceite y filtros',
      costo: 800.00,
      tipoMantenimiento: TipoMantenimiento.PREVENTIVO,
      kilometraje: 10000,
    }
  });

  await prisma.historialMantenimiento.create({
    data: {
      autoId: auto2.id,
      fechaInicio: new Date('2025-01-15'),
      fechaFin: new Date('2025-01-18'),
      descripcion: 'Reparación de sistema de frenos',
      costo: 2500.00,
      tipoMantenimiento: TipoMantenimiento.CORRECTIVO,
      kilometraje: 18000,
    }
  });

  await prisma.historialMantenimiento.create({
    data: {
      autoId: auto3.id,
      fechaInicio: new Date('2025-02-20'),
      descripcion: 'Revisión general programada',
      costo: 1200.00,
      tipoMantenimiento: TipoMantenimiento.REVISION,
      kilometraje: 28000,
    }
  });

  console.log('Historial de mantenimiento creado.');

  // Crear comentarios
  await prisma.comentario.create({
    data: {
      autoId: auto1.id,
      usuarioId: cliente1.id,
      contenido: 'Excelente auto, muy cómodo y económico.',
      calificacion: 5,
    }
  });

  await prisma.comentario.create({
    data: {
      autoId: auto2.id,
      usuarioId: cliente2.id,
      contenido: 'Muy espacioso, perfecto para nuestro viaje familiar.',
      calificacion: 5,
    }
  });

  await prisma.comentario.create({
    data: {
      autoId: auto3.id,
      usuarioId: cliente1.id,
      contenido: 'Buen auto, aunque el consumo de combustible fue mayor al esperado.',
      calificacion: 4,
      reservaId: reserva5.id,
    }
  });

  console.log('Comentarios creados.');

  console.log('¡Siembra de datos completada con éxito!');
}

main()
  .catch((e) => {
    console.error('Error durante la siembra de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });