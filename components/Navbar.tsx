"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { FaXmark, FaPerson } from "react-icons/fa6";
import Image from "next/image";
import { FaRegUser, FaUsers, FaCar, FaBars } from 'react-icons/fa';
import { IoSettingsOutline } from "react-icons/io5";
import { RiCommunityLine } from "react-icons/ri";
import { PiScrollBold } from "react-icons/pi";
import Button from './Button'

const Navbar = () => {
  const { data: session }: any = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Crear la navegación dependiendo del rol del usuario
  const allNavigation = [
    { name: "Administrar usuarios", href: "/admin-user", icon: <FaRegUser /> },
    { name: "Administrar roles", href: "/admin-role", icon: <PiScrollBold /> },
    { name: "Personas", href: "/personas", icon: <FaPerson /> },
    { name: "Consejos comunales", href: "/consejos-comunales", icon: <FaUsers /> },
    { name: "Comunas", href: "/comunas", icon: <RiCommunityLine /> },
    { name: "Proyectos", href: "/gestor-de-proyectos", icon: <IoSettingsOutline /> },
    { name: "Vehiculos", href: "/vehiculos", icon: <FaCar /> },
  ];

    // Filtrar según las rutas del rol del usuario
  const roleRoutes = session?.user?.role?.routes ?? [];
  const filteredNavigation = allNavigation.filter(item =>
    roleRoutes.includes(item.href)
  );

  return (
    <header className="bg-sky-950 fixed top-0 left-0 w-[250px] h-full p-3 z-50">
      <nav className="nav-link animate-link-fade opacity-0  items-center py-3" aria-label="Global">
        {/* Logo */}
        <div className="flex gap-2 items-center">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image
              src="/inces.jpg"
              width={45}
              height={45}
              alt="star logo"
              className="rounded-3xl"
            />
          </Link>
          <span className="text-xs text-white">{session?.user?.email}</span>
        </div>

        {/* Navegación segun el rol */}
        <div className="flex flex-col gap-6 px-3 py-6">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex gap-2 items-center text-base font-semibold leading-6 text-white hover:text-gray-300 transition duration-150 ease-in-out hover:translate-x-2.5"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        {/* Sesión y botones */}
        <div className="flex flex-col flex-1 items-center justify-end gap-x-6">
          <Button onClick={() => signOut()} title="Cerrar sesión"></Button>
        </div>

        {/* Menú móvil */}
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

      {/* Menú móvil desplegable */}
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
              <Image
                width={50}
                height={50}
                src="/logo 1.png"
                alt="star logo mobile"
              />
            </Link>
            {session ? (
              <Button onClick={() => signOut()} title="Cerrar sesión"></Button>
            ) : (
              <Button href="/pages/login" title="Iniciar Sesion"></Button>
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
              {/* <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div> */}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Navbar;