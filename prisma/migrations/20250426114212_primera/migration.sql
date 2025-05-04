/*
  Warnings:

  - Added the required column `capacidadMaletero` to the `Auto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoAuto` to the `Auto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auto" ADD COLUMN     "capacidadMaletero" SMALLINT NOT NULL,
ADD COLUMN     "tipoAuto" TEXT NOT NULL;
