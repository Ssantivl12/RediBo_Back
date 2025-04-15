-- CreateTable
CREATE TABLE "Usuario" (
    "idusuario" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "correo" VARCHAR(45) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idusuario")
);

-- CreateTable
CREATE TABLE "Renter" (
    "idrenter" SERIAL NOT NULL,
    "usuario_idusuario" INTEGER NOT NULL,

    CONSTRAINT "Renter_pkey" PRIMARY KEY ("idrenter")
);

-- CreateTable
CREATE TABLE "Host" (
    "idhost" SERIAL NOT NULL,
    "usuario_idusuario" INTEGER NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("idhost")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "idcalificacion" SERIAL NOT NULL,
    "puntuacion" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "renter_idrenter" INTEGER NOT NULL,
    "auto_idauto" INTEGER NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("idcalificacion")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "idreserva" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "expiracion" TIMESTAMP(3) NOT NULL,
    "renter_idrenter" INTEGER NOT NULL,
    "auto_idauto" INTEGER NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("idreserva")
);

-- CreateTable
CREATE TABLE "Auto" (
    "idauto" SERIAL NOT NULL,
    "marca" VARCHAR(25) NOT NULL,
    "modelo" VARCHAR(45) NOT NULL,
    "transmision" VARCHAR(15) NOT NULL,
    "consumo" VARCHAR(10) NOT NULL,
    "tipo_Auto" VARCHAR(25) NOT NULL,
    "color" VARCHAR(10) NOT NULL,
    "anio" INTEGER NOT NULL,
    "tarifa" DOUBLE PRECISION NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "placa" VARCHAR(10) NOT NULL,
    "descripcion" TEXT,
    "disponible" VARCHAR(10) NOT NULL,
    "host_idhost" INTEGER NOT NULL,
    "ubicacion_idubicacion" INTEGER NOT NULL,

    CONSTRAINT "Auto_pkey" PRIMARY KEY ("idauto")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "idubicacion" SERIAL NOT NULL,
    "pais" VARCHAR(45) NOT NULL,
    "ciudad" VARCHAR(45) NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("idubicacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Renter_usuario_idusuario_key" ON "Renter"("usuario_idusuario");

-- CreateIndex
CREATE UNIQUE INDEX "Host_usuario_idusuario_key" ON "Host"("usuario_idusuario");

-- AddForeignKey
ALTER TABLE "Renter" ADD CONSTRAINT "Renter_usuario_idusuario_fkey" FOREIGN KEY ("usuario_idusuario") REFERENCES "Usuario"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_usuario_idusuario_fkey" FOREIGN KEY ("usuario_idusuario") REFERENCES "Usuario"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_renter_idrenter_fkey" FOREIGN KEY ("renter_idrenter") REFERENCES "Renter"("idrenter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_auto_idauto_fkey" FOREIGN KEY ("auto_idauto") REFERENCES "Auto"("idauto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_renter_idrenter_fkey" FOREIGN KEY ("renter_idrenter") REFERENCES "Renter"("idrenter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_auto_idauto_fkey" FOREIGN KEY ("auto_idauto") REFERENCES "Auto"("idauto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auto" ADD CONSTRAINT "Auto_host_idhost_fkey" FOREIGN KEY ("host_idhost") REFERENCES "Host"("idhost") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auto" ADD CONSTRAINT "Auto_ubicacion_idubicacion_fkey" FOREIGN KEY ("ubicacion_idubicacion") REFERENCES "Ubicacion"("idubicacion") ON DELETE RESTRICT ON UPDATE CASCADE;
