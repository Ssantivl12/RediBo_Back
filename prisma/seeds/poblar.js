import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt'; 

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando proceso de seed...');

  // Limpia la base de datos para un inicio fresco
  console.log('🧹 Limpiando datos existentes...');
  await prisma.comentario.deleteMany();
  await prisma.garantia.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.historialMantenimiento.deleteMany();
  await prisma.renta.deleteMany();
  await prisma.auto.deleteMany();
  await prisma.usuario.deleteMany();

  // usuarios de ejemplo
  console.log('👤 Creando usuarios...');
  const adminUser = await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@redibo.com',
      telefono: '555-123-4567',
      contraseña: hashSync('admin123', 10),
      esAdmin: true,
      direccion: 'Calle Principal #123'
    }
  });

  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '555-987-6543',
      contraseña: hashSync('password123', 10),
      direccion: 'Av. Reforma #456'
    }
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nombre: 'María',
      apellido: 'González',
      email: 'maria@example.com',
      telefono: '555-567-8901',
      contraseña: hashSync('password123', 10),
      direccion: 'Calle Norte #789'
    }
  });

  // autos de ejemplo
  console.log('🚗 Creando automóviles...');
  const auto1 = await prisma.auto.create({
    data: {
      marca: 'Toyota',
      modelo: 'Corolla',
      año: 2022,
      placa: 'ABC-123',
      color: 'Rojo',
      precioRentaDiario: 50.00,
      montoGarantia: 500.00,
      propietarioId: adminUser.id,
      descripcion: 'Sedán compacto, ideal para ciudad. Excelente rendimiento de combustible.',
      imagenes: 'corolla_red_2022.jpg',
      kilometraje: 15000
    }
  });

  const auto2 = await prisma.auto.create({
    data: {
      marca: 'Honda',
      modelo: 'CR-V',
      año: 2021,
      placa: 'XYZ-789',
      color: 'Azul',
      precioRentaDiario: 75.00,
      montoGarantia: 750.00,
      propietarioId: adminUser.id,
      descripcion: 'SUV espaciosa con características de seguridad avanzadas.',
      imagenes: 'crv_blue_2021.jpg',
      kilometraje: 20000
    }
  });

  const auto3 = await prisma.auto.create({
    data: {
      marca: 'Nissan',
      modelo: 'Sentra',
      año: 2023,
      placa: 'DEF-456',
      color: 'Blanco',
      precioRentaDiario: 45.00,
      montoGarantia: 450.00,
      propietarioId: usuario1.id,
      descripcion: 'Sedán económico, perfecto para viajes largos.',
      imagenes: 'sentra_white_2023.jpg',
      kilometraje: 5000
    }
  });

  // rentas de ejemplo
  console.log('📝 Creando rentas...');
  
  // Renta en curso
  const rentaEnCurso = await prisma.renta.create({
    data: {
      fechaInicio: new Date(2025, 3, 1), // desde el 1 de abril 2025
      fechaFin: new Date(2025, 3, 10), // desde el 10 de abril 2025
      autoId: auto1.id,
      clienteId: usuario2.id,
      estatus: 'EN_CURSO',
      montoTotal: 500.00,
      fechaAprobacion: new Date(2025, 2, 25), // cuando fue aprobado, 25 de marzo
      kilometrajeInicial: 15000
    }
  });

  // Renta finalizada
  const rentaFinalizada = await prisma.renta.create({
    data: {
      fechaInicio: new Date(2025, 2, 10), // desde el 10 de marzo 2025
      fechaFin: new Date(2025, 2, 15), // hasta 15 de marzo 2025
      autoId: auto2.id,
      clienteId: usuario1.id,
      estatus: 'FINALIZADA',
      montoTotal: 375.00,
      fechaAprobacion: new Date(2025, 2, 5), // 5 de marzo 2025
      kilometrajeInicial: 20000,
      kilometrajeFinal: 20300
    }
  });

  // Crea pagos de ejemplo
  console.log('💰 Creando pagos...');
  await prisma.pago.create({
    data: {
      rentaId: rentaEnCurso.id,
      monto: 500.00,
      metodoPago: 'QR',
      referencia: 'REF-12345',
      comprobante: 'comprobante_pago_12345.jpg'
    }
  });

  await prisma.pago.create({
    data: {
      rentaId: rentaFinalizada.id,
      monto: 375.00,
      metodoPago: 'TARJETA_DEBITO',
      referencia: 'REF-67890',
      comprobante: 'comprobante_pago_67890.jpg'
    }
  });

  // Crea garantías de ejemplo
  console.log('🔒 Creando garantías...');
  await prisma.garantia.create({
    data: {
      rentaId: rentaEnCurso.id,
      monto: 500.00,
      estatus: 'DEPOSITADA',
      comprobante: 'comprobante_garantia_12345.jpg'
    }
  });

  await prisma.garantia.create({
    data: {
      rentaId: rentaFinalizada.id,
      monto: 750.00,
      estatus: 'LIBERADA',
      fechaLiberacion: new Date(2025, 2, 16), // 16 de marzo 2025
      comprobante: 'comprobante_garantia_67890.jpg'
    }
  });

  // Crea mantenimientos de ejemplo
  console.log('🔧 Creando registros de mantenimiento...');
  await prisma.historialMantenimiento.create({
    data: {
      autoId: auto1.id,
      descripcion: 'Cambio de aceite y filtros',
      tipoMantenimiento: 'PREVENTIVO',
      costo: 120.00,
      kilometraje: 10000,
      fechaFin: new Date(2025, 1, 15) // 15 de febrero 2025
    }
  });

  await prisma.historialMantenimiento.create({
    data: {
      autoId: auto2.id,
      descripcion: 'Reparación de frenos',
      tipoMantenimiento: 'CORRECTIVO',
      costo: 350.00,
      kilometraje: 18000,
      fechaFin: new Date(2025, 2, 5) // 5 de marzo 2025
    }
  });

  // Crea comentarios y calificaciones de ejemplo
  console.log('💬 Creando comentarios...');
  await prisma.comentario.create({
    data: {
      autoId: auto2.id,
      usuarioId: usuario1.id,
      contenido: 'Excelente vehículo, muy cómodo y económico.',
      calificacion: 5,
      rentaId: rentaFinalizada.id
    }
  });

  await prisma.comentario.create({
    data: {
      autoId: auto1.id,
      usuarioId: usuario2.id,
      contenido: 'Buen auto, aunque el aire acondicionado no funciona al 100%.',
      calificacion: 4
    }
  });

  console.log('✅ Seed completado con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerrar la conexión de Prisma al finalizar
    await prisma.$disconnect();
  });