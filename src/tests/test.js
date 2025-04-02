const { getTopRentedCars } = require("../models/carQueries");

async function test() {
    try {
        const cars = await getTopRentedCars();
        console.log("Top 5 autos más alquilados:", cars);
    } catch (error) {
        console.error("Error al obtener los autos más alquilados:", error);
    }
}

test();
