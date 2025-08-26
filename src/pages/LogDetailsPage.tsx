import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { birdwatchinglogs } from "../api/birdwatchinglogs";
import type { BirdwatchingLogReadOnlyDTO } from "../types/birdwatchingTypes";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

export default function LogDetailsPage() {
  const { id } = useParams();
  const { userId: currentUserId } = useAuth();
  const navigate = useNavigate();
  const [log, setLog] = useState<BirdwatchingLogReadOnlyDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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

  const handleImageError = () => {
    setImageError(true);
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
          Back to Home
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
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center w-full px-4 ">
        <div className="w-full max-w-2xl text-start mb-6">
          <h1 className="text-xl md:text-3xl font-logo text-purple">
            Log Details
          </h1>
          {log.user?.id === currentUserId && (
            <div className="flex justify-end space-x-2">
              <Button onClick={() => navigate(`/logs/${log.id}/edit`)}>
                Edit Log
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-rose-300 text-offwhite px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Delete Log
              </Button>
            </div>
          )}
        </div>

        <div className="w-full max-w-2xl bg-offwhite/80 rounded-lg shadow-soft p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bird Image Section */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-purple mb-4">
                Bird's Image
              </h2>
              <div className="flex justify-center">
                {log.bird.imageUrl && !imageError ? (
                  <img
                    src={log.bird.imageUrl}
                    alt={log.bird.name}
                    className="w-full max-w-xs h-auto rounded-lg shadow-md object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full max-w-xs h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bird Information Section */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-purple mb-4">
                Bird's Information
              </h2>
              <div className="space-y-3">
                <p>
                  <span className="font-sans font-semibold text-gray-700">
                    Common Name:
                  </span>
                  <span className="text-sage"> {log.bird.name}</span>
                </p>
                <p>
                  <span className="font-sans font-semibold text-gray-700">
                    Scientific Name:
                  </span>
                  <span className="text-sage"> {log.bird.scientificName} </span>
                </p>
                <p>
                  <span className="font-sans font-semibold text-gray-700">
                    Family:
                  </span>
                  <span className="text-sage">
                    {" "}
                    {log.bird.family?.name || "Unknown"}{" "}
                  </span>
                </p>
              </div>
            </div>

            {/* Observation Details Section */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-purple mb-4">
                Spotting Details
              </h2>
              <div className="space-y-3">
                <p>
                  <span className="font-sans font-semibold text-gray-700">
                    Location:
                  </span>
                  <span className="text-sage"> {log.region.name} </span>
                </p>
                <p>
                  <span className="font-sans font-semibold text-gray-700">
                    Quantity:
                  </span>
                  <span className="text-sage"> {log.quantity} </span>
                </p>
                <p>
                  <span className="font-sans font-semibold text-gray-700">
                    Date:
                  </span>
                  <span className="text-sage">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="font-sans font-semibold text-gray-700">
                    Spotter:
                  </span>
                  <span className="text-sage"> {log.user.username} </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
