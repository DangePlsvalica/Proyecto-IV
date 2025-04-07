import Link from "next/link";

interface ButtonProps {
  href?: string; 
  title: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ href, title, className, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`rounded-md bg-sky-950 px-3 py-2 border border-gray-500 
                  text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out
                hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                  focus-visible:outline-indigo-600 ${className}`}
      >
        {title}
      </button>
    );
  }
  return (
    <Link
      href={href!}
      className={`rounded-md bg-sky-950 px-3 py-2 border border-gray-500 
                text-sm font-semibold text-white shadow-sm hover:bg-sky-900 
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                focus-visible:outline-indigo-600 ${className}`}
    >
      {title}
    </Link>
  );
};

export default Button;

