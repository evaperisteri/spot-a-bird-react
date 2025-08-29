import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { birdwatchinglogs } from "../../api/birdwatchinglogs";
import { Bird } from "../../api/birds";
import { regionsService, Region } from "../../api/regions";
import LoadingSpinner from "./LoadingSpinner";
import { BirdSearchComboBox } from "./BirdSearchComboBox";
import { ChevronsUpDownIcon } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  birdName: string;
  quantity: number;
  regionName: string;
}

export interface LogformProps {
  initialData?: {
    birdName: string;
    regionName: string;
    quantity: string;
  };
  onSubmit?: (formData: FormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export default function Logform({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText = "Submit Sighting",
}: LogformProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  //const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    birdName: initialData?.birdName || "",
    quantity: initialData?.quantity ? parseInt(initialData.quantity) : 1,
    regionName: initialData?.regionName || "",
  });

  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setFetchingData(true);
        //setError(null);

        const regionsData = await regionsService.getAllRegions();
        const safeRegionsData = Array.isArray(regionsData) ? regionsData : [];

        setRegions(safeRegionsData);

        if (initialData?.birdName) {
          setSelectedBird({
            id: 0,
            commonName: initialData.birdName,
            scientificName: "",
            familyName: "",
          });
        }
      } catch (error: unknown) {
        console.error("Error fetching data:", error);
        //setError("Failed to load form data. Please try again.");
        toast.error("Failed to load form data. Please try again.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchInitialData();
  }, [initialData]);

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
    //setError(null);

    if (!selectedBird || !formData.regionName) {
      toast.error("Please select both a bird species and a region");
      //setError("Please select both a bird species and a region");
      setLoading(false);
      return;
    }

    try {
      const logData = {
        birdName: selectedBird.commonName,
        quantity: formData.quantity,
        regionName: formData.regionName,
      };

      if (onSubmit) {
        onSubmit(logData);
        toast.success("Log uploaded successfully!");
        return;
      }

      await birdwatchinglogs.createLog(logData);
      toast.success("Log created successfully!");
      navigate("/dashboard", {
        state: { message: "Log created successfully!" },
      });
    } catch (err: unknown) {
      console.error("Error saving log:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save log. Please try again.";
      //setError(errorMessage);
      toast.error(errorMessage);
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
  if (fetchingData) {
    return (
      <div className="min-h-screen bg-[url('/img/ssspot.svg')] bg-cover bg-center flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 md:space-y-6 px-2 md:px-4 lg:px-6"
      >
        {/* Bird Search */}
        <div>
          <label className="block text-left text-sage font-semibold mb-2 text-base md:text-lg">
            Search Bird Species *
          </label>
          <BirdSearchComboBox value={selectedBird} onSelect={setSelectedBird} />
          <p className="text-gray-600 text-xs md:text-sm font-sans text-end mt-1">
            -- Click on the arrows for a random species selection! --
          </p>
        </div>

        {/* Quantity Input */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-left text-sage font-semibold mb-2 text-base md:text-lg"
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
            className="w-full px-3 md:px-4 py-2 rounded-lg border-2 border-lilac focus:border-purple focus:ring-purple text-purple bg-offwhite font-sans text-sm md:text-base"
          />
        </div>

        {/* Region Select */}
        <div>
          <label
            htmlFor="regionName"
            className="block text-left text-sage font-semibold mb-2 text-base md:text-lg"
          >
            Region of Greece *
          </label>
          <div className="relative">
            <select
              id="regionName"
              name="regionName"
              value={formData.regionName}
              onChange={handleInputChange}
              required
              className="w-full px-3 md:px-4 py-2 rounded-lg border-2 border-lilac focus:border-purple focus:ring-purple text-purple bg-offwhite font-sans text-sm md:text-base appearance-none"
            >
              <option value="">Select a region in Greece</option>
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronsUpDownIcon className="h-4 w-4 md:h-5 md:w-5 text-purple/70" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-md transition duration-200 text-base md:text-lg font-sans font-semibold flex-1 sm:flex-none order-2 sm:order-1"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="bg-purple/80 hover:bg-purple/60 disabled:bg-purple/40 text-offwhite font-sans font-bold tracking-wide py-2 md:py-3 px-4 rounded-lg shadow-md transition duration-200 text-base md:text-lg flex-1 order-1 sm:order-2"
          >
            {loading || isSubmitting ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner />
                Processing...
              </span>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
