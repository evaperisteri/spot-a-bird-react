import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { birdwatchinglogs } from "../../api/birdwatchinglogs";
import { Bird } from "../../api/birds";
import { regionsService, Region } from "../../api/regions";
import LoadingSpinner from "./LoadingSpinner";
import BirdSearchComboBox from "./BirdSearchComboBox";

interface FormData {
  birdName: string;
  quantity: number;
  regionName: string;
}

export default function Logform() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    birdName: "",
    quantity: 1,
    regionName: "",
  });

  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    console.log("fetching initial data");
    try {
      setFetchingData(true);
      setError(null);

      const regionsData = await regionsService.getAllRegions();
      const safeRegionsData = Array.isArray(regionsData) ? regionsData : [];

      setRegions(safeRegionsData);
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      setError("Failed to load form data. Please try again.");
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!selectedBird || !formData.regionName) {
      setError("Please select both a bird species and a region");
      setLoading(false);
      return;
    }

    try {
      const logData = {
        birdName: selectedBird.commonName,
        quantity: formData.quantity,
        regionName: formData.regionName,
      };

      console.log("Submitting log data:", logData);

      const savedLog = await birdwatchinglogs.createLog(logData);
      console.log("Log saved successfully:", savedLog);
      navigate("/dashboard", {
        state: { message: "Log created successfully!" },
      });
    } catch (err: unknown) {
      console.error("Error saving log:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save log. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-[url('/img/ssspot.svg')] bg-cover bg-center flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded mb-4 mx-4 lg:mx-20">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-rose-800 hover:text-rose-900 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 px-4 md:px-6">
        <div>
          <label className="block text-left text-sage font-semibold mb-2 text-lg">
            Search Bird Species *
          </label>
          <BirdSearchComboBox value={selectedBird} onSelect={setSelectedBird} />
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-left text-sage font-semibold mb-2 text-lg"
          >
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border-2 border-lilac focus:border-purple focus:ring-purple text-purple bg-offwhite font-sans"
          />
        </div>

        <div>
          <label
            htmlFor="regionName"
            className="block text-left text-sage font-semibold mb-2 text-lg"
          >
            Region of Greece *
          </label>
          <select
            id="regionName"
            name="regionName"
            value={formData.regionName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border-2 border-lilac focus:border-purple focus:ring-purple text-purple bg-offwhite font-sans"
          >
            <option value="">Select a region in Greece</option>
            {/* Safely render region options */}
            {Array.isArray(regions) && regions.length > 0 ? (
              regions.map((region) => (
                <option key={region.id} value={region.name}>
                  {region.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No regions found
              </option>
            )}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="block w-full bg-purple/80 hover:bg-purple/60 disabled:bg-purple/40 text-offwhite font-sans font-bold tracking-wide py-3 px-4 rounded-lg shadow-md transition duration-200 text-lg"
          >
            {loading ? "Submitting..." : "Submit Sighting"}
          </button>
        </div>
      </form>
    </div>
  );
}
