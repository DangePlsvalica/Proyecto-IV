import React from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import DeleteButton from "@/components/DeleteButton";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemToDelete: string;
  isPending: boolean;
  title?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  itemToDelete,
  isPending,
  title = "Confirmar Eliminación",
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      width="w-full max-w-md" 
      title={title}
    >
      <div className="px-6 py-4 text-center space-y-6">
        <p className="text-gray-700 text-lg">
          ¿Estás seguro de que quieres {itemToDelete}?
          <br />
          <span className="font-semibold text-red-600">
            Esta acción no se puede deshacer.
          </span>
        </p>
        <div className="flex justify-center space-x-3 pt-2">
          <Button 
            onClick={onClose} 
            title="Cancelar" 
            disabled={isPending}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          />
          <DeleteButton
            onClick={onConfirm}
            isPending={isPending}
            label={`Confirmar Eliminación`}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;