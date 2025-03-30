"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";
import Divider from "../components/Divider";

const Navbar = () => {
  const { data: session }: any = useSession();
  console.log("Rol del usuario:", session?.user?.role);
  if (session?.user?.role === "Admin") {
    console.log("El usuario es Admin");
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Crear la navegación dependiendo del rol del usuario
  const navigation = [
    { name: "Inicio", href: "/" },
    session?.user?.role === "Admin" ? { name: "Gestor de proyectos", href: "/gestor-de-proyectos" } : null,
    { name: "Consejos comunales", href: "/consejos-comunales" },
  ];

  return (
    <>
      <header className="bg-sky-700">
        <nav
          className="mx-auto flex w-full items-center justify-between gap-x-6 p-3 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image src="/inces.jpg" width={45} height={45} alt="star logo" className="rounded-3xl" />
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map(
              (item) =>
                item && (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-white"
                  >
                    {item.name}
                  </Link>
                )
            )}
          </div>
          <div className="flex flex-1 items-center justify-end gap-x-6">
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="rounded-md bg-sky-950 px-3 py-2 border border-gray-500 border-1 text-sm font-semibold text-white shadow-sm hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Iniciar Sesion
                </Link>
              </>
            ) : (
              <>
                <span className="ml-10 text-sm text-white">{session.user?.email}</span>
                {session.user?.role === "Admin" && (
                  <Link
                    href="/register"
                    className="rounded-md bg-sky-950 px-3 py-2 border border-gray-500 border-1 text-sm font-semibold text-white shadow-sm hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Registrar Usuario
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="rounded-md bg-sky-950 px-3 py-2 border border-gray-500 border-1 text-sm font-semibold text-white shadow-sm hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir el menú principal</span>
              <FaBars className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center gap-x-6">
              <Link href="/" className="-m-1.5 p-1.5">
                <Image width={50} height={50} src="/logo 1.png" alt="star logo mobile" />
              </Link>
              {session ? (
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="ml-auto rounded-md bg-black border border-1 border-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-black px-3 py-2 border border-gray-500 border-1 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Iniciar Sesion
                </Link>
              )}
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Cerrar menú</span>
                <FaXmark className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map(
                    (item) =>
                      item && (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </Link>
                      )
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      <Divider />
    </>
  );
};

export default Navbar;

