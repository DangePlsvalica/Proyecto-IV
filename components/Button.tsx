import Link from "next/link";

interface ButtonProps {
  href?: string; 
  title: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
  disabled?: any;
}

const Button: React.FC<ButtonProps> = ({ href, title, className, onClick, disabled=false }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`rounded-md px-3 py-2 border border-gray-500 text-sm font-semibold shadow-sm 
                  transition-all duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 
                  focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    disabled 
                      ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-500' 
                      : 'bg-sky-950 text-white hover:bg-sky-900'
                  } ${className}`}
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

