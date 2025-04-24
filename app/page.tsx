import Image from "next/image";
import Button from '../components/Button'
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if (session) {
    redirect("/pages/gestor-de-proyectos");
  }
  return (
    <main className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute w-full h-screen inset-0 bg-[url('/comuna2.png')] blur-lg opacity-1 bg-cover bg-center "></div>
      <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl mx-auto">
        {/* Logo */}
        <div className="animate-logo-entrance opacity-0 w-full md:w-auto">
          <Image
            src="/funacomunal.png"
            width={300}
            height={300}
            alt="logo"
            className="rounded-3xl mx-auto md:mx-0"
          />
        </div>

        {/* Título */}
        <div className="animate-title-entrance opacity-0 w-full md:w-auto">
          <h1 className="text-5xl max-[500px]:text-2xl font-bold text-cyan-100 text-center md:text-left">
            Sistema de Gestión para los activos y el registro en el Ministerio del
            Poder Popular de las comunas del estado Yaracuy
          </h1>
          <div className="pt-10 px-80">
            <Button className="w-64 px-6 py-3 text-[18px] font-bold" href="/pages/login" title="Iniciar Sesion"></Button>
          </div>
        </div>
      </div>
    </main>
  );
}