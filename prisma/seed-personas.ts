import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

// cargar json correctamente
const personas = JSON.parse(
  fs.readFileSync('./prisma/data/personas_clean.json', 'utf8')
);

async function main() {
  console.log("🌱 Insertando personas...");

  const cleanPersonas = personas.map((p: { nombres: any; apellidos: any; ci: any; telefono: any; habilitado: any; }) => ({
    nombres: p.nombres,
    apellidos: p.apellidos,
    ci: p.ci,
    telefono: p.telefono,
    habilitado: p.habilitado,
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

