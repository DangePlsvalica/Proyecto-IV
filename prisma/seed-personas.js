import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

// cargar json
const personas = JSON.parse(
  fs.readFileSync('./prisma/data/personas.json', 'utf8')
);

async function main() {
  console.log("🌱 Insertando personas...");

  const cleanPersonas = personas.map(p => ({
    nombres: p.nombres,
    apellidos: p.apellidos,
    ci: p.ci,
    telefono: p.telefono ?? "00000000000",
    habilitado: p.habilitado
  }));

  const result = await prisma.persona.createMany({
    data: cleanPersonas,
    skipDuplicates: true,
  });

  console.log(`✅ Insertadas ${result.count} personas.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
