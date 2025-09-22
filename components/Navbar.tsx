"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { FaXmark, FaPerson } from "react-icons/fa6";
import Image from "next/image";
import { FaRegUser, FaUsers, FaCar, FaBars } from 'react-icons/fa';
import { FaChevronDown, FaKey, FaArrowRightFromBracket } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { RiCommunityLine } from "react-icons/ri";
import { PiScrollBold } from "react-icons/pi";
import Button from './Button'
import { Menu } from "@headlessui/react";
import ChangePasswordModal from "./ChangePasswordModal";
import Modal from "./Modal";
import RegisterVoceriaForm from "./RegisterVoceriaForm";

const Navbar = () => {
  const { data: session }: any = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [consejosOpen, setConsejosOpen] = useState(false);
  const [isVoceriaModalOpen, setIsVoceriaModalOpen] = useState(false);

  // Crear la navegación dependiendo del rol del usuario
  const allNavigation = [
    { name: "Administrar usuarios", href: "/admin-user", icon: <FaRegUser /> },
    { name: "Administrar roles", href: "/admin-role", icon: <PiScrollBold /> },
    { name: "Personas", href: "/personas", icon: <FaPerson /> },
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
        <div className="flex gap-2 items-center relative">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image
              src="/inces.jpg"
              width={45}
              height={45}
              alt="logo"
              className="rounded-3xl"
            />
          </Link>

          {/* Menú del usuario */}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center text-white text-xs font-medium hover:underline">
              {session?.user?.email}
              <FaChevronDown className="ml-1 h-3 w-3" />
            </Menu.Button>

            <Menu.Items className="absolute z-50 mt-2 w-52 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
                    >
                      <FaKey className="mr-2" />
                      Cambiar contraseña
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>

        {/* Navegación segun el rol */}
        <div className="flex flex-col gap-6 px-2 py-6">
          {/* Submenú Consejos Comunales */}
        <div className="flex flex-col relative">
          <button
            onClick={() => setConsejosOpen(!consejosOpen)}
            className="flex gap-2 items-center text-base font-semibold text-white hover:text-gray-300 rounded justify-between w-full"
          >
            <span className="flex gap-2 items-center">
              <FaUsers />
              Consejos Comunales
            </span>
            <FaChevronDown
              className={`h-3 w-3 transition-transform duration-300 ${
                consejosOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              consejosOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
            } flex flex-col pl-9 gap-1 font-semibold`}
          >
            <Link
              href="/consejos-comunales"
              className="text-sm text-gray-200 hover:text-white py-1"
            >
              Ver Consejos
            </Link>
            <Link
              href="/consejos-comunales/register-consejo"
              className="text-sm text-gray-200 hover:text-white py-1"
            >
              Registrar Consejo
            </Link>
            <Link
              href="/vocerias"
              className="text-sm text-gray-200 hover:text-white py-1"
            >
              Ver Comités
            </Link>
            <button
              onClick={() => setIsVoceriaModalOpen(true)}
              className="text-sm text-gray-200 hover:text-white py-1 text-left"
            >
              Registrar Comité
            </button>
          </div>
        </div>

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

            <Button onClick={() => signOut()} title="Cerrar sesión"></Button>
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
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <Modal
        open={isVoceriaModalOpen}
        onClose={() => setIsVoceriaModalOpen(false)}
        title="Registrar Comité"
      >
        <RegisterVoceriaForm onSuccess={() => setIsVoceriaModalOpen(false)} />
      </Modal>
    </header>
  );
};

export default Navbar;