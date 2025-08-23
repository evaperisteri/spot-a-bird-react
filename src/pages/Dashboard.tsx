import { useState, useEffect, useMemo } from "react";
import TableDashboard from "../components/ui/TableDashboard";
import { birdwatchinglogs } from "../api/birdwatchinglogs";
import type {
  BirdwatchingLogTableItem,
  BirdwatchingLogReadOnlyDTO,
} from "../types/birdwatchingTypes";
import { Search } from "lucide-react";

// Mapping function
const mapLogDTOtoTableItem = (
  dto: BirdwatchingLogReadOnlyDTO
): BirdwatchingLogTableItem => ({
  id: dto.id,
  commonName: dto.bird.name,
  scientificName: dto.bird.scientificName,
  regionName: dto.region.name,
  quantity: dto.quantity,
  user: dto.user,
  observationDate: dto.createdAt,
});

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allLogs, setAllLogs] = useState<BirdwatchingLogTableItem[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<BirdwatchingLogTableItem[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all logs on mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await birdwatchinglogs.getPaginatedLogs(
          0,
          1000, // Increased to get more logs
          "createdAt",
          "DESC"
        );
        const mappedLogs = (response.content || []).map(mapLogDTOtoTableItem);
        setAllLogs(mappedLogs);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setError("Could not load logs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Client-side filtering using useMemo for performance
  const clientFilteredLogs = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }

    const term = searchTerm.toLowerCase().trim();
    return allLogs.filter(
      (log) =>
        log.commonName.toLowerCase().includes(term) ||
        log.scientificName.toLowerCase().includes(term) ||
        log.regionName.toLowerCase().includes(term) ||
        log.user?.username.toLowerCase().includes(term)
    );
  }, [searchTerm, allLogs]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setFilteredLogs([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try server-side search first
      const response = await birdwatchinglogs.searchLogs(
        searchTerm.trim(),
        0, // page
        50, // size
        "createdAt", // sortBy
        "DESC" // sortDirection
      );

      const mappedLogs = (response.content || []).map(mapLogDTOtoTableItem);
      setFilteredLogs(mappedLogs);
      setIsSearching(true);
    } catch (err) {
      console.error("Server search error, falling back to client search:", err);

      // Fall back to client-side search if server search fails
      setFilteredLogs(clientFilteredLogs);
      setIsSearching(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredLogs([]);
    setIsSearching(false);
    setError(null);
  };

  // Determine which logs to display
  const logsToDisplay = isSearching ? filteredLogs : allLogs;

  return (
    <>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="What are you looking for? (bird name, location, spotter, etc.)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={handleKeyPress}
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
              <Search
                className="my-auto w-5 h-5 text-purple"
                strokeWidth={1.5}
              />
              Searching...
            </span>
          ) : (
            <span className="flex gap-2">
              <Search
                className="my-auto w-5 h-5 text-purple"
                strokeWidth={1.5}
              />
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
              ? `Search Results (${logsToDisplay.length})`
              : "All Recent Sightings"}
          </h2>

          {isSearching && logsToDisplay.length > 0 && (
            <span className="text-purple/70 font-sans">
              Found {logsToDisplay.length} matching logs
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto"></div>
            <p className="mt-4 text-purple/70">Loading logs...</p>
          </div>
        ) : (
          <TableDashboard logs={logsToDisplay} showHeader={true} />
        )}
      </div>
    </>
  );
}
