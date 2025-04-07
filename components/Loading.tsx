import Image from "next/image";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-12">
      <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl mx-auto justify-center">
        <Image
          src="/espera.gif"
          width={100}
          height={100}
          alt="espera gif"
          className="rounded-3xl"
        />
        <p className="text-lg font-semibold text-gray-600 mt-4">Cargando...</p>
      </div>
    </main>
  );
}
