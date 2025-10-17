// ARCHIVO: prisma/seed.ts (Añadir al main())

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ARCHIVO: prisma/seed.ts (Añadir a la función main())

// ... import y PrismaClient ...

const tiposVoceriaDataCompleto = [
    // Categoría 1: Economía Productiva
    { nombre: 'Comité de Economía Comunal', esObligatoria: false, categoriaId: 1 },
    { nombre: 'Comité de Turismo', esObligatoria: false, categoriaId: 1 },
    { nombre: 'UPF Unidades de Producción Familiar', esObligatoria: false, categoriaId: 1 },
    { nombre: 'Emprendimientos', esObligatoria: false, categoriaId: 1 },
    { nombre: 'Sistemas de Intercambio', esObligatoria: false, categoriaId: 1 },
    { nombre: 'Redes de Productores', esObligatoria: false, categoriaId: 1 },
    
    // Categoría 2: Ciudades Humanas y Servicios
    { nombre: 'Comité de Mesas Técnicas de Agua', esObligatoria: false, categoriaId: 2 },
    { nombre: 'Comité de Telecomunicaciones', esObligatoria: false, categoriaId: 2 },
    { nombre: 'Comité de Energía y Gas', esObligatoria: false, categoriaId: 2 },
    { nombre: 'Comité Transporte', esObligatoria: false, categoriaId: 2 },
    { nombre: 'Comité de Hábitat y Vivienda', esObligatoria: false, categoriaId: 2 },
    { nombre: 'Comité de Tierra Urbana', esObligatoria: false, categoriaId: 2 },
    { nombre: 'Comité de Ambiente y demarcación de tierras en los Hábitats Indígenas', esObligatoria: false, categoriaId: 2 },
    { nombre: 'Comité de Gestión de Riesgos', esObligatoria: false, categoriaId: 2 },
    { nombre: 'BRICOMILES', esObligatoria: false, categoriaId: 2 },
    { nombre: 'Comité de agua', esObligatoria: false, categoriaId: 2 }, // ID 40
    
    // Categoría 3: Seguridad y Paz
    { nombre: 'Comité de Justicia de Paz Comunal', esObligatoria: true, categoriaId: 3 }, // OBLIGATORIA
    { nombre: 'Comité de Seguridad y Defensa Integral', esObligatoria: false, categoriaId: 3 },
    { nombre: 'Comité de Derechos Humanos', esObligatoria: false, categoriaId: 3 },
    { nombre: 'UPEDI', esObligatoria: false, categoriaId: 3 },
    { nombre: 'Milicianos', esObligatoria: false, categoriaId: 3 },

    // Categoría 4: Suprema Felicidad Social
    { nombre: 'Comités de Salud, Personas Adultas Mayores y Personas con Discapacidad', esObligatoria: false, categoriaId: 4 },
    { nombre: 'Comité de Educación y Formación Ciudadana, Cultura, Juventud, Recreación y Deporte', esObligatoria: false, categoriaId: 4 },
    { nombre: 'Comité de Mujer e Igualdad de Género', esObligatoria: false, categoriaId: 4 },
    { nombre: 'Comité para la Protección Integral de la Familia', esObligatoria: false, categoriaId: 4 },
    { nombre: 'Comité para la Promoción Parto y Nacimiento Humanizado, Lactancia Materna y Crianza Amorosa', esObligatoria: false, categoriaId: 4 },
    { nombre: 'Comité de Protección a los Niños, Niñas y Adolescentes', esObligatoria: false, categoriaId: 4 },
    { nombre: 'Comités de Alimentación y Defensa del Consumidor', esObligatoria: false, categoriaId: 4 },
    { nombre: 'CLAP', esObligatoria: false, categoriaId: 4 },
    { nombre: 'Comité de medicina tradicional indígena', esObligatoria: false, categoriaId: 4 },
    { nombre: 'Comité de Educación propia, educación intercultural bilingüe e idiomas indígenas', esObligatoria: false, categoriaId: 4 },

    // Categoría 5: Organización y Planificación
    { nombre: 'Comités de Planificación Comunal y Sistema de Indicadores de seguimiento', esObligatoria: false, categoriaId: 5 },
    { nombre: 'Comité de Medios Alternativos y Comunitarios', esObligatoria: false, categoriaId: 5 },
    { nombre: 'Comité Electoral Permanente', esObligatoria: false, categoriaId: 5 },
    { nombre: 'Comité Contraloría Social', esObligatoria: false, categoriaId: 5 },
    { nombre: 'Comité de Legislación', esObligatoria: true, categoriaId: 5 }, // OBLIGATORIA (ID 38)

    // Categoría 6: Ecosocialismo, Ciencia -
    { nombre: 'Comité de Tecnología e Innovación', esObligatoria: false, categoriaId: 6 },
    { nombre: 'Comité de Ecosocialismo', esObligatoria: false, categoriaId: 6 },
    { nombre: 'Comité de mesa técnica de telecomunicaciones', esObligatoria: false, categoriaId: 6 },
    { nombre: 'Comite de campesinos y siembra', esObligatoria: false, categoriaId: 6 },
];

async function main() {
    // ... Código de Seeding de Parroquia y CategoriaVoceria (asegúrate de que estén arriba) ...

    // --- INSERTAR TIPOS DE VOCERÍA (NOMBRES COMPLETOS) ---
    console.log(`Iniciando el Seeding de Tipos de Vocería (Comités) con nombres completos...`);

    const result = await prisma.tipoVoceria.createMany({
        data: tiposVoceriaDataCompleto,
        skipDuplicates: true, 
    });

    console.log(`Seeding de Tipos de Vocería completado exitosamente.`);
    console.log(`Total de comités insertados: ${result.count}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); 
  });