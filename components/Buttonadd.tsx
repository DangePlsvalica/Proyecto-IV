import Link from "next/link";

interface ButtonProps {
  href?: string; 
  title: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
}

const Buttonadd: React.FC<ButtonProps> = ({ href, title, className, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`buttonadd animate-fade-centerr ${className}`}
      >
          <span className="buttonadd__text">{title}
          </span>
          <span className="buttonadd__icon">
          <svg 
          className="svgadd" 
          fill="none" 
          height="24" 
          stroke="currentColor" 
          strokeLinecap="round"
          strokeLinejoin="round" 
          strokeWidth="2"  
          viewBox="0 0 24 24" 
          width="24" 
          xmlns="http://www.w3.org/2000/svg">
          <line x1="12" x2="12" y1="5" y2="19">
           </line>
          <line x1="5" x2="19" y1="12" y2="12">
            </line>
          </svg>
          </span>
        
      </button>
    );
  }
  return (
    <Link
      href={href!}
      className={`buttonadd ${className}`}
    >
          <span className="buttonadd__text">{title}
          </span>
          <span className="buttonadd__icon">
          <svg 
          className="svgadd" 
          fill="none" 
          height="24" 
          stroke="currentColor" 
          strokeLinecap="round"
          strokeLinejoin="round" 
          strokeWidth="2"  
          viewBox="0 0 24 24" 
          width="24" 
          xmlns="http://www.w3.org/2000/svg">
          <line x1="12" x2="12" y1="5" y2="19">
           </line>
          <line x1="5" x2="19" y1="12" y2="12">
            </line>
          </svg>
          </span>
    </Link>
  );
};

export default Buttonadd;

