const { getTopRentedCars } = require("../models/carQueries");

async function testQuery() {
    console.log("🔍 Probando la consulta de los modelos más alquilados...");
    const topCars = await getTopRentedCars();
    console.log("🚗 Modelos más alquilados:", topCars);
}

testQuery();
