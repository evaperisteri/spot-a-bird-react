import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash } from "lucide-react";
import { birdwatchinglogs } from "../../api/birdwatchinglogs";
import type {
  BirdwatchingLog,
  PaginatedResponse,
} from "../../types/birdwatching";

export default function TableDashboard() {
  const [logs, setLogs] = useState<BirdwatchingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const fetchAllLogs = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "observationDate",
    sortDirection: string = "DESC"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Type the response as PaginatedResponse
      const data = (await birdwatchinglogs.getPaginatedLogs(
        page,
        size,
        sortBy,
        sortDirection
      )) as PaginatedResponse<BirdwatchingLog>;

      setLogs(data.content || []);

      // Update pagination if available
      if (data.totalPages !== undefined) {
        setPagination({
          page: data.number ?? page,
          size: data.size ?? size,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError("Failed to fetch logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLogs(0, 10, "observationDate", "DESC");
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading logs...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-purple/70 mb-4">No birdwatching logs found.</p>
        <Link
          to="/logs/new"
          className="bg-sage text-offwhite px-4 py-2 rounded-md hover:bg-sage/80 transition-colors"
        >
          Create Your First Log
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-offwhite/80 rounded-lg shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-logo text-purple">Birdwatching Logs</h2>
        <Link
          to="/logs/new"
          className="bg-sage text-offwhite px-4 py-2 rounded-md hover:bg-sage/80 transition-colors font-sans"
        >
          + New Log
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-purple/10">
          <tr className="border-b-2 border-purple/30">
            <th className="p-3 text-left font-sans font-semibold text-purple">
              Bird Species
            </th>
            <th className="p-3 text-left font-sans font-semibold text-purple">
              Location
            </th>
            <th className="p-3 text-left font-sans font-semibold text-purple">
              Quantity
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
              <td className="p-3 font-sans text-purple">{log.birdName}</td>
              <td className="p-3 font-sans text-purple">{log.regionName}</td>
              <td className="p-3 font-sans text-purple text-center">
                {log.quantity}
              </td>
              <td className="p-3 font-sans text-purple">
                {log.observationDate
                  ? new Date(log.observationDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="p-3 flex justify-center space-x-4">
                <Link to={`/logs/${log.id}`}>
                  <Eye className="w-5 h-5 text-purple/70 hover:text-purple transition-colors" />
                </Link>
                <Link to={`/logs/${log.id}/edit`}>
                  <Pencil className="w-5 h-5 text-purple/70 hover:text-sage transition-colors" />
                </Link>
                <button
                  onClick={() => {
                    /* Add delete handler */
                  }}
                >
                  <Trash className="w-5 h-5 text-purple/70 hover:text-red-400 transition-colors" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchAllLogs(i, pagination.size)}
              className={`px-3 py-1 rounded-md ${
                pagination.page === i
                  ? "bg-purple text-offwhite"
                  : "bg-lilac/30 text-purple hover:bg-lilac/50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
