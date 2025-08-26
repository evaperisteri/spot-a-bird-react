import { useState, useEffect, useCallback } from "react";
import { authFetch } from "../api/client";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  Search,
  Bird,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  const [expandedBird, setExpandedBird] = useState<number | null>(null);
  const navigate = useNavigate();

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

          if (response.status === 401 || response.status === 403) {
            const errorData = await response.json();
            if (errorData.code === "userNotAuthenticated") {
              setAuthError("Please log in to access bird data");
            }
          }

          const searchResults = await response.json();
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

          if (response.status === 401 || response.status === 403) {
            const errorData = await response.json();
            if (errorData.code === "userNotAuthenticated") {
              setAuthError("Please log in to access bird data");
            }
          }

          const paginatedResponse: PaginatedResponse<BirdFullDetailsDTO> =
            await response.json();
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

  const toggleBirdExpand = (birdId: number) => {
    setExpandedBird(expandedBird === birdId ? null : birdId);
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
      <div className="rounded-xl shadow-soft border border-offwhite/80 p-4 md:p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-logo text-purple mb-6 flex items-center">
          <Bird className="w-6 h-6 md:w-8 md:h-8 mr-3" />
          Bird Catalog
        </h1>

        {/* Authentication Warning */}
        {authError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 md:p-4 rounded-lg mb-6 text-sm md:text-base">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 mr-2"
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
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Search by name or scientific name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={handleKeyPress}
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage font-sans text-purple font-thin tracking-wider text-sm md:text-base"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-purple/60 hover:text-purple/70 hover:shadow-md text-lilac text-base font-semibold font-sans rounded-lg px-4 md:px-6 py-2 md:py-3 transition duration-200 shadow-md disabled:opacity-50 flex items-center flex-1 justify-center"
              >
                {searchLoading ? (
                  <span className="flex gap-1 md:gap-2 items-center text-sm md:text-base">
                    <Search
                      className="w-4 h-4 md:w-5 md:h-5 text-purple"
                      strokeWidth={1.5}
                    />
                    <span className="hidden sm:inline">Searching...</span>
                  </span>
                ) : (
                  <span className="flex gap-1 md:gap-2 items-center text-sm md:text-base">
                    <Search
                      className="w-4 h-4 md:w-5 md:h-5 text-purple"
                      strokeWidth={1.5}
                    />
                    <span className="sm:inline">Search</span>
                    <span className="sm:hidden"></span>
                  </span>
                )}
              </button>

              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="bg-sage/60 hover:text-sage/70 hover:shadow-md text-offwhite text-base font-semibold font-sans rounded-lg px-4 md:px-6 py-2 md:py-3 transition duration-200 shadow-md md:text-base"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3 md:p-4 rounded-lg mb-6 text-sm md:text-base">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-purple/70 font-sans text-sm md:text-base">
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

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-offwhite">
          <table className="w-full">
            <thead className="bg-sage text-white font-semibold">
              <tr>
                <th
                  className="px-4 md:px-6 py-3 text-left cursor-pointer hover:bg-sage/80 text-sm md:text-base"
                  onClick={() => handleSort("commonName")}
                >
                  Common Name{" "}
                  {sortConfig.sortBy === "commonName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 md:px-6 py-3 text-left cursor-pointer hover:bg-sage/80 text-sm md:text-base"
                  onClick={() => handleSort("scientificName")}
                >
                  Scientific Name{" "}
                  {sortConfig.sortBy === "scientificName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 md:px-6 py-3 text-left cursor-pointer hover:bg-sage/80 text-sm md:text-base"
                  onClick={() => handleSort("familyName")}
                >
                  Family{" "}
                  {sortConfig.sortBy === "familyName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th className="px-4 md:px-6 py-3 text-center text-sm md:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {birds.map((bird) => (
                <tr
                  key={bird.id}
                  className="hover:bg-lilac/20 transition-colors"
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold text-purple/90">
                    {bird.commonName}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-600 italic">
                    {bird.scientificName}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-600">
                    {bird.familyName}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/birds/${bird.id}`, { state: bird })
                      }
                      className="p-2 rounded-lg hover:bg-sage/20 transition-colors"
                    >
                      <Eye className="w-4 h-4 md:w-5 md:h-5 text-sage" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {birds.map((bird) => (
            <div
              key={bird.id}
              className="bg-white rounded-lg shadow-md border border-purple/20 p-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleBirdExpand(bird.id)}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-purple text-base">
                    {bird.commonName}
                  </h3>
                  <p className="text-gray-600 text-sm italic">
                    {bird.scientificName}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/birds/${bird.id}`, { state: bird });
                    }}
                    className="p-1 rounded-lg hover:bg-sage/20"
                  >
                    <Eye className="w-4 h-4 text-sage" />
                  </button>
                  {expandedBird === bird.id ? (
                    <ChevronUp className="w-4 h-4 text-purple" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-purple" />
                  )}
                </div>
              </div>

              {expandedBird === bird.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 text-sm">
                      Family:
                    </span>
                    <span className="text-gray-800 text-sm">
                      {bird.familyName}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/birds/${bird.id}`, { state: bird })
                    }
                    className="w-full bg-sage/10 text-sage font-semibold py-2 rounded-lg text-sm hover:bg-sage/20 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {birds.length === 0 && !loading && (
          <div className="text-center py-8 md:py-12 text-gray-500">
            <Bird className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-gray-300" />
            <p className="text-sm md:text-base">
              No birds found{searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!searchTerm && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="p-1 md:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
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
                      className={`px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm ${
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
              className="p-1 md:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
