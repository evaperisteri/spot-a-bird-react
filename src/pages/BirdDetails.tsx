import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { authFetch } from "../api/client";
import LoadingSpinner from "../components/ui/LoadingSpinner";

interface BirdDetails {
  id: number;
  commonName: string;
  scientificName: string;
  familyName: string;
  imageUrl?: string;
}

export default function BirdDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bird, setBird] = useState<BirdDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBird = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch(`/api/birds/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch bird: ${response.status}`);
        }

        const data = await response.json();
        setBird(data);
      } catch (error) {
        console.error("Error fetching bird:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load bird details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBird();
    }
  }, [id]);

  const handleNext = () => {
    if (bird && bird.id < 459) {
      // Assuming 459 is your max bird ID
      navigate(`/birds/${bird.id + 1}`);
    }
  };

  const handlePrevious = () => {
    if (bird && bird.id > 1) {
      navigate(`/birds/${bird.id - 1}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !bird) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">
          {error || `No bird details available for ID ${id}.`}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-sage text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sage mb-6 hover:underline"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back to Catalog
      </button>

      <div className="bg-offwhite p-6 rounded-2xl shadow-md border border-purple">
        <h1 className="text-3xl font-bold text-purple mb-4">
          {bird.commonName}
        </h1>
        <p className="italic text-gray-700 mb-2">
          <span className="font-semibold">Scientific Name:</span>{" "}
          {bird.scientificName}
        </p>
        <p className="text-gray-700 mb-6">
          <span className="font-semibold">Family:</span> {bird.familyName}
        </p>

        {bird.imageUrl && (
          <div className="rounded-lg overflow-hidden border shadow-md flex justify-center items-center bg-offwhite mb-6">
            <img
              src={bird.imageUrl}
              alt={bird.commonName}
              className="max-h-80 w-auto object-scale-down"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/bird-placeholder.jpg";
              }}
            />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={!bird || bird.id <= 1}
            className="flex items-center px-4 py-2 rounded-lg bg-sage text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!bird || bird.id >= 459} // Adjust based on your max ID
            className="flex items-center px-4 py-2 rounded-lg bg-sage text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
