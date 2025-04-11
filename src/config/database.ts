//C:\Users\H P\Documents\IS 2025\PROYECTO IS 1_2025\RediBo_Back\src\config\database.ts
/*
Vista rápida del funcionamiento y contenido de esta carpeta

    Archivos de configuración del proyecto
        - Conexión a la base de datos
        - Configuración de variables de entorno, servicios externos y/o opciones del servidor
*/

// El error sale porque Prisma no generará un cliente si no hay modelos definidos
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Pago {
  id         Int       @id @default(autoincrement())
  metodo     String    @db.VarChar(50)
  monto      Decimal   @db.Decimal(10, 2)
  fecha      DateTime? @default(now()) @db.Timestamp(6)
  referencia String?   @db.VarChar(100)
  estado     String?   @db.VarChar(50)
  vehiculoid Int?
}
