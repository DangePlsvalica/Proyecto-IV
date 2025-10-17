import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const createFakePersona = () => {
  return {
    nombres: faker.person.firstName(),
    apellidos: faker.person.lastName(),
    ci: faker.string.numeric(8),
    telefono: faker.helpers.fromRegExp(/0412[0-9]{3}[0-9]{2}[0-9]{2}/),
  };
};

async function main() {
  console.log(`Iniciando la siembra de datos... 🌱`);

  // NOTA: No se borra NINGUNA tabla.
  // Solo se agregarán 50 personas nuevas.

  const personas = [];
  for (let i = 0; i < 100; i++) {
    personas.push(createFakePersona());
  }

  const createManyResult = await prisma.persona.createMany({
    data: personas,
  });

  console.log(`${createManyResult.count} personas han sido creadas exitosamente.`);
  console.log(`Siembra de datos finalizada. ✅`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
