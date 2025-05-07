const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function poblarBaseDatos() {
  try {
    // Limpiar la base de datos (opcional)
    console.log('Limpiando base de datos...');
    await limpiarBaseDatos();
    
    // Crear usuarios
    console.log('Creando usuarios...');
    const usuarios = await crearUsuarios();
    
    // Crear ubicaciones
    console.log('Creando ubicaciones...');
    const ubicaciones = await crearUbicaciones();
    
    // Crear autos
    console.log('Creando autos...');
    const autos = await crearAutos(usuarios, ubicaciones);
    
    // Crear reservas y pagos
    console.log('Creando reservas...');
    const reservas = await crearReservas(usuarios, autos);
    
    // Crear comentarios y calificaciones
    console.log('Creando comentarios y calificaciones...');
    await crearComentarios(usuarios, autos, reservas);
    await crearCalificacionesUsuarios(usuarios, reservas);
    
    // Actualizar promedios de calificaciones
    console.log('Actualizando promedios...');
    await actualizarPromedios();
    
    console.log('Base de datos poblada exitosamente');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function limpiarBaseDatos() {
  // Eliminar registros en orden inverso de dependencia
  await prisma.calificacionUsuario.deleteMany();
  await prisma.comentario.deleteMany();
  await prisma.historialMantenimiento.deleteMany();
  await prisma.imagen.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.garantia.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.disponibilidad.deleteMany();
  await prisma.auto.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.ubicacion.deleteMany();
  await prisma.usuario.deleteMany();
}

async function crearUsuarios() {
  const contrasennaHash = await bcrypt.hash('password123', saltRounds);
  
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '555-1234',
        direccion: 'Av. Principal 123',
        contraseña: contrasennaHash,
      }
    }),
    prisma.usuario.create({
      data: {
        nombre: 'María',
        apellido: 'González',
        email: 'maria@example.com',
        telefono: '555-5678',
        direccion: 'Calle Secundaria 456',
        contraseña: contrasennaHash,
      }
    }),
    prisma.usuario.create({
      data: {
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@sistema.com',
        telefono: '555-9876',
        contraseña: contrasennaHash,
        esAdmin: true
      }
    })
  ]);
  
  return usuarios;
}

async function crearUbicaciones() {
  const ubicaciones = await Promise.all([
    prisma.ubicacion.create({
      data: {
        nombre: 'Centro',
        descripcion: 'Ubicación céntrica',
        latitud: 19.432608,
        longitud: -99.133209,
      }
    }),
    prisma.ubicacion.create({
      data: {
        nombre: 'Norte',
        descripcion: 'Zona norte de la ciudad',
        latitud: 19.502608,
        longitud: -99.123209,
      }
    })
  ]);
  
  return ubicaciones;
}

async function crearAutos(usuarios, ubicaciones) {
  const autos = await Promise.all([
    prisma.auto.create({
      data: {
        idPropietario: usuarios[0].idUsuario,
        idUbicacion: ubicaciones[0].idUbicacion,
        marca: 'Toyota',
        modelo: 'Corolla',
        descripcion: 'Sedán económico',
        precioRentaDiario: 50.00,
        montoGarantia: 500.00,
        tipo: 'Sedán',
        año: 2022,
        placa: 'ABC123',
        color: 'Blanco',
        capacidadMaletero: 450,
        transmision: 'AUTOMATICO',
        combustible: 'GASOLINA',
        imagenes: {
          create: [
            { direccionImagen: 'autos/corolla_1.jpg' },
            { direccionImagen: 'autos/corolla_2.jpg' }
          ]
        }
      }
    }),
    prisma.auto.create({
      data: {
        idPropietario: usuarios[1].idUsuario,
        idUbicacion: ubicaciones[1].idUbicacion,
        marca: 'Honda',
        modelo: 'CR-V',
        descripcion: 'SUV familiar',
        precioRentaDiario: 75.00,
        montoGarantia: 750.00,
        tipo: 'SUV',
        año: 2021,
        placa: 'XYZ789',
        color: 'Gris',
        capacidadMaletero: 650,
        transmision: 'AUTOMATICO',
        combustible: 'GASOLINA',
        imagenes: {
          create: [
            { direccionImagen: 'autos/crv_1.jpg' }
          ]
        }
      }
    })
  ]);
  
  return autos;
}

async function crearReservas(usuarios, autos) {
  // Fechas para las reservas
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  
  const tresDias = new Date(hoy);
  tresDias.setDate(hoy.getDate() + 3);
  
  // Fechas pasadas para reservas completadas
  const haceDiezDias = new Date(hoy);
  haceDiezDias.setDate(hoy.getDate() - 10);
  
  const haceOchoDias = new Date(hoy);
  haceOchoDias.setDate(hoy.getDate() - 8);

  const reservas = await Promise.all([
    // Reserva actual
    prisma.reserva.create({
      data: {
        idAuto: autos[0].idAuto,
        idCliente: usuarios[1].idUsuario,
        fechaInicio: manana,
        fechaFin: tresDias,
        fechaLimitePago: hoy,
        montoTotal: 150.00,
        estado: 'CONFIRMADA',
        estaPagada: true,
        pagos: {
          create: {
            monto: 150.00,
            metodoPago: 'QR',
            tipo: 'RENTA'
          }
        },
        garantia: {
          create: {
            monto: 500.00,
            estado: 'DEPOSITADA'
          }
        }
      }
    }),
    // Reserva completada
    prisma.reserva.create({
      data: {
        idAuto: autos[1].idAuto,
        idCliente: usuarios[0].idUsuario,
        fechaInicio: haceDiezDias,
        fechaFin: haceOchoDias,
        fechaLimitePago: haceDiezDias,
        montoTotal: 150.00,
        estado: 'FINALIZADA',
        estaPagada: true,
        kilometrajeInicial: 15000,
        kilometrajeFinal: 15350,
        pagos: {
          create: {
            monto: 150.00,
            metodoPago: 'TARJETA_DEBITO',
            tipo: 'RENTA'
          }
        },
        garantia: {
          create: {
            monto: 750.00,
            estado: 'LIBERADA',
            fechaLiberacion: haceOchoDias
          }
        }
      }
    })
  ]);
  
  return reservas;
}

async function crearComentarios(usuarios, autos, reservas) {
  await Promise.all([
    prisma.comentario.create({
      data: {
        idAuto: autos[1].idAuto,
        idUsuario: usuarios[0].idUsuario,
        idReserva: reservas[1].idReserva,
        contenido: 'Excelente vehículo, muy cómodo y económico.',
        calificacion: 5,
      }
    })
  ]);
  
  // Actualizar calificación promedio del auto
  await prisma.auto.update({
    where: { idAuto: autos[1].idAuto },
    data: {
      calificacionPromedio: 5,
      totalComentarios: 1
    }
  });
}

async function crearCalificacionesUsuarios(usuarios, reservas) {
  await Promise.all([
    prisma.calificacionUsuario.create({
      data: {
        idCalificador: usuarios[1].idUsuario, // María califica a Juan
        idCalificado: usuarios[0].idUsuario,  // Juan recibe la calificación
        puntuacion: 4,
        comentario: 'Buen propietario, auto en excelentes condiciones.',
        idReserva: reservas[1].idReserva,
        tipoCalificacion: 'ARRENDADOR'
      }
    }),
    prisma.calificacionUsuario.create({
      data: {
        idCalificador: usuarios[0].idUsuario, // Juan califica a María
        idCalificado: usuarios[1].idUsuario,  // María recibe la calificación
        puntuacion: 5,
        comentario: 'Excelente cliente, devolvió el vehículo en perfectas condiciones.',
        idReserva: reservas[1].idReserva,
        tipoCalificacion: 'ARRENDATARIO'
      }
    })
  ]);
}

async function actualizarPromedios() {
  // Actualizar calificación promedio de los autos en SQL
  await prisma.$executeRaw`
    UPDATE usuarios 
    SET "calificacionPromedio" = (
      SELECT AVG(puntuacion::float) 
      FROM calificaciones_usuarios 
      WHERE "idCalificado" = usuarios."idUsuario"
    )
    WHERE EXISTS (
      SELECT 1 
      FROM calificaciones_usuarios 
      WHERE "idCalificado" = usuarios."idUsuario"
    )
  `;
}

// Ejecutar la función principal
poblarBaseDatos()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });