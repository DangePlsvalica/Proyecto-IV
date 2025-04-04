"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const confirmPassword = e.target[2].value;
    const role = e.target[3].value; // Capturamos el rol seleccionado

    if (!isValidEmail(email)) {
      setError("El correo es invalido");
      toast.error("El correo es invalido");
      return;
    }

    if (!password || password.length < 8) {
      setError("La contraseña es invalida");
      toast.error("La contraseña es invalida");
      return;
    }

    if (confirmPassword !== password) {
      setError("Las contraseñas no son iguales");
      toast.error("Las contraseñas no son iguales");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role, // Enviar el rol seleccionado a la API
        }),
      });
      if (res.status === 400) {
        toast.error("Este correo electrónico ya está registrado");
        setError("Este correo electrónico ya está en uso");
      }
      if (res.status === 201) {
        setError("");
        toast.success("Registro exitoso");
        router.push("/admin-user");
      }
    } catch (error) {
      toast.error("Error, vuelve a intentarlo");
      setError("Error, vuelve a intentarlo");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Cargando...</h1>;
  }
  if (!session) {
    router.push("/login"); // Redirige al login si no hay sesión
    return null; // Asegura que la página no se renderice
  }

  if (session.user.role !== "Admin") {
    router.push("/"); // Redirige al home si no es admin
    return null; // Asegura que no se renderice la página
  }

  return (
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-col items-center">
          <Image src="/inces.jpg" alt="star logo" width={60} height={60} />
          <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900">
            Regístrar nuevo usuario
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Correo electronico
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirmar contraseña
                </label>
                <div className="mt-2">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Rol
                </label>
                <div className="mt-2">
                  <select
                    id="role"
                    name="role"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="user">Usuario</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full border border-black justify-center rounded-md bg-sky-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Registrarse
                </button>
                <p className="text-red-600 text-center text-[16px] my-4">
                  {error && error}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;

