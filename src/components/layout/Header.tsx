import { FaHiking } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { UserRound } from "lucide-react";

export default function Header() {
  const context = useContext(AuthContext);
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);

  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isAuthenticated, logoutUser, username, firstname, lastname } =
    context;

  // Handle image error with proper TypeScript typing
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget;
    target.style.display = "none";

    // Show fallback logo
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.classList.remove("hidden");
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-edge border-b border-lilac/60 p-2 h-16 lg:h-20 bg-offwhite/80 backdrop-blur-sm">
      <nav className="flex justify-between items-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 group"
        >
          <div className="relative">
            <img
              src="/images/Chat2.png"
              className="shadow-heavy w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-lilac/80 hover:border-sage transition-all duration-300 group-hover:scale-105"
              alt="Spot A Bird Logo"
              onError={handleImageError}
            />
            {/* Fallback logo */}
            <div className="hidden w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-sage items-center justify-center border-2 border-lilac/80">
              <span className="text-offwhite font-bold text-lg">🐦</span>
            </div>
          </div>
          <span className="text-purple font-logo text-2xl lg:text-3xl font-bold tracking-wider hover:text-sage transition-colors">
            Spot A Bird
          </span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <Link
              to="/myinfo"
              className="flex items-center gap-2 decoration-none font-semibold tracking-wide text-purple hover:text-sage transition-colors group/profile"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm lg:text-base">
                  {firstname && lastname
                    ? `${firstname} ${lastname}`
                    : username}
                </span>
                <span className="text-xs text-purple/70">
                  <UserRound className="inline h-4 w-4" />
                  View Profile
                </span>
              </div>
              {/* <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-lilac/30 flex items-center justify-center border border-lilac/50 group-hover/profile:bg-sage/20 transition-colors">
                <FaUser className="w-4 h-4 text-purple/70" />
              </div> */}
            </Link>

            <div className="relative group">
              <button
                type="button"
                onClick={logoutUser}
                onMouseEnter={() => setShowLogoutTooltip(true)}
                onMouseLeave={() => setShowLogoutTooltip(false)}
                className="bg-lilac/50 hover:bg-lilac/70 text-purple p-2 rounded-lg shadow-heavy hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                aria-label="Logout"
              >
                <FaHiking className="w-5 h-5" />
              </button>

              {/* Tooltip */}
              <div
                className={`absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-purple text-offwhite text-xs font-sans px-3 py-1.5 rounded whitespace-nowrap -bottom-10 left-1/2 transform -translate-x-1/2 pointer-events-none ${
                  showLogoutTooltip ? "opacity-100" : "opacity-0"
                }`}
              >
                Logout
                {/* Tooltip arrow */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-b-purple border-transparent"></div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
