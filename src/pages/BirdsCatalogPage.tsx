import { useState, useEffect, useCallback } from "react";
import { authFetch } from "../api/client";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Search, Bird, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BirdFullDetailsDTO {
  id: number;
  commonName: string;
  scientificName: string;
  familyName: string;
  imageUrl?: string;
  displayText?: string;
  searchableText?: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function BirdsCatalogPage() {
  const [birds, setBirds] = useState<BirdFullDetailsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 50,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: "commonName" as "commonName" | "scientificName" | "familyName",
    sortDirection: "ASC" as "ASC" | "DESC",
  });
  const navigate = useNavigate();

  // Fetch birds with pagination and sorting
  const fetchBirds = useCallback(
    async (page: number = 0, query: string = "") => {
      try {
        if (query) {
          setSearchLoading(true);
        } else {
          setLoading(true);
        }
        setError(null);
        setAuthError(null);

        let response;
        if (query) {
          response = await authFetch(
            `/api/birds/search?query=${encodeURIComponent(query)}&limit=${
              pagination.size
            }`
          );

          // Check for authentication error
          if (response.status === 401 || response.status === 403) {
            const errorData = await response.json();
            if (errorData.code === "userNotAuthenticated") {
              setAuthError("Please log in to access bird data");
            }
          }

          const searchResults = await response.json();
          console.log("Search API response:", searchResults);

          setBirds(searchResults);
          setPagination((prev) => ({
            ...prev,
            page: 0,
            totalPages: 1,
            totalElements: searchResults.length,
          }));
        } else {
          response = await authFetch(
            `/api/birds?page=${page}&size=${pagination.size}`
          );

          // Check for authentication error
          if (response.status === 401 || response.status === 403) {
            const errorData = await response.json();
            if (errorData.code === "userNotAuthenticated") {
              setAuthError("Please log in to access bird data");
            }
          }

          const paginatedResponse: PaginatedResponse<BirdFullDetailsDTO> =
            await response.json();
          console.log("Birds API response:", paginatedResponse);

          setBirds(paginatedResponse.content);
          setPagination((prev) => ({
            ...prev,
            page: paginatedResponse.number,
            totalPages: paginatedResponse.totalPages,
            totalElements: paginatedResponse.totalElements,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch birds:", err);
        setError("Failed to load birds. Please try again.");
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    },
    [pagination.size]
  );

  useEffect(() => {
    fetchBirds(0);
  }, [fetchBirds]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    fetchBirds(0, searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchBirds(0);
  };

  const handleSort = (
    field: "commonName" | "scientificName" | "familyName"
  ) => {
    const newDirection =
      sortConfig.sortBy === field && sortConfig.sortDirection === "ASC"
        ? "DESC"
        : "ASC";
    setSortConfig({ sortBy: field, sortDirection: newDirection });

    // Sort client-side since we have all data
    const sortedBirds = [...birds].sort((a, b) => {
      const aValue = a[field].toLowerCase();
      const bValue = b[field].toLowerCase();

      if (newDirection === "ASC") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setBirds(sortedBirds);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchBirds(newPage, searchTerm);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-offwhite rounded-xl shadow-soft border border-purple p-6 mb-6">
        <h1 className="text-3xl font-logo text-purple mb-6 flex items-center">
          <Bird className="w-8 h-8 mr-3" />
          Bird Catalog
        </h1>

        {/* Authentication Warning */}
        {authError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={(e) => handleSearch(e)} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or scientific name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage font-sans text-purple font-thin tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="bg-purple/60 hover:text-purple/70 hover:shadow-md text-lilac text-lg font-semibold font-sans rounded-lg px-6 py-3 transition duration-200 shadow-md disabled:opacity-50 flex items-center"
            >
              {searchLoading ? (
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

            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-sage/60 hover:text-sage/70 hover:shadow-md text-offwhite text-lg font-semibold font-sans rounded-lg px-6 py-3 transition duration-200 shadow-md"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-purple/70 font-sans">
          {searchTerm ? (
            <span>
              Found {birds.length} {birds.length === 1 ? "result" : "results"}{" "}
              for "{searchTerm}"
            </span>
          ) : (
            <span>
              Showing {birds.length} of {pagination.totalElements} birds
            </span>
          )}
        </div>

        {/* Birds Table */}
        <div className="overflow-x-auto rounded-lg shadow-md border border-offwhite">
          <table className="w-full ">
            <thead className="bg-sage text-white font-semibold font-md ">
              <tr>
                <th
                  className="px-6 py-3 text-left cursor-pointer hover:bg-sage/80"
                  onClick={() => handleSort("commonName")}
                >
                  Common Name{" "}
                  {sortConfig.sortBy === "commonName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-3 text-left cursor-pointer hover:bg-sage/80"
                  onClick={() => handleSort("scientificName")}
                >
                  Scientific Name{" "}
                  {sortConfig.sortBy === "scientificName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-3 text-left cursor-pointer hover:bg-sage/80"
                  onClick={() => handleSort("familyName")}
                >
                  Family{" "}
                  {sortConfig.sortBy === "familyName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              {birds.map((bird) => (
                <tr
                  key={bird.id}
                  className="hover:bg-lilac/20 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-purple/90">
                    {bird.commonName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 italic">
                    {bird.scientificName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {bird.familyName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/birds/${bird.id}`, { state: bird })
                      }
                      className="p-2 rounded-lg hover:bg-sage/20"
                    >
                      <Eye className="w-5 h-5 text-sage" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {birds.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <Bird className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No birds found{searchTerm && ` for "${searchTerm}"`}</p>
            </div>
          )}
        </div>

        {/* Pagination - Only show if not searching and multiple pages exist */}
        {!searchTerm && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-1">
              {(() => {
                const total = pagination.totalPages;
                const current = pagination.page;
                const maxButtons = 5;

                let start = Math.max(0, current - Math.floor(maxButtons / 2));
                let end = start + maxButtons;

                if (end > total) {
                  end = total;
                  start = Math.max(0, end - maxButtons);
                }

                return Array.from({ length: end - start }, (_, i) => {
                  const pageNum = start + i;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg ${
                        pagination.page === pageNum
                          ? "bg-sage text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                });
              })()}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages - 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
