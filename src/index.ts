import app from './app'; // Importamos la

console.log('📂 Ejecutando index.ts desde:', __filename);

const port = 3000;

// Levantar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
