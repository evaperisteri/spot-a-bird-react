import { Link } from "react-router-dom";

type ButtonProps = {
  to?: string;
  children: React.ReactNode;
  className?: string;
  type: string;
};

export const ButtonHome = ({ to, children, className = "" }: ButtonProps) => {
  const baseClasses = `bg-sage hover:bg-sage/80 text-offwhite text-lg md:text-xl 
                      font-sans font-semibold tracking-wide rounded-lg text-center 
                      px-6 py-3 transition-all duration-200 ease-in-out
                      shadow-heavy hover:shadow-lg transform hover:scale-102
                      w-full max-w-xs`;

  return to ? (
    <Link to={to} className={`${baseClasses} ${className}`}>
      {children}
    </Link>
  ) : (
    <button className={`${baseClasses} ${className}`}>{children}</button>
  );
};
