import { FaHiking } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Header() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isAuthenticated, logoutUser, username, firstname, lastname } =
    context;
  console.log(context);
  return (
    <header className="sticky top-0 z-50 shadow-edge border border-lilac/80 p-2 h-20">
      <nav className="flex justify-between sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-200"
        >
          <img
            src="/images/logoSquared.png"
            className="shadow-heavy w-16 h-16 rounded-full border-2 border-lilac/80"
            alt="Logo"
          />
          <span className="text-purple font-logo text-3xl font-bold tracking-widest">
            Spot A Bird
          </span>
        </Link>
        {isAuthenticated && (
          <div className="flex items-center">
            <Link
              to="./user-profile"
              className="decoration-none font-semibold tracking-wider underline text-purple hover:text-purple/80 transition"
            >
              {firstname && lastname ? `${firstname} ${lastname}` : username}
            </Link>
            <div className="flex items-center gap-4 group relative">
              <button
                type="button"
                onClick={logoutUser}
                className="bg-lilac text-purple m-2 rounded shadow-heavy hover:bg-lilac/80 transition"
              >
                <FaHiking className="m-2 h-8 w-8" />
              </button>
              <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-purple text-offwhite text-xs font-sans px-2 py-1 rounded whitespace-nowrap -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                Logout
              </span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
