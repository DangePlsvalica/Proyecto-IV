import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const parroquias = [
    { nombre: "San Felipe", municipio: "San Felipe" },
    { nombre: "Albarico", municipio: "San Felipe" },
    { nombre: "San Javier", municipio: "San Felipe" },
    { nombre: "Cocorote", municipio: "Cocorote" },
    { nombre: "Independencia", municipio: "Independencia" },
    { nombre: "Yaritagua", municipio: "Peña" },
    { nombre: "San Andres", municipio: "Peña" },
    { nombre: "Chivacoa", municipio: "Bruzal" },
    { nombre: "Campo Elías", municipio: "Bruzal" },
    { nombre: "Nirgua", municipio: "Nirgua" },
    { nombre: "Salóm", municipio: "Nirgua" },
    { nombre: "Temerla", municipio: "Nirgua" },
    { nombre: "San Pablo", municipio: "Arístides Bastidas" },
    { nombre: "Urachiche", municipio: "Urachiche" },
    { nombre: "San Antonio", municipio: "José Antonio Páez" },
    { nombre: "Guama", municipio: "Sucre" },
    { nombre: "Sabana de Parra", municipio: "José Antonio Páez" },
    { nombre: "Farriar", municipio: "Veroes" },
    { nombre: "El Guayabo", municipio: "Veroes" },
    { nombre: "Aroa", municipio: "Bolívar" },
    { nombre: "Manuel Monge", municipio: "Manuel Monge" },
    { nombre: "Yumare", municipio: "Manuel Monge" },
    { nombre: "Boraure", municipio: "La Trinidad" }
  ];

  for (const parroquia of parroquias) {
    await prisma.parroquia.create({
      data: parroquia,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
