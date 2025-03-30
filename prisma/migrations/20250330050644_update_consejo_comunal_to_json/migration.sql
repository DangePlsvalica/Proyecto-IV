-- Paso 1: Crear una columna temporal para almacenar los datos existentes
ALTER TABLE "Comuna" ADD COLUMN "consejoComunal_temp" JSON;

-- Paso 2: Copiar los datos actuales a la columna temporal
UPDATE "Comuna" SET "consejoComunal_temp" = to_jsonb("consejoComunal");

-- Paso 3: Cambiar el tipo de la columna original a JSON
ALTER TABLE "Comuna" ALTER COLUMN "consejoComunal" DROP DEFAULT;
ALTER TABLE "Comuna" ALTER COLUMN "consejoComunal" TYPE JSON USING "consejoComunal_temp";

-- Paso 4: Eliminar la columna temporal
ALTER TABLE "Comuna" DROP COLUMN "consejoComunal_temp";

