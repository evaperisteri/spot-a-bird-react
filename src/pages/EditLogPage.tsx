import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { birdwatchinglogs } from "../api/birdwatchinglogs";
import type { BirdwatchingLogReadOnlyDTO } from "../types/birdwatchingTypes";
import Logform from "../components/ui/Logform";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function EditLogPage() {
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
        setError("Failed to load log. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [id]);

  const handleSubmit = async (formData: {
    birdName: string;
    quantity: number;
    regionName: string;
  }) => {
    if (!log) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log("Sending update data:", {
        id: log.id,
        data: formData,
      });

      await birdwatchinglogs.updateLog(log.id, formData);
      navigate(`/logs/${log.id}`, {
        state: { message: "Log updated successfully!" },
      });
    } catch (err) {
      console.error("Failed to update log:", err);
      setError("Failed to update log. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/logs/${id}`);
  };

  if (isLoading && !log) {
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
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-logo text-purple">Edit Log</h1>
      </div>

      {error && (
        <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Logform
        initialData={{
          birdName: log.bird.name,
          regionName: log.region.name,
          quantity: log.quantity.toString(),
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isLoading}
        submitText="Update Log"
      />
    </div>
  );
}
