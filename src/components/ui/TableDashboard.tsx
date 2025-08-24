import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash } from "lucide-react";
import { birdwatchinglogs } from "../../api/birdwatchinglogs";
import type { BirdwatchingLogTableItem } from "../../types/birdwatchingTypes";
import { useAuth } from "../../hooks/useAuth";

interface TableDashboardProps {
  logs?: BirdwatchingLogTableItem[];
  showHeader?: boolean;
  onLogsChange?: (logs: BirdwatchingLogTableItem[]) => void;
}

export default function TableDashboard({
  logs: externalLogs,
  showHeader = true,
  onLogsChange,
}: TableDashboardProps) {
  const { userId: currentUserId } = useAuth();
  const [internalLogs, setInternalLogs] = useState<BirdwatchingLogTableItem[]>(
    []
  );
  const [loading, setLoading] = useState(!externalLogs);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortLoading, setSortLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sortBy: "createdAt" as
      | "createdAt"
      | "birdName"
      | "regionName"
      | "scientificName"
      | "spotter",
    sortDirection: "DESC" as "ASC" | "DESC",
  });

  const initialLoad = useRef(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const getSortedLogs = useCallback(() => {
    if (!externalLogs) return internalLogs; // Server-side sorted

    // Client-side sorting for external logs
    return [...(externalLogs || [])].sort((a, b) => {
      const direction = sortConfig.sortDirection === "ASC" ? 1 : -1;

      switch (sortConfig.sortBy) {
        case "createdAt": {
          const dateA = new Date(a.observationDate || 0).getTime();
          const dateB = new Date(b.observationDate || 0).getTime();
          return (dateB - dateA) * direction;
        }
        case "birdName":
          return a.commonName.localeCompare(b.commonName) * direction;

        case "scientificName":
          return a.scientificName.localeCompare(b.scientificName) * direction;

        case "regionName":
          return a.regionName.localeCompare(b.regionName) * direction;

        case "spotter":
          return (
            (a.user?.username || "").localeCompare(b.user?.username || "") *
            direction
          );

        default:
          return 0;
      }
    });
  }, [externalLogs, internalLogs, sortConfig]);

  const sortedLogs = getSortedLogs();
  const totalPages = externalLogs
    ? Math.ceil(sortedLogs.length / itemsPerPage)
    : pagination.totalPages;
  // Calculate client-side pagination for external logs
  const getPaginatedLogs = useCallback(() => {
    if (!externalLogs) return internalLogs; // Server-side paginated

    // Client-side pagination for external logs
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedLogs.slice(startIndex, endIndex);
  }, [externalLogs, internalLogs, sortedLogs, currentPage]);

  const paginatedLogs = getPaginatedLogs();
  useEffect(() => {
    setCurrentPage(0); // Reset to first page when sorting changes
  }, [sortConfig]);

  const fetchMyLogs = useCallback(
    async (page: number = 0, size: number = 10) => {
      try {
        setLoading(true);
        setError(null);

        // Map frontend field names to backend field names if needed
        const backendSortBy =
          sortConfig.sortBy === "birdName"
            ? "bird.name"
            : sortConfig.sortBy === "scientificName"
            ? "bird.scientificName"
            : sortConfig.sortBy === "spotter"
            ? "user.username"
            : sortConfig.sortBy;
        console.log("Sending to backend:", {
          sortBy: backendSortBy,
          sortDirection: sortConfig.sortDirection,
          page,
          size,
        });

        const data = await birdwatchinglogs.getMyLogsPaginated(
          page,
          size,
          backendSortBy,
          sortConfig.sortDirection
        );
        console.log("Received from backend:", data);

        setInternalLogs(data.content || []);
        setPagination({
          page: data.number ?? page,
          size: data.size ?? size,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
        onLogsChange?.(data.content || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setError("Failed to fetch logs. Please try again.");
      } finally {
        setLoading(false);
        setSortLoading(false);
      }
    },
    [onLogsChange, sortConfig]
  );

  const handleSort = async (
    field:
      | "createdAt"
      | "birdName"
      | "regionName"
      | "scientificName"
      | "spotter"
  ) => {
    setSortLoading(true);
    setSortConfig((prev) => ({
      sortBy: field,
      sortDirection:
        prev.sortBy === field && prev.sortDirection === "ASC" ? "DESC" : "ASC",
    }));

    // For external logs, we don't need to refetch - just sort client-side
    if (externalLogs) {
      setTimeout(() => setSortLoading(false), 100); // Quick visual feedback
    }
  };

  // Initial fetch - only for user's own logs
  useEffect(() => {
    if (!externalLogs) {
      fetchMyLogs(0, 10);
    }
  }, [externalLogs, fetchMyLogs]);

  // Refetch when sort changes - only for user's own logs
  useEffect(() => {
    if (!externalLogs && !initialLoad.current) {
      fetchMyLogs(0, pagination.size);
    }
    initialLoad.current = false;
  }, [sortConfig, externalLogs, fetchMyLogs, pagination.size]);

  const handleDelete = async (logId: number) => {
    if (!confirm("Are you sure you want to delete this log?")) return;

    try {
      await birdwatchinglogs.deleteLog(logId);
      // Refresh the logs after deletion
      if (!externalLogs) {
        fetchMyLogs(pagination.page, pagination.size);
      } else {
        // If using external logs, let parent handle refresh
        onLogsChange?.(sortedLogs.filter((log) => log.id !== logId));
      }
    } catch (error) {
      console.error("Error deleting log:", error);
      setError("Failed to delete log. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto"></div>
        <p className="mt-4 text-purple/70">Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-rose-800 mb-4">{error}</p>
        <button
          onClick={() => fetchMyLogs(pagination.page, pagination.size)}
          className="bg-purple text-white px-4 py-2 rounded-md hover:bg-purple/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sortedLogs.length === 0) {
    return (
      <div className="text-center p-8 bg-offwhite/50 rounded-lg">
        <p className="text-purple/70 mb-4">No birdwatching logs found.</p>
        <Link
          to="/newlog"
          className="bg-sage text-offwhite px-4 py-2 rounded-md hover:bg-sage/80 transition-colors inline-block"
        >
          Create Your First Log
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-offwhite/80 rounded-lg shadow-soft p-6">
        {showHeader && (
          <div className="flex justify-between items-center mb-6"></div>
        )}

        <div className="overflow-x-auto border border-offwhite rounded-lg">
          <table className="w-full border-collapse ">
            <thead className="bg-purple/10">
              <tr className="border-b-2 border-purple/30">
                <th
                  className="p-3 text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("birdName")}
                >
                  Common Name{" "}
                  {sortConfig.sortBy === "birdName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>

                <th
                  className="p-3 text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("scientificName")}
                >
                  Scientific Name{" "}
                  {sortConfig.sortBy === "scientificName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>

                <th
                  className="p-3 text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("regionName")}
                >
                  Location{" "}
                  {sortConfig.sortBy === "regionName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>

                <th className="p-3 text-left font-sans font-semibold text-purple">
                  Quantity
                </th>

                <th
                  className="p-3 text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("spotter")}
                >
                  Spotter{" "}
                  {sortConfig.sortBy === "spotter" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>

                <th
                  className="p-3 text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("createdAt")}
                >
                  Date{" "}
                  {sortConfig.sortBy === "createdAt" && (
                    <>
                      {sortLoading ? (
                        <span className="animate-spin">⏳</span>
                      ) : sortConfig.sortDirection === "ASC" ? (
                        "↑"
                      ) : (
                        "↓"
                      )}
                    </>
                  )}
                </th>

                <th className="p-3 text-center font-sans font-semibold text-purple">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base">
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-purple/10 hover:bg-lilac/20 transition-colors"
                >
                  <td className="p-3 font-sans text-purple font-medium">
                    {log.commonName}
                  </td>
                  <td className="p-3 font-sans text-purple/70 text-sm">
                    {log.scientificName}
                  </td>
                  <td className="p-3 font-sans text-purple">
                    {log.regionName}
                  </td>
                  <td className="p-3 font-sans text-purple text-center">
                    {log.quantity}
                  </td>
                  <td className="p-3 font-sans text-purple">
                    {log.user?.username}
                  </td>
                  <td className="p-3 font-sans text-purple">
                    {log.observationDate
                      ? new Date(log.observationDate).toLocaleDateString()
                      : "No date available"}
                  </td>
                  <td className="p-3 flex justify-center space-x-3">
                    <Link
                      to={`/logs/${log.id}`}
                      className="p-1 hover:bg-lilac/30 rounded transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4 text-purple/70 hover:text-purple" />
                    </Link>
                    {log.user?.id === currentUserId && (
                      <Link
                        to={`/logs/${log.id}/edit`}
                        className="p-1 hover:bg-lilac/30 rounded transition-colors"
                        title="Edit log"
                      >
                        <Pencil className="w-4 h-4 text-purple/70 hover:text-sage" />
                      </Link>
                    )}
                    {log.user?.id === currentUserId && (
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1 hover:bg-lilac/30 rounded transition-colors"
                        title="Delete log"
                      >
                        <Trash className="w-4 h-4 text-purple/70 hover:text-red-400" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => {
                if (externalLogs) {
                  setCurrentPage((prev) => Math.max(prev - 1, 0));
                } else {
                  fetchMyLogs(pagination.page - 1, pagination.size);
                }
              }}
              disabled={
                externalLogs ? currentPage === 0 : pagination.page === 0
              }
              className="px-3 py-1 rounded-md bg-lilac/30 text-purple hover:bg-lilac/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                i +
                Math.max(0, (externalLogs ? currentPage : pagination.page) - 2);
              if (pageNum >= totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    if (externalLogs) {
                      setCurrentPage(pageNum);
                    } else {
                      fetchMyLogs(pageNum, pagination.size);
                    }
                  }}
                  className={`px-3 py-1 rounded-md ${
                    (externalLogs ? currentPage : pagination.page) === pageNum
                      ? "bg-purple text-offwhite"
                      : "bg-lilac/30 text-purple hover:bg-lilac/50"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              onClick={() => {
                if (externalLogs) {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
                } else {
                  fetchMyLogs(pagination.page + 1, pagination.size);
                }
              }}
              disabled={
                externalLogs
                  ? currentPage >= totalPages - 1
                  : pagination.page >= pagination.totalPages - 1
              }
              className="px-3 py-1 rounded-md bg-lilac/30 text-purple hover:bg-lilac/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
