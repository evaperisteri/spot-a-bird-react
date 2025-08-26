import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Hourglass,
  Pencil,
  Trash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const initialLoad = useRef(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const getSortedLogs = useCallback(() => {
    if (!externalLogs) return internalLogs;
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

  const getPaginatedLogs = useCallback(() => {
    if (!externalLogs) return internalLogs;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedLogs.slice(startIndex, endIndex);
  }, [externalLogs, internalLogs, sortedLogs, currentPage]);

  const paginatedLogs = getPaginatedLogs();

  useEffect(() => {
    setCurrentPage(0);
  }, [sortConfig]);

  const fetchMyLogs = useCallback(
    async (page: number = 0, size: number = 10) => {
      try {
        setLoading(true);
        setError(null);
        const backendSortBy =
          sortConfig.sortBy === "birdName"
            ? "bird.name"
            : sortConfig.sortBy === "scientificName"
            ? "bird.scientificName"
            : sortConfig.sortBy === "spotter"
            ? "user.username"
            : sortConfig.sortBy;

        const data = await birdwatchinglogs.getMyLogsPaginated(
          page,
          size,
          backendSortBy,
          sortConfig.sortDirection
        );

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

    if (externalLogs) {
      setTimeout(() => setSortLoading(false), 100);
    }
  };

  useEffect(() => {
    if (!externalLogs) {
      fetchMyLogs(0, 10);
    }
  }, [externalLogs, fetchMyLogs]);

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
      if (!externalLogs) {
        fetchMyLogs(pagination.page, pagination.size);
      } else {
        onLogsChange?.(sortedLogs.filter((log) => log.id !== logId));
      }
    } catch (error) {
      console.error("Error deleting log:", error);
      setError("Failed to delete log. Please try again.");
    }
  };

  const toggleRowExpand = (logId: number) => {
    setExpandedRow(expandedRow === logId ? null : logId);
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
      <div className="bg-offwhite/80 rounded-lg shadow-soft">
        {showHeader && (
          <div className="flex justify-between items-center mb-2"></div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto border border-offwhite rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-purple/10">
              <tr className="border-b-2 border-purple/30">
                <th
                  className="text-sm lg:text-md p-2 text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("birdName")}
                >
                  Common Name{" "}
                  {sortConfig.sortBy === "birdName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th
                  className="text-sm lg:text-md p-2 text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("scientificName")}
                >
                  Scientific Name{" "}
                  {sortConfig.sortBy === "scientificName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th
                  className="text-sm lg:text-md p-2 text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("regionName")}
                >
                  Location{" "}
                  {sortConfig.sortBy === "regionName" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th className="p-2 text-sm lg:text-md text-left font-sans font-semibold text-purple">
                  Quantity
                </th>
                <th
                  className="p-2 text-sm lg:text-md text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("spotter")}
                >
                  Spotter{" "}
                  {sortConfig.sortBy === "spotter" &&
                    (sortConfig.sortDirection === "ASC" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 text-sm lg:text-md text-left font-sans font-semibold text-purple cursor-pointer hover:bg-purple/20"
                  onClick={() => handleSort("createdAt")}
                >
                  Date{" "}
                  {sortConfig.sortBy === "createdAt" && (
                    <>
                      {sortLoading ? (
                        <span className="animate-spin">
                          <Hourglass className="inline h-4 w-4" />
                        </span>
                      ) : sortConfig.sortDirection === "ASC" ? (
                        "↑"
                      ) : (
                        "↓"
                      )}
                    </>
                  )}
                </th>
                <th className="p-2 text-center text-sm lg:text-md font-sans font-semibold text-purple">
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {paginatedLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-lg shadow-md border border-purple/20 p-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleRowExpand(log.id)}
              >
                <div>
                  <h3 className="font-sans font-semibold text-purple text-lg">
                    {log.commonName}
                  </h3>
                  <p className="font-sans text-purple/70 text-sm">
                    {log.scientificName}
                  </p>
                </div>
                <div>
                  {expandedRow === log.id ? (
                    <ChevronUp className="w-5 h-5 text-purple" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple" />
                  )}
                </div>
              </div>

              {expandedRow === log.id && (
                <div className="mt-4 space-y-3 border-t border-purple/10 pt-4">
                  <div className="flex justify-between">
                    <span className="font-sans font-medium text-purple">
                      Location:
                    </span>
                    <span className="font-sans text-purple">
                      {log.regionName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans font-medium text-purple">
                      Quantity:
                    </span>
                    <span className="font-sans text-purple">
                      {log.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans font-medium text-purple">
                      Spotter:
                    </span>
                    <span className="font-sans text-purple">
                      {log.user?.username}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans font-medium text-purple">
                      Date:
                    </span>
                    <span className="font-sans text-purple">
                      {log.observationDate
                        ? new Date(log.observationDate).toLocaleDateString()
                        : "No date available"}
                    </span>
                  </div>
                  <div className="flex justify-center space-x-4 pt-3">
                    <Link
                      to={`/logs/${log.id}`}
                      className="p-2 hover:bg-lilac/30 rounded transition-colors"
                      title="View details"
                    >
                      <Eye className="w-5 h-5 text-purple/70 hover:text-purple" />
                    </Link>
                    {log.user?.id === currentUserId && (
                      <Link
                        to={`/logs/${log.id}/edit`}
                        className="p-2 hover:bg-lilac/30 rounded transition-colors"
                        title="Edit log"
                      >
                        <Pencil className="w-5 h-5 text-purple/70 hover:text-sage" />
                      </Link>
                    )}
                    {log.user?.id === currentUserId && (
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-2 hover:bg-lilac/30 rounded transition-colors"
                        title="Delete log"
                      >
                        <Trash className="w-5 h-5 text-purple/70 hover:text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2 p-4">
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
              className="px-3 py-2 rounded-md bg-lilac/30 text-purple hover:bg-lilac/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>

            <span className="text-sm text-purple/70">
              Page {(externalLogs ? currentPage : pagination.page) + 1} of{" "}
              {totalPages}
            </span>

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
              className="px-3 py-2 rounded-md bg-lilac/30 text-purple hover:bg-lilac/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
