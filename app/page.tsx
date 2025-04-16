"use client";
import Image from "next/image";
import BlurText from "../components/BlurText";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export default function Home() {
  return (
    <main className="relative flex items-center justify-center overflow-hidden p-20">
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
        <div className="w-full md:w-auto">
        <BlurText
  text="Sistema de Gestión de Comunas y Logística vehicular del Ministerio del Poder Popular para las comunas"
  delay={60}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-5xl max-[500px]:text-2xl text-center md:text-left"
/>
        </div>
      </div>
    </main>
  );
}