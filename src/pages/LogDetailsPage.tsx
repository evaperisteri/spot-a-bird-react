import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { birdwatchinglogs } from "../api/birdwatchinglogs";
import type { BirdwatchingLogReadOnlyDTO } from "../types/birdwatchingTypes";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function LogDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState<BirdwatchingLogReadOnlyDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLog = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const logData = await birdwatchinglogs.getLogById(parseInt(id));
        setLog(logData);
      } catch (err) {
        console.error("Failed to fetch log:", err);
        setError("Failed to load log details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [id]);

  const handleDelete = async () => {
    if (!log || !confirm("Are you sure you want to delete this log?")) return;

    try {
      await birdwatchinglogs.deleteLog(log.id);
      navigate("/dashboard", {
        state: { message: "Log deleted successfully!" },
      });
    } catch (err) {
      console.error("Failed to delete log:", err);
      setError("Failed to delete log. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple text-white px-4 py-2 rounded-lg hover:bg-purple/80"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-rose-800 mb-4">Log Not Found</h1>
        <p className="mb-4">The requested log could not be found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple text-white px-4 py-2 rounded-lg hover:bg-purple/80"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-logo text-purple">Log Details</h1>
          <div className="flex space-x-2">
            <Link
              to={`/logs/${log.id}/edit`}
              className="bg-sage text-offwhite px-4 py-2 rounded-lg hover:bg-sage/80 transition-colors"
            >
              Edit Log
            </Link>
            <button
              onClick={handleDelete}
              className="bg-rose-600 text-offwhite px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Delete Log
            </button>
          </div>
        </div>

        <div className="bg-offwhite/80 rounded-lg shadow-soft p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-purple mb-4">
                Bird Information
              </h2>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Common Name:</span>{" "}
                  {log.bird.name}
                </p>
                <p>
                  <span className="font-semibold">Scientific Name:</span>{" "}
                  {log.bird.scientificName}
                </p>
                <p>
                  <span className="font-semibold">Family:</span>{" "}
                  <span className="font-semibold">Family:</span>{" "}
                  {log.bird.family.name}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-purple mb-4">
                Observation Details
              </h2>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {log.region.name}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {log.quantity}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Observer:</span>{" "}
                  {log.user.username}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-purple/20">
            <h2 className="text-xl font-semibold text-purple mb-4">
              Additional Notes
            </h2>
            <p className="text-purple/80">No additional notes provided.</p>
          </div>
        </div>
      </div>
    </>
  );
}
