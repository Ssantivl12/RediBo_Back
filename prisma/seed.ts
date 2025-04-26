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
      },
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '654321987',
        direccion: 'Av. Norte #789',
        contraseña: 'juanpass',
        esAdmin: false,
      },
      {
        nombre: 'María',
        apellido: 'González',
        email: 'maria@example.com',
        telefono: '612345678',
        direccion: 'Calle Este #101',
        contraseña: 'mariapass',
        esAdmin: false,
      },
      {
        nombre: 'Roberto',
        apellido: 'Sánchez',
        email: 'roberto@example.com',
        telefono: '678912345',
        direccion: 'Av. Oeste #202',
        contraseña: 'robpass',
        esAdmin: false,
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
      },
      {
        marca: 'Volkswagen',
        modelo: 'Golf',
        año: 2021,
        placa: 'GHI-8910',
        color: 'Gris',
        precioRentaDiario: 75.00,
        montoGarantia: 350.00,
        estado: EstadoAuto.ACTIVO,
        kilometraje: 8000,
        descripcion: 'Deportivo y ágil.',
        transmision: 'Automática',
        combustible: 'Gasolina',
        capacidad: 5,
        capacidadMaletero: 5,
        tipoAuto: 'Familiar',
        propietarioId: 4
      },
      {
        marca: 'Nissan',
        modelo: 'Sentra',
        año: 2020,
        placa: 'JKL-1112',
        color: 'Plateado',
        precioRentaDiario: 62.50,
        montoGarantia: 275.00,
        estado: EstadoAuto.INACTIVO,
        kilometraje: 22000,
        descripcion: 'Confortable y espacioso.',
        transmision: 'Automática',
        combustible: 'Gasolina',
        capacidad: 5,
        capacidadMaletero: 5,
        tipoAuto: 'Familiar',
        propietarioId: 5
      },
      {
        marca: 'Hyundai',
        modelo: 'Tucson',
        año: 2022,
        placa: 'MNO-1314',
        color: 'Verde',
        precioRentaDiario: 85.00,
        montoGarantia: 400.00,
        estado: EstadoAuto.ACTIVO,
        kilometraje: 5000,
        descripcion: 'SUV familiar con gran espacio.',
        transmision: 'Automática',
        combustible: 'Híbrido',
        capacidad: 7,
        capacidadMaletero: 5,
        tipoAuto: 'Familiar',
        propietarioId: 6
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
        autoId: 1,
        usuarioId: 4,
        contenido: 'Excelente rendimiento de combustible.',
        calificacion: 4
      },
      {
        autoId: 2,
        usuarioId: 1,
        contenido: 'El auto estaba algo sucio, pero funcionaba bien.',
        calificacion: 3
      },
      {
        autoId: 2,
        usuarioId: 5,
        contenido: 'Problemas con el aire acondicionado.',
        calificacion: 2
      },
      {
        autoId: 3,
        usuarioId: 2,
        contenido: 'Excelente experiencia, lo recomiendo.',
        calificacion: 4
      },
      {
        autoId: 3,
        usuarioId: 6,
        contenido: 'Muy cómodo para viajes largos.',
        calificacion: 5
      },
      {
        autoId: 4,
        usuarioId: 3,
        contenido: 'Buen auto para ciudad.',
        calificacion: 4
      },
      {
        autoId: 5,
        usuarioId: 4,
        contenido: 'Divertido de manejar, muy deportivo.',
        calificacion: 5
      },
      {
        autoId: 6,
        usuarioId: 5,
        contenido: 'Espacioso pero con alto consumo.',
        calificacion: 3
      },
      {
        autoId: 7,
        usuarioId: 6,
        contenido: 'Perfecto para familia grande.',
        calificacion: 5
      },
      {
        autoId: 7,
        usuarioId: 1,
        contenido: 'Tecnología avanzada a bordo.',
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
        fechaFin: new Date('2024-12-10'),
        descripcion: 'Cambio de aceite y filtros.',
        costo: 45.00,
        tipoMantenimiento: TipoMantenimiento.PREVENTIVO,
        kilometraje: 14000
      },
      {
        autoId: 1,
        fechaInicio: new Date('2025-03-15'),
        fechaFin: new Date('2025-03-15'),
        descripcion: 'Rotación de llantas.',
        costo: 25.00,
        tipoMantenimiento: TipoMantenimiento.PREVENTIVO,
        kilometraje: 14800
      },
      {
        autoId: 2,
        fechaInicio: new Date('2024-11-01'),
        fechaFin: new Date('2024-11-03'),
        descripcion: 'Reparación del sistema eléctrico.',
        costo: 150.00,
        tipoMantenimiento: TipoMantenimiento.CORRECTIVO,
        kilometraje: 17000
      },
      {
        autoId: 2,
        fechaInicio: new Date('2025-02-20'),
        fechaFin: new Date('2025-02-21'),
        descripcion: 'Reparación de aire acondicionado.',
        costo: 120.00,
        tipoMantenimiento: TipoMantenimiento.CORRECTIVO,
        kilometraje: 17500
      },
      {
        autoId: 3,
        fechaInicio: new Date('2025-01-15'),
        fechaFin: new Date('2025-01-15'),
        descripcion: 'Revisión general anual.',
        costo: 70.00,
        tipoMantenimiento: TipoMantenimiento.REVISION,
        kilometraje: 9500
      },
      {
        autoId: 4,
        fechaInicio: new Date('2025-03-01'),
        fechaFin: new Date('2025-03-01'),
        descripcion: 'Cambio de bujías.',
        costo: 60.00,
        tipoMantenimiento: TipoMantenimiento.PREVENTIVO,
        kilometraje: 11500
      },
      {
        autoId: 5,
        fechaInicio: new Date('2025-04-10'),
        fechaFin: new Date('2025-04-10'),
        descripcion: 'Alineación y balanceo.',
        costo: 55.00,
        tipoMantenimiento: TipoMantenimiento.PREVENTIVO,
        kilometraje: 7500
      },
      {
        autoId: 6,
        fechaInicio: new Date('2025-02-05'),
        fechaFin: new Date('2025-02-07'),
        descripcion: 'Cambio de transmisión.',
        costo: 800.00,
        tipoMantenimiento: TipoMantenimiento.CORRECTIVO,
        kilometraje: 21000
      },
      {
        autoId: 7,
        fechaInicio: new Date('2025-01-20'),
        fechaFin: new Date('2025-01-20'),
        descripcion: 'Primer mantenimiento.',
        costo: 90.00,
        tipoMantenimiento: TipoMantenimiento.PREVENTIVO,
        kilometraje: 4500
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
        autoId: 1,
        fechaInicio: new Date('2025-05-15'),
        fechaFin: new Date('2025-05-20'),
        motivo: MotivoNoDisponibilidad.OTRO,
        descripcion: 'Rentado por cliente.'
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
      },
      {
        autoId: 4,
        fechaInicio: new Date('2025-05-10'),
        fechaFin: new Date('2025-05-15'),
        motivo: MotivoNoDisponibilidad.USO_PERSONAL,
        descripcion: 'Rentado para vacaciones.'
      },
      {
        autoId: 5,
        fechaInicio: new Date('2025-04-30'),
        fechaFin: new Date('2025-05-05'),
        motivo: MotivoNoDisponibilidad.USO_PERSONAL,
        descripcion: 'Viaje familiar del propietario.'
      },
      {
        autoId: 6,
        fechaInicio: new Date('2025-04-15'),
        fechaFin: new Date('2025-05-15'),
        motivo: MotivoNoDisponibilidad.MANTENIMIENTO,
        descripcion: 'Reparación mayor de motor.'
      },
      {
        autoId: 7,
        fechaInicio: new Date('2025-05-01'),
        fechaFin: new Date('2025-05-10'),
        motivo: MotivoNoDisponibilidad.OTRO,
        descripcion: 'Rentado por familia numerosa.'
      }
    ]
  });

  // Imágenes
  await prisma.imagen.createMany({
    data: [
      // Toyota Corolla
      { autoId: 1, direccionImagen: '/imagenesAutos/Toyota/Lado.png' },
      { autoId: 1, direccionImagen: '/imagenesAutos/Toyota/Lateral.png' },
      { autoId: 1, direccionImagen: '/imagenesAutos/Toyota/Parte_posterior.png' },

      
      // Honda Civic
      { autoId: 2, direccionImagen: '/imagenesAutos/Honda/Lateral.jpg' },
      { autoId: 2, direccionImagen: '/imagenesAutos/Honda/Interior.png' },
      { autoId: 2, direccionImagen: '/imagenesAutos/Honda/Interior_sillas.png' },
      
      // Ford Focus
      { autoId: 3, direccionImagen: '/imagenesAutos/Ford/Lateral.jpeg' },
      { autoId: 3, direccionImagen: '/imagenesAutos/Ford/Interior.jpeg' },
      { autoId: 3, direccionImagen: '/imagenesAutos/Ford/Lateral_Trasera.jpeg' },
      { autoId: 3, direccionImagen: '/imagenesAutos/Ford/Vista_Lateral.jpeg' },
      
      // Chevrolet Onix
      { autoId: 4, direccionImagen: '/imagenesAutos/Chevrolet/frontal.png' },
      { autoId: 4, direccionImagen: '/imagenesAutos/Chevrolet/Interior.png' },
      { autoId: 4, direccionImagen: '/imagenesAutos/Chevrolet/Lateral.png' },
      
      // Volkswagen Golf
      { autoId: 5, direccionImagen: '/imagenesAutos/Volkswagen/Frontal.jpg' },
      { autoId: 5, direccionImagen: '/imagenesAutos/Volkswagen/Perfil.jpg' },
      { autoId: 5, direccionImagen: '/imagenesAutos/Volkswagen/Interior_techos.jpg' },
      { autoId: 5, direccionImagen: '/imagenesAutos/Volkswagen/Asientos.jpg' },
      
      // Nissan Sentra
      { autoId: 6, direccionImagen: '/imagenesAutos/Nissan/Frontal.jpg' },
      { autoId: 6, direccionImagen: '/imagenesAutos/Nissan/Lateral.jpg' },
      { autoId: 6, direccionImagen: '/imagenesAutos/Nissan/Panel.jpg' },
      
      // Hyundai Tucson
      { autoId: 7, direccionImagen: '/imagenesAutos/Hyundai/Frontal.jpg' },
      { autoId: 7, direccionImagen: '/imagenesAutos/Hyundai/Interior_espacioso.jpg' },
      { autoId: 7, direccionImagen: '/imagenesAutos/Hyundai/Tercera_fila.jpg' },
      { autoId: 7, direccionImagen: '/imagenesAutos/Hyundai/Maletero.jpg' }
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