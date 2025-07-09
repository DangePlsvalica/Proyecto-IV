"use client";
import Link from "next/link";
import React from "react";

interface ButtonProps {
  href?: string;
  title: string;
  className?: string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  href,
  title,
  className = "",
  onClick,
  disabled = false,
  type = "button",            // ← por defecto "button"
}) => {
  const base ="rounded-md px-3 py-2 border border-gray-500 text-sm font-semibold shadow-sm transition-all duration-200 ease-in-out";
  const enabled = "bg-sky-950 text-white hover:bg-sky-900";
  const disabledCls = "bg-white text-sky-950 cursor-not-allowed hover:bg-gray-500";
  const classes = `${base} ${disabled ? disabledCls : enabled} ${className}`;

  // 👉 1. Si viene href, renderizamos Link
  if (href) {
    return (
      <Link href={href} className={classes}>
        {title}
      </Link>
    );
  }

  // 👉 2. En cualquier otro caso, un botón normal (sirve para onClick o submit)
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {title}
    </button>
  );
};

export default Button;
