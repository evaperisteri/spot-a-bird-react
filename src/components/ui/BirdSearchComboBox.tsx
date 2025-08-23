import React, { useState, useEffect } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";
import { ChevronsUpDownIcon } from "lucide-react";
import { Bird, birdsService } from "../../api/birds";

interface BirdSearchComboBoxProps {
  value: Bird | null;
  onSelect: (bird: Bird) => void;
}

export const BirdSearchComboBox: React.FC<BirdSearchComboBoxProps> = ({
  value,
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [birds, setBirds] = useState<Bird[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // Load initial birds when component mounts or when query is empty
  useEffect(() => {
    const loadInitialBirds = async () => {
      if (hasLoadedInitial) return;

      setIsLoading(true);
      try {
        console.log("Loading initial birds...");
        const birdsData = await birdsService.searchBirds("");
        console.log("Initial birds loaded:", birdsData);
        setBirds(birdsData);
        setHasLoadedInitial(true);
      } catch (err) {
        console.error("Error loading initial birds:", err);
        setBirds([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialBirds();
  }, [hasLoadedInitial]);

  // Search birds when query changes
  useEffect(() => {
    const fetchBirds = async () => {
      setIsLoading(true);
      try {
        console.log("Searching birds with query:", query);
        const birdsData = await birdsService.searchBirds(query);
        console.log("Search results:", birdsData);
        setBirds(birdsData);
      } catch (err) {
        console.error("Error fetching birds:", err);
        setBirds([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchBirds, 300);
    return () => clearTimeout(timeoutId);
  }, [query]); // This will run for every query change, including empty query

  return (
    <Combobox value={value} onChange={onSelect}>
      <div className="relative">
        <ComboboxInput
          className="w-full px-4 py-2 rounded-lg border-2 border-lilac focus:border-purple focus:ring-purple text-purple bg-offwhite font-sans placeholder-purple/60"
          placeholder="Search for a bird species..."
          displayValue={(bird: Bird | null) => bird?.commonName || ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(event.target.value)
          }
          onFocus={() => {
            // Load birds if they haven't been loaded yet
            if (!hasLoadedInitial && birds.length === 0) {
              setHasLoadedInitial(false); // Reset to trigger initial load
            }
          }}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronsUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {isLoading ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Loading...
            </div>
          ) : birds.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No birds found.
            </div>
          ) : birds.length === 0 ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Start typing to search for birds...
            </div>
          ) : (
            birds.map((bird) => (
              <ComboboxOption
                key={bird.id}
                value={bird}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-purple-100 text-purple-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {bird.commonName} ({bird.scientificName})
                    </span>
                    {bird.familyName && (
                      <span className="block text-sm text-gray-500">
                        Family: {bird.familyName}
                      </span>
                    )}
                  </>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};
