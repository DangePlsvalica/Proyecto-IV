import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";

interface DeleteButtonProps {
  onClick: () => void;
  isPending: boolean;
  label?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  isPending,
  label = "Eliminar",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="bg-red-700 flex gap-2 items-center text-white text-sm px-3 py-2 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaRegTrashAlt />
      {isPending ? "Eliminando..." : label}
    </button>
  );
};

export default DeleteButton;


