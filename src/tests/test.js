const { getTopRentedVehicles } = require('../models/carQueries');

async function test() {
  const vehicles = await getTopRentedVehicles();
  console.log('Top 5 vehículos más alquilados:', vehicles);
}

test();
