import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.calificacionUsuario.deleteMany();
  await prisma.comentario.deleteMany();
  await prisma.historialMantenimiento.deleteMany();
  await prisma.garantia.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.disponibilidad.deleteMany();
  await prisma.imagen.deleteMany();
  await prisma.auto.deleteMany();
  await prisma.usuarioDriver.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.terminosCondiciones.deleteMany();
  await prisma.verificaciones.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.ubicacion.deleteMany();

  // 1. Crear ubicaciones
  console.log('📍 Creando ubicaciones...');
  const ubicaciones = await Promise.all([
    prisma.ubicacion.create({
      data: {
        nombre: 'Centro de Cochabamba',
        descripcion: 'Zona céntrica de la ciudad',
        latitud: -17.3935,
        longitud: -66.1570,
        esActiva: true
      }
    }),
    prisma.ubicacion.create({
      data: {
        nombre: 'Aeropuerto Jorge Wilstermann',
        descripcion: 'Terminal aéreo de Cochabamba',
        latitud: -17.4211,
        longitud: -66.1711,
        esActiva: true
      }
    }),
    prisma.ubicacion.create({
      data: {
        nombre: 'Zona Norte',
        descripcion: 'Barrios residenciales del norte',
        latitud: -17.3500,
        longitud: -66.1600,
        esActiva: true
      }
    }),
    prisma.ubicacion.create({
      data: {
        nombre: 'Quillacollo',
        descripcion: 'Municipio cercano a Cochabamba',
        latitud: -17.3925,
        longitud: -66.2781,
        esActiva: true
      }
    }),
    prisma.ubicacion.create({
      data: {
        nombre: 'Sacaba',
        descripcion: 'Municipio del área metropolitana',
        latitud: -17.3978,
        longitud: -66.0389,
        esActiva: true
      }
    })
  ]);

  // 2. Crear usuarios
  console.log('👥 Creando usuarios...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const usuarios = await Promise.all([
    // Admin
    prisma.usuario.create({
      data: {
        nombreCompleto: 'Administrador Sistema',
        email: 'admin@rentacar.bo',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1985-05-15'),
        telefono: '70123456',
        registradoCon: 'email',
        verificado: true,
        esAdmin: true,
        fotoPerfil: 'ruta1',
        direccion: 'Av. América #123',
        metodoPago: 'TARJETA_DEBITO',
        numeroTarjeta: '4532123456789012',
        fechaExpiracion: '12/26',
        titular: 'Administrador Sistema'
      }
    }),
    // Propietarios/Hosts
    prisma.usuario.create({
      data: {
        nombreCompleto: 'Carlos Mendoza',
        email: 'carlos.mendoza@email.com',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1980-03-20'),
        telefono: '70234567',
        registradoCon: 'email',
        verificado: true,
        host: true,
        fotoPerfil: 'ruta2',
        direccion: 'Calle Bolívar #456',
        metodoPago: 'QR',
        imagenQr: 'ruta3'
      }
    }),
    prisma.usuario.create({
      data: {
        nombreCompleto: 'Ana García',
        email: 'ana.garcia@email.com',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1988-07-12'),
        telefono: '70345678',
        registradoCon: 'email',
        verificado: true,
        host: true,
        fotoPerfil: 'ruta4',
        direccion: 'Av. Heroínas #789',
        metodoPago: 'TARJETA_DEBITO',
        numeroTarjeta: '5555444433332222',
        fechaExpiracion: '08/27',
        titular: 'Ana García'
      }
    }),
    prisma.usuario.create({
      data: {
        nombreCompleto: 'Roberto Silva',
        email: 'roberto.silva@email.com',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1975-11-08'),
        telefono: '70456789',
        registradoCon: 'email',
        verificado: true,
        host: true,
        fotoPerfil: 'ruta5',
        direccion: 'Calle Sucre #321',
        metodoPago: 'EFECTIVO'
      }
    }),
    // Clientes
    prisma.usuario.create({
      data: {
        nombreCompleto: 'María López',
        email: 'maria.lopez@email.com',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1992-01-25'),
        telefono: '70567890',
        registradoCon: 'google',
        verificado: true,
        fotoPerfil: 'ruta6',
        direccion: 'Av. Ayacucho #654',
        metodoPago: 'QR',
        imagenQr: 'ruta7'
      }
    }),
    prisma.usuario.create({
      data: {
        nombreCompleto: 'Pedro Chávez',
        email: 'pedro.chavez@email.com',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1987-09-14'),
        telefono: '70678901',
        registradoCon: 'email',
        verificado: true,
        fotoPerfil: 'ruta8',
        direccion: 'Calle España #987',
        metodoPago: 'TARJETA_DEBITO',
        numeroTarjeta: '4111111111111111',
        fechaExpiracion: '03/28',
        titular: 'Pedro Chávez'
      }
    }),
    prisma.usuario.create({
      data: {
        nombreCompleto: 'Laura Morales',
        email: 'laura.morales@email.com',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1990-12-03'),
        telefono: '70789012',
        registradoCon: 'email',
        verificado: true,
        fotoPerfil: 'ruta9',
        direccion: 'Av. Ballivián #147',
        metodoPago: 'QR',
        imagenQr: 'ruta10'
      }
    }),
    // Drivers
    prisma.usuario.create({
      data: {
        nombreCompleto: 'Luis Vargas',
        email: 'luis.vargas@email.com',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1983-06-18'),
        telefono: '70890123',
        registradoCon: 'email',
        verificado: true,
        driverBool: true,
        fotoPerfil: 'ruta11',
        direccion: 'Calle Antezana #258',
        metodoPago: 'EFECTIVO'
      }
    }),
    prisma.usuario.create({
      data: {
        nombreCompleto: 'Diego Rojas',
        email: 'diego.rojas@email.com',
        contraseña: hashedPassword,
        fechaNacimiento: new Date('1986-04-22'),
        telefono: '70901234',
        registradoCon: 'email',
        verificado: true,
        driverBool: true,
        fotoPerfil: 'ruta12',
        direccion: 'Av. Oquendo #369',
        metodoPago: 'QR',
        imagenQr: 'ruta13'
      }
    })
  ]);

  // 3. Crear drivers
  console.log('🚗 Creando drivers...');
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        idUsuario: usuarios[7].idUsuario, // Luis Vargas
        sexo: 'M',
        telefono: '70890123',
        licencia: 'CB123456789',
        fechaEmision: new Date('2015-03-15'),
        fechaExpiracion: new Date('2030-03-15'),
        tipoLicencia: 'Profesional',
        añosExperiencia: 10,
        disponible: true,
        anversoUrl: 'ruta14',
        reversoUrl: 'ruta15'
      }
    }),
    prisma.driver.create({
      data: {
        idUsuario: usuarios[8].idUsuario, // Diego Rojas
        sexo: 'M',
        telefono: '70901234',
        licencia: 'CB987654321',
        fechaEmision: new Date('2018-07-20'),
        fechaExpiracion: new Date('2033-07-20'),
        tipoLicencia: 'Particular',
        añosExperiencia: 7,
        disponible: true,
        anversoUrl: 'ruta16',
        reversoUrl: 'ruta17'
      }
    })
  ]);

  // 4. Asignar drivers a usuarios
  console.log('🔗 Asignando drivers a usuarios...');
  await Promise.all([
    prisma.usuarioDriver.create({
      data: {
        idUsuario: usuarios[4].idUsuario, // María López
        idDriver: drivers[0].idDriver
      }
    }),
    prisma.usuarioDriver.create({
      data: {
        idUsuario: usuarios[5].idUsuario, // Pedro Chávez
        idDriver: drivers[1].idDriver
      }
    })
  ]);

  // 5. Crear autos
  console.log('🚙 Creando autos...');
  const autos = await Promise.all([
    prisma.auto.create({
      data: {
        idPropietario: usuarios[1].idUsuario, // Carlos Mendoza
        idUbicacion: ubicaciones[0].idUbicacion,
        marca: 'Toyota',
        modelo: 'Corolla',
        descripcion: 'Sedán cómodo y económico, ideal para la ciudad',
        precioRentaDiario: 250.00,
        montoGarantia: 1000.00,
        kilometraje: 45000,
        tipo: 'Sedán',
        año: 2020,
        placa: 'CBB-1234',
        soat: 'SOAT123456',
        color: 'Blanco',
        asientos: 5,
        capacidadMaletero: 470,
        transmision: 'AUTOMATICO',
        combustible: 'GASOLINA',
        calificacionPromedio: 4.2,
        totalComentarios: 8,
        diasTotalRenta: 45,
        vecesAlquilado: 12
      }
    }),
    prisma.auto.create({
      data: {
        idPropietario: usuarios[1].idUsuario, // Carlos Mendoza
        idUbicacion: ubicaciones[1].idUbicacion,
        marca: 'Hyundai',
        modelo: 'Tucson',
        descripcion: 'SUV espaciosa perfecta para viajes familiares',
        precioRentaDiario: 400.00,
        montoGarantia: 1500.00,
        kilometraje: 32000,
        tipo: 'SUV',
        año: 2021,
        placa: 'CBB-5678',
        soat: 'SOAT789012',
        color: 'Negro',
        asientos: 7,
        capacidadMaletero: 620,
        transmision: 'AUTOMATICO',
        combustible: 'GASOLINA',
        calificacionPromedio: 4.7,
        totalComentarios: 15,
        diasTotalRenta: 78,
        vecesAlquilado: 18
      }
    }),
    prisma.auto.create({
      data: {
        idPropietario: usuarios[2].idUsuario, // Ana García
        idUbicacion: ubicaciones[2].idUbicacion,
        marca: 'Chevrolet',
        modelo: 'Spark',
        descripcion: 'Auto compacto y eficiente para uso urbano',
        precioRentaDiario: 180.00,
        montoGarantia: 800.00,
        kilometraje: 28000,
        tipo: 'Hatchback',
        año: 2019,
        placa: 'CBB-9012',
        soat: 'SOAT345678',
        color: 'Rojo',
        asientos: 4,
        capacidadMaletero: 267,
        transmision: 'MANUAL',
        combustible: 'GASOLINA',
        calificacionPromedio: 4.0,
        totalComentarios: 6,
        diasTotalRenta: 32,
        vecesAlquilado: 8
      }
    }),
    prisma.auto.create({
      data: {
        idPropietario: usuarios[2].idUsuario, // Ana García
        idUbicacion: ubicaciones[3].idUbicacion,
        marca: 'Ford',
        modelo: 'EcoSport',
        descripcion: 'SUV compacta ideal para aventuras',
        precioRentaDiario: 320.00,
        montoGarantia: 1200.00,
        kilometraje: 41000,
        tipo: 'SUV Compacta',
        año: 2020,
        placa: 'CBB-3456',
        soat: 'SOAT901234',
        color: 'Azul',
        asientos: 5,
        capacidadMaletero: 334,
        transmision: 'MANUAL',
        combustible: 'GASOLINA',
        calificacionPromedio: 4.3,
        totalComentarios: 11,
        diasTotalRenta: 56,
        vecesAlquilado: 14
      }
    }),
    prisma.auto.create({
      data: {
        idPropietario: usuarios[3].idUsuario, // Roberto Silva
        idUbicacion: ubicaciones[4].idUbicacion,
        marca: 'Nissan',
        modelo: 'Sentra',
        descripcion: 'Sedán moderno con excelente rendimiento',
        precioRentaDiario: 280.00,
        montoGarantia: 1100.00,
        kilometraje: 35000,
        tipo: 'Sedán',
        año: 2021,
        placa: 'CBB-7890',
        soat: 'SOAT567890',
        color: 'Gris',
        asientos: 5,
        capacidadMaletero: 508,
        transmision: 'AUTOMATICO',
        combustible: 'GASOLINA',
        calificacionPromedio: 4.5,
        totalComentarios: 13,
        diasTotalRenta: 67,
        vecesAlquilado: 16
      }
    }),
    prisma.auto.create({
      data: {
        idPropietario: usuarios[3].idUsuario, // Roberto Silva
        idUbicacion: ubicaciones[0].idUbicacion,
        marca: 'Volkswagen',
        modelo: 'Gol',
        descripcion: 'Auto confiable y económico',
        precioRentaDiario: 200.00,
        montoGarantia: 900.00,
        kilometraje: 52000,
        tipo: 'Hatchback',
        año: 2018,
        placa: 'CBB-2468',
        soat: 'SOAT135792',
        color: 'Blanco',
        asientos: 5,
        capacidadMaletero: 285,
        transmision: 'MANUAL',
        combustible: 'GASOLINA',
        calificacionPromedio: 3.8,
        totalComentarios: 9,
        diasTotalRenta: 41,
        vecesAlquilado: 11
      }
    })
  ]);

  // 6. Crear imágenes de autos
  console.log('📸 Creando imágenes de autos...');
  for (let i = 0; i < autos.length; i++) {
    await Promise.all([
      prisma.imagen.create({
        data: {
          idAuto: autos[i].idAuto,
          direccionImagen: `ruta${18 + i * 4}`
        }
      }),
      prisma.imagen.create({
        data: {
          idAuto: autos[i].idAuto,
          direccionImagen: `ruta${19 + i * 4}`
        }
      }),
      prisma.imagen.create({
        data: {
          idAuto: autos[i].idAuto,
          direccionImagen: `ruta${20 + i * 4}`
        }
      }),
      prisma.imagen.create({
        data: {
          idAuto: autos[i].idAuto,
          direccionImagen: `ruta${21 + i * 4}`
        }
      })
    ]);
  }

  // 7. Crear disponibilidades (períodos no disponibles)
  console.log('📅 Creando disponibilidades...');
  await Promise.all([
    prisma.disponibilidad.create({
      data: {
        idAuto: autos[0].idAuto,
        fechaInicio: new Date('2025-06-15'),
        fechaFin: new Date('2025-06-18'),
        motivo: 'MANTENIMIENTO',
        descripcion: 'Mantenimiento preventivo programado'
      }
    }),
    prisma.disponibilidad.create({
      data: {
        idAuto: autos[2].idAuto,
        fechaInicio: new Date('2025-07-01'),
        fechaFin: new Date('2025-07-05'),
        motivo: 'USO_PERSONAL',
        descripcion: 'Viaje familiar del propietario'
      }
    })
  ]);

  // 8. Crear reservas
  console.log('📋 Creando reservas...');
  const reservas = await Promise.all([
    // Reserva finalizada
    prisma.reserva.create({
      data: {
        fechaInicio: new Date('2025-05-01'),
        fechaFin: new Date('2025-05-05'),
        idAuto: autos[0].idAuto,
        idCliente: usuarios[4].idUsuario, // María López
        estado: 'FINALIZADA',
        fechaSolicitud: new Date('2025-04-25'),
        fechaAprobacion: new Date('2025-04-26'),
        fechaLimitePago: new Date('2025-04-28'),
        montoTotal: 1000.00,
        kilometrajeInicial: 45000,
        kilometrajeFinal: 45320,
        estaPagada: true
      }
    }),
    // Reserva en curso
    prisma.reserva.create({
      data: {
        fechaInicio: new Date('2025-05-28'),
        fechaFin: new Date('2025-06-02'),
        idAuto: autos[1].idAuto,
        idCliente: usuarios[5].idUsuario, // Pedro Chávez
        estado: 'EN_CURSO',
        fechaSolicitud: new Date('2025-05-20'),
        fechaAprobacion: new Date('2025-05-21'),
        fechaLimitePago: new Date('2025-05-23'),
        montoTotal: 2000.00,
        kilometrajeInicial: 32000,
        estaPagada: true
      }
    }),
    // Reserva confirmada
    prisma.reserva.create({
      data: {
        fechaInicio: new Date('2025-06-10'),
        fechaFin: new Date('2025-06-12'),
        idAuto: autos[2].idAuto,
        idCliente: usuarios[6].idUsuario, // Laura Morales
        estado: 'CONFIRMADA',
        fechaSolicitud: new Date('2025-05-25'),
        fechaAprobacion: new Date('2025-05-26'),
        fechaLimitePago: new Date('2025-05-28'),
        montoTotal: 540.00,
        estaPagada: true
      }
    }),
    // Reserva solicitada
    prisma.reserva.create({
      data: {
        fechaInicio: new Date('2025-06-20'),
        fechaFin: new Date('2025-06-25'),
        idAuto: autos[3].idAuto,
        idCliente: usuarios[4].idUsuario, // María López
        estado: 'SOLICITADA',
        fechaSolicitud: new Date('2025-05-29'),
        fechaLimitePago: new Date('2025-06-02'),
        montoTotal: 1600.00,
        estaPagada: false
      }
    })
  ]);

  // 9. Crear pagos
  console.log('💳 Creando pagos...');
  await Promise.all([
    // Pagos para la primera reserva
    prisma.pago.create({
      data: {
        idReserva: reservas[0].idReserva,
        monto: 1000.00,
        metodoPago: 'QR',
        referencia: 'QR123456789',
        tipo: 'RENTA'
      }
    }),
    prisma.pago.create({
      data: {
        idReserva: reservas[0].idReserva,
        monto: 1000.00,
        metodoPago: 'QR',
        referencia: 'QR987654321',
        tipo: 'GARANTIA'
      }
    }),
    // Pagos para la segunda reserva
    prisma.pago.create({
      data: {
        idReserva: reservas[1].idReserva,
        monto: 2000.00,
        metodoPago: 'TARJETA_DEBITO',
        referencia: 'TDB456789123',
        tipo: 'RENTA'
      }
    }),
    prisma.pago.create({
      data: {
        idReserva: reservas[1].idReserva,
        monto: 1500.00,
        metodoPago: 'TARJETA_DEBITO',
        referencia: 'TDB789123456',
        tipo: 'GARANTIA'
      }
    }),
    // Pago para la tercera reserva
    prisma.pago.create({
      data: {
        idReserva: reservas[2].idReserva,
        monto: 540.00,
        metodoPago: 'QR',
        referencia: 'QR147258369',
        tipo: 'RENTA'
      }
    }),
    prisma.pago.create({
      data: {
        idReserva: reservas[2].idReserva,
        monto: 800.00,
        metodoPago: 'QR',
        referencia: 'QR963852741',
        tipo: 'GARANTIA'
      }
    })
  ]);

  // 10. Crear garantías
  console.log('🛡️ Creando garantías...');
  await Promise.all([
    prisma.garantia.create({
      data: {
        idReserva: reservas[0].idReserva,
        monto: 1000.00,
        fechaLiberacion: new Date('2025-05-06'),
        estado: 'LIBERADA',
        comprobante: 'COMP001'
      }
    }),
    prisma.garantia.create({
      data: {
        idReserva: reservas[1].idReserva,
        monto: 1500.00,
        estado: 'DEPOSITADA',
        comprobante: 'COMP002'
      }
    }),
    prisma.garantia.create({
      data: {
        idReserva: reservas[2].idReserva,
        monto: 800.00,
        estado: 'DEPOSITADA',
        comprobante: 'COMP003'
      }
    })
  ]);

  // 11. Crear comentarios
  console.log('💬 Creando comentarios...');
  await Promise.all([
    prisma.comentario.create({
      data: {
        idAuto: autos[0].idAuto,
        idUsuario: usuarios[4].idUsuario, // María López
        contenido: 'Excelente auto, muy cómodo y limpio. El propietario fue muy amable.',
        calificacion: 5,
        idReserva: reservas[0].idReserva
      }
    }),
    prisma.comentario.create({
      data: {
        idAuto: autos[1].idAuto,
        idUsuario: usuarios[5].idUsuario, // Pedro Chávez
        contenido: 'Muy buena SUV, perfecta para el viaje familiar. Recomendada.',
        calificacion: 4
      }
    }),
    prisma.comentario.create({
      data: {
        idAuto: autos[2].idAuto,
        idUsuario: usuarios[6].idUsuario, // Laura Morales
        contenido: 'Auto económico y eficiente, ideal para la ciudad.',
        calificacion: 4
      }
    }),
    prisma.comentario.create({
      data: {
        idAuto: autos[3].idAuto,
        idUsuario: usuarios[4].idUsuario, // María López
        contenido: 'Buena experiencia, auto en buen estado.',
        calificacion: 4
      }
    })
  ]);

  // 12. Crear calificaciones de usuarios
  console.log('⭐ Creando calificaciones de usuarios...');
  await Promise.all([
    prisma.calificacionUsuario.create({
      data: {
        idCalificador: usuarios[4].idUsuario, // María López califica
        idCalificado: usuarios[1].idUsuario,   // a Carlos Mendoza
        puntuacion: 5,
        comentario: 'Excelente anfitrión, muy profesional y responsable.',
        idReserva: reservas[0].idReserva,
        tipoCalificacion: 'ARRENDADOR'
      }
    }),
    prisma.calificacionUsuario.create({
      data: {
        idCalificador: usuarios[1].idUsuario, // Carlos Mendoza califica
        idCalificado: usuarios[4].idUsuario,   // a María López
        puntuacion: 5,
        comentario: 'Cliente muy responsable, cuidó muy bien el vehículo.',
        idReserva: reservas[1].idReserva,
        tipoCalificacion: 'ARRENDATARIO'
      }
    })
  ]);

  // 13. Crear historial de mantenimiento
  console.log('🔧 Creando historial de mantenimiento...');
  await Promise.all([
    prisma.historialMantenimiento.create({
      data: {
        idAuto: autos[0].idAuto,
        fechaInicio: new Date('2025-03-15'),
        fechaFin: new Date('2025-03-16'),
        descripcion: 'Cambio de aceite y filtros',
        costo: 250.00,
        tipoMantenimiento: 'PREVENTIVO',
        kilometraje: 44500
      }
    }),
    prisma.historialMantenimiento.create({
      data: {
        idAuto: autos[1].idAuto,
        fechaInicio: new Date('2025-04-20'),
        fechaFin: new Date('2025-04-21'),
        descripcion: 'Revisión general y cambio de llantas',
        costo: 800.00,
        tipoMantenimiento: 'PREVENTIVO',
        kilometraje: 31500
      }
    }),
    prisma.historialMantenimiento.create({
      data: {
        idAuto: autos[2].idAuto,
        fechaInicio: new Date('2025-02-10'),
        fechaFin: new Date('2025-02-12'),
        descripcion: 'Reparación del sistema de frenos',
        costo: 450.00,
        tipoMantenimiento: 'CORRECTIVO',
        kilometraje: 27200
      }
    })
  ]);

  // 14. Crear notificaciones
  console.log('🔔 Creando notificaciones...');
  await Promise.all([
    prisma.notificacion.create({
      data: {
        idUsuario: usuarios[1].idUsuario, // Carlos Mendoza
        titulo: 'Nueva reserva solicitada',
        mensaje: 'María López ha solicitado reservar tu Toyota Corolla',
        idEntidad: reservas[0].idReserva.toString(),
        tipoEntidad: 'reserva',
        tipo: 'RESERVA_SOLICITADA',
        prioridad: 'ALTA'
      }
    }),
    prisma.notificacion.create({
      data: {
        idUsuario: usuarios[4].idUsuario, // María López
        titulo: 'Reserva aprobada',
        mensaje: 'Tu reserva del Toyota Corolla ha sido aprobada',
        idEntidad: reservas[0].idReserva.toString(),
        tipoEntidad: 'reserva',
        leido: true,
        leidoEn: new Date('2025-04-26T10:30:00'),
        tipo: 'RESERVA_APROBADA',
        prioridad: 'ALTA'
      }
    }),
    prisma.notificacion.create({
      data: {
        idUsuario: usuarios[2].idUsuario, // Ana García
        titulo: 'Nueva reserva solicitada',
        mensaje: 'Pedro Chávez ha solicitado reservar tu Hyundai Tucson',
        idEntidad: reservas[1].idReserva.toString(),
        tipoEntidad: 'reserva',
        tipo: 'RESERVA_SOLICITADA',
        prioridad: 'ALTA'
      }
    }),
    prisma.notificacion.create({
      data: {
        idUsuario: usuarios[5].idUsuario, // Pedro Chávez
        titulo: 'Depósito confirmado',
        mensaje: 'Tu depósito de garantía ha sido confirmado',
        idEntidad: reservas[1].idReserva.toString(),
        tipoEntidad: 'pago',
        leido: true,
        leidoEn: new Date('2025-05-21T14:15:00'),
        tipo: 'DEPOSITO_CONFIRMADO',
        prioridad: 'MEDIA'
      }
    }),
    prisma.notificacion.create({
      data: {
        idUsuario: usuarios[1].idUsuario, // Carlos Mendoza
        titulo: 'Alquiler finalizado',
        mensaje: 'El alquiler de tu Toyota Corolla ha finalizado',
        idEntidad: reservas[0].idReserva.toString(),
        tipoEntidad: 'reserva',
        tipo: 'ALQUILER_FINALIZADO',
        prioridad: 'MEDIA'
      }
    }),
    prisma.notificacion.create({
      data: {
        idUsuario: usuarios[6].idUsuario, // Laura Morales
        titulo: 'Reserva confirmada',
        mensaje: 'Tu reserva del Chevrolet Spark ha sido confirmada',
        idEntidad: reservas[2].idReserva.toString(),
        tipoEntidad: 'reserva',
        tipo: 'RESERVA_APROBADA',
        prioridad: 'ALTA'
      }
    })
  ]);

  // 15. Crear verificaciones
  console.log('✅ Creando verificaciones...');
  await Promise.all([
    prisma.verificaciones.create({
      data: {
        idUsuario: usuarios[4].idUsuario, // María López
        codigo: '123456',
        tipo: 'verificacion',
        expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        usado: true
      }
    }),
    prisma.verificaciones.create({
      data: {
        idUsuario: usuarios[5].idUsuario, // Pedro Chávez
        codigo: '789012',
        tipo: 'recuperacion',
        expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000),
        usado: false
      }
    }),
    prisma.verificaciones.create({
      data: {
        idUsuario: usuarios[6].idUsuario, // Laura Morales
        codigo: '345678',
        tipo: 'verificacion',
        expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000),
        usado: true
      }
    })
  ]);

  // 16. Crear términos y condiciones
  console.log('📄 Creando términos y condiciones...');
  const fechaAceptacion = new Date('2025-01-15');
  await Promise.all(
    usuarios.map(usuario => 
      prisma.terminosCondiciones.create({
        data: {
          idUsuario: usuario.idUsuario,
          versionTerminos: 'v2.1',
          fechaAceptacion: fechaAceptacion
        }
      })
    )
  );

  console.log('✅ Seed completado exitosamente!');
  console.log(`
  📊 Resumen de datos creados:
  - 👥 Usuarios: ${usuarios.length}
  - 🚗 Drivers: ${drivers.length}
  - 📍 Ubicaciones: ${ubicaciones.length}
  - 🚙 Autos: ${autos.length}
  - 📸 Imágenes: ${autos.length * 4}
  - 📋 Reservas: ${reservas.length}
  - 💳 Pagos: 6
  - 🛡️ Garantías: 3
  - 💬 Comentarios: 4
  - ⭐ Calificaciones: 2
  - 🔧 Mantenimientos: 3
  - 🔔 Notificaciones: 7
  - ✅ Verificaciones: 3
  - 📄 Términos: ${usuarios.length}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });