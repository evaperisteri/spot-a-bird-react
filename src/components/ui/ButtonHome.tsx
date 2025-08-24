import { Link } from "react-router-dom";

type ButtonProps = {
  to?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset"; // Made optional since Link doesn't need it
  onClick?: (e: React.MouseEvent) => void;
};

export const ButtonHome = ({
  to,
  children,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) => {
  const baseClasses = `bg-sage hover:bg-sage/80 text-offwhite text-lg md:text-xl 
                      font-sans font-semibold tracking-wide rounded-lg text-center 
                      px-6 py-3 transition-all duration-200 ease-in-out
                      shadow-heavy hover:shadow-lg transform hover:scale-102
                      w-full max-w-xs`;

  return to ? (
    <Link
      to={to}
      className={`${baseClasses} ${className}`}
      onClick={onClick} // Add onClick to Link
    >
      {children}
    </Link>
  ) : (
    <button
      type={type} // Use the type prop
      className={`${baseClasses} ${className}`}
      onClick={onClick} // Pass onClick to button
    >
      {children}
    </button>
  );
};
