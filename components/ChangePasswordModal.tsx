'use client'
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useChangePassword } from "@/hooks/useChangePassword";
import Button from "@/components/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const { changePassword, isLoading } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    await changePassword({ currentPassword, newPassword });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Fondo con animación */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          {/* Contenedor del modal */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-lg">
              <Dialog.Title className="text-lg font-bold mb-4">Cambiar contraseña</Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={onClose} className="text-sm text-gray-500">
                    Cancelar
                  </button>
                  <Button
                    title={isLoading ? "Cambiando..." : "Guardar"}
                    type="submit"
                    disabled={isLoading}
                  />
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}