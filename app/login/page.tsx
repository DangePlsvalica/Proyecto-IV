"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

const NextLoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      window.location.href = "/consejos-comunales";
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("El correo electrónico no es válido");
      toast.error("El correo electrónico no es válido");
      return;
    }

    if (!password || password.length < 8) {
      setError("La contraseña es invalida");
      toast.error("La contraseña es invalida");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Contraseña o correo incorrecto");
      toast.error("Contraseña o correo incorrecto");
      if (res?.url) router.replace("/");
    } else {
      setError("");
      toast.success("Inicio de sesión exitoso");
    }
  };

  if (sessionStatus === "loading") {
    return (<Loading />);
    }
  return (
    sessionStatus !== "authenticated" && (
      <><div className="absolute w-full h-screen inset-0 bg-[url('/comuna2.png')] blur-lg opacity-1 bg-cover bg-center "></div><div className="animate-fade-in opacity-0 flex min-h-full flex-1 flex-col justify-center py-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Link href={"/"} className="absolute left-[410px] 2xl:left-[830px] top-32">
          <IoArrowBack className="text-white" size={28} />
          </Link>
          <div className="flex flex-col justify-center  items-center">
          <Image src="/funacomunal.png" alt="star logo" width={100} height={100} />
          <h2 className="mt-6 text-center font-bold text-2xl leading-9 tracking-tight text-cyan-100">
            Inicia sesión en tu cuenta
          </h2>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Dirección de correo electrónico
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Contraseña
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full border border-black justify-center rounded-md bg-sky-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>

            <div>
              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                {/* <div className="relative flex justify-center text-sm font-medium leading-6">
      <span className="bg-white px-6 text-gray-900">
        O continuar con
      </span>
    </div> */}
              </div>

              {/* <div className="mt-6 grid grid-cols-2 gap-4">
      <button
        onClick={() => {
          signIn("google");
        }}
        className="flex w-full items-center border border-gray-300 justify-center gap-3 rounded-md bg-white px-3 py-1.5 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <FcGoogle />
        <span className="text-sm font-semibold leading-6">
          Google
        </span>
      </button>

      <button
        onClick={() => {
          signIn("github");
        }}
        className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
      >
        <svg
          className="h-5 w-5"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-semibold leading-6">
          GitHub
        </span>
      </button>
    </div> */}
              <p className="text-red-600 text-center text-[16px] my-4">
                {error && error}
              </p>
            </div>
          </div>
        </div>
      </div></>
    )
  );
};

export default NextLoginPage;
