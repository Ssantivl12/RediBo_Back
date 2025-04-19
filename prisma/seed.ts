import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crear hosts
  const host1 = await prisma.host.create({
    data: { nombre: 'Juan Pérez', email: 'juan@correo.com' },
  });
  const host2 = await prisma.host.create({
    data: { nombre: 'Ana López', email: 'ana@correo.com' },
  });

  // Crear renters
  const renters = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.renter.create({
        data: {
          nombre: `Renter ${i + 1}`,
          email: `renter${i + 1}@correo.com`,
        },
      })
    )
  );

  // Crear autos (4 para host1, 3 para host2)
  const autos = await Promise.all([
    prisma.auto.create({ data: { marca: 'Toyota', modelo: 'Corolla', color: 'Rojo', imagen: 'https://picsum.photos/200', hostId: host1.id } }),
    prisma.auto.create({ data: { marca: 'Honda', modelo: 'Civic', color: 'Azul', imagen: 'https://picsum.photos/201', hostId: host1.id } }),
    prisma.auto.create({ data: { marca: 'Mazda', modelo: '3', color: 'Negro', imagen: 'https://picsum.photos/202', hostId: host1.id } }),
    prisma.auto.create({ data: { marca: 'Chevrolet', modelo: 'Onix', color: 'Gris', imagen: 'https://picsum.photos/203', hostId: host1.id } }),
  
    prisma.auto.create({ data: { marca: 'Ford', modelo: 'Focus', color: 'Blanco', imagen: 'https://picsum.photos/204', hostId: host2.id } }),
    prisma.auto.create({ data: { marca: 'Volkswagen', modelo: 'Jetta', color: 'Verde', imagen: 'https://picsum.photos/205', hostId: host2.id } }),
    prisma.auto.create({ data: { marca: 'Hyundai', modelo: 'Elantra', color: 'Plateado', imagen: 'https://picsum.photos/206', hostId: host2.id } }),
  ]);

  // Crear rentals con fechas variadas
  await Promise.all([
    prisma.rental.create({ data: { autoId: autos[0].id, renterId: renters[0].id, startDate: new Date('2025-03-01'), endDate: new Date('2025-03-03') } }),
    prisma.rental.create({ data: { autoId: autos[0].id, renterId: renters[1].id, startDate: new Date('2025-03-05'), endDate: new Date('2025-03-10') } }),
    prisma.rental.create({ data: { autoId: autos[1].id, renterId: renters[2].id, startDate: new Date('2025-03-12'), endDate: new Date('2025-03-15') } }),
    prisma.rental.create({ data: { autoId: autos[2].id, renterId: renters[3].id, startDate: new Date('2025-03-16'), endDate: new Date('2025-03-20') } }),
    prisma.rental.create({ data: { autoId: autos[3].id, renterId: renters[4].id, startDate: new Date('2025-03-22'), endDate: new Date('2025-03-25') } }),
    prisma.rental.create({ data: { autoId: autos[3].id, renterId: renters[5].id, startDate: new Date('2025-03-26'), endDate: new Date('2025-03-30') } }),
    prisma.rental.create({ data: { autoId: autos[4].id, renterId: renters[6].id, startDate: new Date('2025-04-01'), endDate: new Date('2025-04-03') } }),
    prisma.rental.create({ data: { autoId: autos[5].id, renterId: renters[7].id, startDate: new Date('2025-04-04'), endDate: new Date('2025-04-07') } }),
    prisma.rental.create({ data: { autoId: autos[6].id, renterId: renters[8].id, startDate: new Date('2025-04-08'), endDate: new Date('2025-04-10') } }),
    prisma.rental.create({ data: { autoId: autos[6].id, renterId: renters[9].id, startDate: new Date('2025-04-12'), endDate: new Date('2025-04-14') } }),
    prisma.rental.create({ data: { autoId: autos[1].id, renterId: renters[0].id, startDate: new Date('2025-04-15'), endDate: new Date('2025-04-17') } }),
    prisma.rental.create({ data: { autoId: autos[2].id, renterId: renters[1].id, startDate: new Date('2025-04-18'), endDate: new Date('2025-04-20') } }),
    prisma.rental.create({ data: { autoId: autos[5].id, renterId: renters[2].id, startDate: new Date('2025-04-21'), endDate: new Date('2025-04-25') } }),
    prisma.rental.create({ data: { autoId: autos[0].id, renterId: renters[3].id, startDate: new Date('2025-04-26'), endDate: new Date('2025-04-28') } }),
    prisma.rental.create({ data: { autoId: autos[0].id, renterId: renters[4].id, startDate: new Date('2025-04-29'), endDate: new Date('2025-05-01') } }),
  ]);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
