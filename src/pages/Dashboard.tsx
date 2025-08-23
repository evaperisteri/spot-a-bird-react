import { useState } from "react";
import TableDashboard from "../components/ui/TableDashboard";
import { birdwatchinglogs } from "../api/birdwatchinglogs";
import type {
  BirdwatchingLogTableItem,
  BirdWatchingLogFilters,
} from "../types/birdwatchingTypes";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<BirdwatchingLogTableItem[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle search submission
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredLogs([]);
      setIsSearching(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const filters: BirdWatchingLogFilters = {
        searchTerm: searchTerm.trim(),
      };

      const response = await birdwatchinglogs.getFilteredPaginatedLogs(
        filters,
        0, // page
        50, // size (or any reasonable limit)
        "createdAt", // sortBy
        "DESC" // sortDirection
      );

      setFilteredLogs(response.content || []);
      setIsSearching(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search logs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pressing Enter key in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search and show all logs again
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredLogs([]);
    setIsSearching(false);
    setError(null);
  };

  return (
    <>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="What are you looking for? (bird name, location, etc.)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="block bg-lilac/40 border border-purple rounded-lg w-full p-3 hover:ring-2 hover:ring-purple/70 focus:outline-2 focus:outline-offset-2 focus:outline-sage font-sans text-purple font-thin tracking-wider"
        />
        <button
          className="bg-purple/60 hover:text-purple/70 hover:shadow-md text-lilac text-lg font-semibold font-sans rounded-lg px-6 py-3 transition duration-200 shadow-md disabled:opacity-50"
          onClick={handleSearch}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? (
            <span className="flex gap-2">
              <svg
                className="animate-spin my-auto w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 .398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              Searching...
            </span>
          ) : (
            <span className="flex gap-2">
              <svg
                className="my-auto w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              Search
            </span>
          )}
        </button>

        {isSearching && (
          <button
            className="bg-sage/60 hover:text-sage/70 hover:shadow-md text-offwhite text-lg font-semibold font-sans rounded-lg px-6 py-3 transition duration-200 shadow-md"
            onClick={clearSearch}
            type="button"
          >
            Clear Search
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-logo text-purple text-2xl">
            {isSearching
              ? `Search Results (${filteredLogs.length})`
              : "Spotted lately!"}
          </h2>

          {isSearching && filteredLogs.length > 0 && (
            <span className="text-purple/70 font-sans">
              Found {filteredLogs.length} matching logs
            </span>
          )}
        </div>

        {/* Pass the filtered logs to TableDashboard when searching */}
        {isSearching ? (
          <TableDashboard logs={filteredLogs} showHeader={false} />
        ) : (
          <TableDashboard showHeader={false} />
        )}
      </div>
    </>
  );
}
