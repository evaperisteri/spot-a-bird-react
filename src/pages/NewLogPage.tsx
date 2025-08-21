import { Link } from "react-router-dom";
import Logform from "../components/ui/logform";

export default function NewLogPage() {
  return (
    <main className="mt-4 mx-4 lg:mx-10 p-4 md:p-8 rounded-xl shadow-soft border-2 border-lilac/60 bg-offwhite grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[60vh]">
      {/* Sidebar */}
      <div className="md:col-span-3 flex flex-col sm:flex-row md:flex-col gap-4 rounded-xl shadow-soft border-2 border-purple/80 m-4 p-4">
        <Link
          to="/dashboard"
          className="block bg-sage hover:bg-sage/80 text-offwhite text-lg md:text-xl font-sans font-semibold tracking-wide rounded-lg text-center w-full p-4 transition duration-200 shadow-md"
        >
          Home
        </Link>
        <Link
          to="/user-profile"
          className="block bg-sage hover:bg-sage/80 text-offwhite text-lg md:text-xl font-sans font-semibold tracking-wide rounded-lg text-center w-full p-4 transition duration-200 shadow-md"
        >
          My Profile
        </Link>
      </div>

      {/* Form Content */}
      <div className="md:col-span-9">
        <div className="mt-4 px-4 lg:px-20">
          <span className="block text-center font-semibold font-logo tracking-wider rounded-xl shadow-soft text-purple text-2xl border border-purple p-4 m-4">
            New Log Form
          </span>
        </div>

        <div className="mt-4 lg:px-20">
          <div className="text-center font-logo rounded-xl shadow-soft text-purple text-lg border border-purple md:p-10 m-4">
            <Logform />
          </div>
        </div>
      </div>
    </main>
  );
}
