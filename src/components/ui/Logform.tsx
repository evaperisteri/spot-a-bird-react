import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { birdwatchinglogs } from "../../api/birdwatchinglogs";
import { birdsService, Bird } from "../../api/birds";
import { regionsService, Region } from "../../api/regions";
import LoadingSpinner from "./LoadingSpinner";

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

  const [birds, setBirds] = useState<Bird[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [filteredBirds, setFilteredBirds] = useState<Bird[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBirds(birds);
    } else {
      const filtered = birds.filter(
        (bird) =>
          bird.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bird.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBirds(filtered);
    }
  }, [searchQuery, birds]);

  const fetchInitialData = async () => {
    try {
      setFetchingData(true);
      setError(null);

      const [birdsData, regionsData] = await Promise.all([
        birdsService.getAllBirds(),
        regionsService.getAllRegions(),
      ]);

      setBirds(birdsData);
      setFilteredBirds(birdsData);
      setRegions(regionsData);
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
      [name]: name === "quantity" ? parseInt(value) || 1 : parseInt(value) || 0,
    }));
  };

  const handleBirdSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.birdName || !formData.regionName) {
      setError("Please select both a bird species and a region");
      setLoading(false);
      return;
    }

    try {
      const logData = {
        birdName: formData.birdName,
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
    <div>
      {error && (
        <div className="md:col-span-12">
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
        </div>
      )}
    </div>;

    return (
      <div className="min-h-screen bg-[url('/img/ssspot.svg')] bg-cover bg-center flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-4 md:px-6">
      <div>
        <label
          htmlFor="birdSearch"
          className="block text-left text-sage font-semibold mb-2 text-lg"
        >
          Search Bird Species *
        </label>
        <input
          type="text"
          id="birdSearch"
          value={searchQuery}
          onChange={handleBirdSearch}
          placeholder="Search by common or scientific name..."
          className="w-full px-4 py-2 rounded-lg border-2 border-lilac focus:border-purple focus:ring-purple text-purple bg-offwhite font-sans placeholder-purple/60 mb-2"
        />

        <select
          id="birdName"
          name="birdName"
          value={formData.birdName}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 rounded-lg border-2 border-lilac focus:border-purple focus:ring-purple text-purple bg-offwhite font-sans"
        >
          <option value="">Select a bird species</option>
          {filteredBirds.map((bird) => (
            <option key={bird.id} value={bird.name}>
              {bird.name} ({bird.scientificName})
              {bird.family && ` - ${bird.family}`}
            </option>
          ))}
        </select>
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
          {regions.map((region) => (
            <option key={region.id} value={region.name}>
              {region.name}
            </option>
          ))}
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
  );
}
