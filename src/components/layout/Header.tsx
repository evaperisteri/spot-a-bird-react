import { FaHiking } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-offwhite border border-lilac">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4 ">
        <Link
          to="/"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-200"
        >
          <img
            src="/images/logoSquared.png"
            className="w-16 h-16 rounded-full border-4 border-lilac"
            alt="Logo"
          />
          <span className="text-purple font-logo text-3xl">Spot A Bird</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="bg-lilac text-purple p-2 rounded-full shadow-soft">
            <FaHiking className="px-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
