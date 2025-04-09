//pagoConTarjeta.ts

/* Usar estos datos para los 2 metodos de pago

CREATE TABLE IF NOT EXISTS "Pago" (
    id SERIAL PRIMARY KEY,
    metodo VARCHAR(50) NOT NULL,
    monto NUMERIC(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referencia VARCHAR(100),
    estado VARCHAR(50),
    vehiculoId INTEGER
);
*/