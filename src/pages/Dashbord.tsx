import { ButtonHome } from "../components/ui/ButtonHome";
import TableDashboard from "../components/ui/TableDashboard";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="mt-4 mx-10 p-4 md:p-8 rounded-xl shadow-soft border-2 border-lilac/60 bg-offwhite grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[80vh]">
      {/* Sidebar */}
      <div className="md:col-span-2 flex flex-col sm:flex-row md:flex-col gap-4 rounded-xl shadow-soft border-2 border-purple/80 p-4 items-center text-center justify-center">
        <ButtonHome type="button" to="/myinfo">
          My Profile
        </ButtonHome>
        <ButtonHome type="button" to="/newlog">
          New Log
        </ButtonHome>
      </div>

      {/* Main content */}
      <div className="md:col-span-10 flex flex-col">
        {/* Search bar */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="block bg-lilac/40 border border-purple rounded-lg w-full p-3 hover:ring-2 hover:ring-purple/70 focus:outline-2 focus:outline-offset-2 focus:outline-sage font-sans text-purple font-thin tracking-wider"
          />
          <button
            className="bg-purple/60 hover:text-purple/70 hover:shadow-md text-lilac text-lg font-semibold font-sans rounded-lg px-6 py-3 transition duration-200 shadow-md"
            type="button"
          >
            <Link to="./view-filtered-logs.html" className="flex gap-2">
              <svg
                className="my-auto w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              Search
            </Link>
          </button>
        </div>

        {/* Table section */}
        <div className="mt-8 overflow-x-auto">
          <h2 className="font-logo text-purple mb-4 text-2xl">
            Spotted lately!
          </h2>
          <TableDashboard />
        </div>
      </div>
    </div>
  );
}
