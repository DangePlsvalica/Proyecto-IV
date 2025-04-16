import Link from "next/link";

interface ButtonProps {
  href?: string; 
  title: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
}

const Buttonanimation: React.FC<ButtonProps> = ({ href, title, className, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`button ${className}`}
      >
          <span className="button_top">{title}</span>
        
      </button>
    );
  }
  return (
    <Link
      href={href!}
      className={`button ${className}`}
    >
      <span className="button_top">{title}</span>
    </Link>
  );
};

export default Buttonanimation;

