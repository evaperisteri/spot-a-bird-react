import { useEffect, useState, useCallback } from "react";
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

  const logs = externalLogs || internalLogs;

  // Define fetchMyLogs with useCallback to avoid recreation on every render
  const fetchMyLogs = useCallback(
    async (
      page: number = 0,
      size: number = 10,
      sortBy: string = "createdAt",
      sortDirection: string = "DESC"
    ) => {
      try {
        setLoading(true);
        setError(null);

        const data = await birdwatchinglogs.getMyLogsPaginated(
          page,
          size,
          sortBy,
          sortDirection
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
      }
    },
    [onLogsChange]
  ); // Add dependencies that fetchMyLogs uses

  useEffect(() => {
    if (!externalLogs) {
      fetchMyLogs(0, 10, "createdAt", "DESC");
    }
  }, [externalLogs, fetchMyLogs]); // Add fetchMyLogs to dependencies

  const handleDelete = async (logId: number) => {
    if (!confirm("Are you sure you want to delete this log?")) return;

    try {
      await birdwatchinglogs.deleteLog(logId);
      // Refresh the logs after deletion
      if (!externalLogs) {
        fetchMyLogs(pagination.page, pagination.size);
      } else {
        // If using external logs, let parent handle refresh
        onLogsChange?.(logs.filter((log) => log.id !== logId));
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

  if (logs.length === 0) {
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
    <div className="bg-offwhite/80 rounded-lg shadow-soft p-6">
      {showHeader && (
        <div className="flex justify-between items-center mb-6"></div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-purple/10">
            <tr className="border-b-2 border-purple/30">
              <th className="p-3 text-left font-sans font-semibold text-purple">
                Common Name
              </th>
              <th className="p-3 text-left font-sans font-semibold text-purple">
                Scientific Name
              </th>
              <th className="p-3 text-left font-sans font-semibold text-purple">
                Location
              </th>
              <th className="p-3 text-left font-sans font-semibold text-purple">
                Quantity
              </th>
              <th className="p-3 text-left font-sans font-semibold text-purple">
                Spotter
              </th>
              <th className="p-3 text-left font-sans font-semibold text-purple">
                Date
              </th>
              <th className="p-3 text-center font-sans font-semibold text-purple">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm md:text-base">
            {logs.map((log) => (
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
                <td className="p-3 font-sans text-purple">{log.regionName}</td>
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

      {/* Pagination Controls - only show if not using external logs */}
      {!externalLogs && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => fetchMyLogs(pagination.page - 1, pagination.size)}
            disabled={pagination.page === 0}
            className="px-3 py-1 rounded-md bg-lilac/30 text-purple hover:bg-lilac/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              const pageNum = i + Math.max(0, pagination.page - 2);
              if (pageNum >= pagination.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => fetchMyLogs(pageNum, pagination.size)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === pageNum
                      ? "bg-purple text-offwhite"
                      : "bg-lilac/30 text-purple hover:bg-lilac/50"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            }
          )}

          <button
            onClick={() => fetchMyLogs(pagination.page + 1, pagination.size)}
            disabled={pagination.page >= pagination.totalPages - 1}
            className="px-3 py-1 rounded-md bg-lilac/30 text-purple hover:bg-lilac/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
