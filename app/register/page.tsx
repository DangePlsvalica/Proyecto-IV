"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRegister } from "@/hooks/useRegister";
import { useRolesQuery } from "@/hooks/useRoles";
import Loading from "@/components/Loading";

const RegisterPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const { registerUser, error, isLoading, resetError } = useRegister();
  const { data: roles = []} = useRolesQuery();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetError();
    
    const formData = new FormData(e.currentTarget);
    const result = await registerUser({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmpassword") as string,
      role: formData.get("role") as string,
    });
    if (result.success) {
      router.push("/admin-user");
    }
  };

  if (sessionStatus === "loading") {
    return ( <Loading /> );
  }

  return (
    <div className="animate-fade-in opacity-0 flex min-h-full flex-1 flex-col justify-center py-0 sm:px-6 lg:px-8">
      <div className="flex justify-center flex-col items-center">
        <Image src="/inces.jpg" alt="star logo" width={60} height={60} />
        <h2 className="mt-2 text-center text-2xl leading-9 tracking-tight text-gray-900">
          Regístrar nuevo usuario
        </h2>
      </div>

      <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  <option value="">Seleccione un rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full border border-black justify-center rounded-md bg-sky-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Registrando..." : "Registrar"}
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