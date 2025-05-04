-- CreateEnum
CREATE TYPE "MotivoNoDisponibilidad" AS ENUM ('MANTENIMIENTO', 'REPARACION', 'USO_PERSONAL', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoAuto" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoMantenimiento" AS ENUM ('PREVENTIVO', 'CORRECTIVO', 'REVISION');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contraseña" TEXT NOT NULL,
    "esAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auto" (
    "id" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "placa" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "precioRentaDiario" DECIMAL(10,2) NOT NULL,
    "montoGarantia" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoAuto" NOT NULL DEFAULT 'ACTIVO',
    "fechaAdquisicion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kilometraje" INTEGER NOT NULL DEFAULT 0,
    "descripcion" TEXT,
    "transmision" TEXT NOT NULL,
    "combustible" TEXT NOT NULL,
    "capacidad" SMALLINT NOT NULL,
    "propietarioId" INTEGER NOT NULL,

    CONSTRAINT "Auto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "autoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "calificacion" SMALLINT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialMantenimiento" (
    "id" SERIAL NOT NULL,
    "autoId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "descripcion" TEXT NOT NULL,
    "costo" DECIMAL(10,2),
    "tipoMantenimiento" "TipoMantenimiento" NOT NULL,
    "kilometraje" INTEGER NOT NULL,

    CONSTRAINT "HistorialMantenimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disponibilidad" (
    "id" SERIAL NOT NULL,
    "autoId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "motivo" "MotivoNoDisponibilidad" NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Disponibilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imagen" (
    "id" SERIAL NOT NULL,
    "autoId" INTEGER NOT NULL,
    "direccionImagen" TEXT NOT NULL,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auto_placa_key" ON "Auto"("placa");

-- AddForeignKey
ALTER TABLE "Auto" ADD CONSTRAINT "Auto_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "Auto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialMantenimiento" ADD CONSTRAINT "HistorialMantenimiento_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "Auto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disponibilidad" ADD CONSTRAINT "Disponibilidad_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "Auto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "Auto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
