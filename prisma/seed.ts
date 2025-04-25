import { PrismaClient, EstadoAuto, MotivoNoDisponibilidad, TipoMantenimiento } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Usuarios
  const usuarios = await prisma.usuario.createMany({
    data: [
      {
        nombre: 'Dieter',
        apellido: 'Olmos Alvarado',
        email: 'carlos@example.com',
        telefono: '65373977',
        direccion: 'Av. Central #123',
        contraseña: 'pass123',
        esAdmin: false,
      },
      {
        nombre: 'Lucía',
        apellido: 'Martínez',
        email: 'lucia@example.com',
        telefono: '987654321',
        direccion: 'Calle Sur #456',
        contraseña: 'pass456',
        esAdmin: true,
      },
      {
        nombre: 'Camila',
        apellido: 'Root',
        email: 'admin@example.com',
        telefono: '79774223',
        direccion: 'sin direccion',
        contraseña: 'adminpass',
        esAdmin: true,
      }
    ]
  });

  // Autos
  const autos = await prisma.auto.createMany({
    data: [
      {
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2020,
        placa: 'ABC-1234',
        color: 'Negro',
        precioRentaDiario: 55.50,
        montoGarantia: 200.00,
        estado: EstadoAuto.ACTIVO,
        kilometraje: 15000,
        descripcion: 'Auto cómodo y económico.',
        transmision: 'Automática',
        combustible: 'Gasolina',
        capacidad: 5,
        capacidadMaletero: 3,
        tipoAuto: 'Familiar',
        propietarioId: 3
      },
      {
        marca: 'Honda',
        modelo: 'Civic',
        año: 2019,
        placa: 'XYZ-5678',
        color: 'Rojo',
        precioRentaDiario: 60.00,
        montoGarantia: 250.00,
        estado: EstadoAuto.INACTIVO,
        kilometraje: 18000,
        descripcion: 'Con buen rendimiento.',
        transmision: 'Manual',
        combustible: 'Gasolina',
        capacidad: 4,
        capacidadMaletero: 4,
        tipoAuto: 'Pequeño',
        propietarioId: 2
      },
      {
        marca: 'Ford',
        modelo: 'Focus',
        año: 2021,
        placa: 'QWE-9876',
        color: 'Blanco',
        precioRentaDiario: 70.00,
        montoGarantia: 300.00,
        estado: EstadoAuto.ACTIVO,
        kilometraje: 10000,
        descripcion: 'Ideal para viajes largos.',
        transmision: 'Automática',
        combustible: 'Diésel',
        capacidad: 5,
        capacidadMaletero: 2,
        tipoAuto: 'Mediano',
        propietarioId: 2
      },
      {
        marca: 'Chevrolet',
        modelo: 'Onix',
        año: 2022,
        placa: 'DEF-4567',
        color: 'Azul',
        precioRentaDiario: 65.00,
        montoGarantia: 220.00,
        estado: EstadoAuto.ACTIVO,
        kilometraje: 12000,
        descripcion: 'Compacto pero eficiente.',
        transmision: 'Manual',
        combustible: 'Gasolina',
        capacidad: 5,
        capacidadMaletero: 5,
        tipoAuto: 'Familiar',
        propietarioId: 3
      }
    ]
  });

  // Comentarios
  await prisma.comentario.createMany({
    data: [
      {
        autoId: 1,
        usuarioId: 2,
        contenido: 'Muy buen auto, limpio y eficiente.',
        calificacion: 5
      },
      {
        autoId: 2,
        usuarioId: 1,
        contenido: 'El auto estaba algo sucio, pero funcionaba bien.',
        calificacion: 3
      },
      {
        autoId: 3,
        usuarioId: 2,
        contenido: 'Excelente experiencia, lo recomiendo.',
        calificacion: 4
      }
    ]
  });

  // Historial de Mantenimiento
  await prisma.historialMantenimiento.createMany({
    data: [
      {
        autoId: 1,
        fechaInicio: new Date('2024-12-10'),
        descripcion: 'Cambio de aceite y filtros.',
        costo: 45.00,
        tipoMantenimiento: TipoMantenimiento.PREVENTIVO,
        kilometraje: 14000
      },
      {
        autoId: 2,
        fechaInicio: new Date('2024-11-01'),
        descripcion: 'Reparación del sistema eléctrico.',
        costo: 150.00,
        tipoMantenimiento: TipoMantenimiento.CORRECTIVO,
        kilometraje: 17000
      },
      {
        autoId: 3,
        fechaInicio: new Date('2025-01-15'),
        descripcion: 'Revisión general anual.',
        costo: 70.00,
        tipoMantenimiento: TipoMantenimiento.REVISION,
        kilometraje: 9500
      }
    ]
  });

  // Disponibilidad
  await prisma.disponibilidad.createMany({
    data: [
      {
        autoId: 1,
        fechaInicio: new Date('2025-04-20'),
        fechaFin: new Date('2025-04-22'),
        motivo: MotivoNoDisponibilidad.USO_PERSONAL,
        descripcion: 'Viaje del dueño.'
      },
      {
        autoId: 2,
        fechaInicio: new Date('2025-05-01'),
        fechaFin: new Date('2025-05-03'),
        motivo: MotivoNoDisponibilidad.MANTENIMIENTO,
        descripcion: 'Revisión de frenos.'
      },
      {
        autoId: 3,
        fechaInicio: new Date('2025-04-25'),
        fechaFin: new Date('2025-04-28'),
        motivo: MotivoNoDisponibilidad.OTRO,
        descripcion: 'Reservado para evento de empresa.'
      }
    ]
  });

  // Imágenes
  await prisma.imagen.createMany({
    data: [
      { autoId: 1, direccionImagen: '/imagenesAutos/Toyota/Lado.png' },
      { autoId: 1, direccionImagen: '/imagenesAutos/Toyota/Lateral.png' },
      { autoId: 1, direccionImagen: '/imagenesAutos/Toyota/Parte_posterior.png' },
      { autoId: 2, direccionImagen: '/imagenesAutos/Honda/Lateral.jpg' },
      { autoId: 2, direccionImagen: '/imagenesAutos/Honda/Interior.png' },
      { autoId: 2, direccionImagen: '/imagenesAutos/Honda/Interior_sillas.png' },
      { autoId: 3, direccionImagen: '/imagenesAutos/Ford/Lateral.jpeg' },
      { autoId: 3, direccionImagen: '/imagenesAutos/Ford/Interior.jpeg' },
      { autoId: 3, direccionImagen: '/imagenesAutos/Ford/Lateral_Trasera.jpeg' },
      { autoId: 3, direccionImagen: '/imagenesAutos/Ford/Vista_Lateral.jpeg' },
      { autoId: 4, direccionImagen: '/imagenesAutos/Chevrolet/frontal.png' },
      { autoId: 4, direccionImagen: '/imagenesAutos/Chevrolet/Interior.png' },
      { autoId: 4, direccionImagen: '/imagenesAutos/Chevrolet/Lateral.png' }
    ]
  });
}

main()
  .then(() => {
    console.log('Datos insertados con éxito 🚀');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });