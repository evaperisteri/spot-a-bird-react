import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { useState, useEffect } from "react";
import { birdsService, Bird } from "../../api/birds";

interface BirdSearchComboBoxProps {
  onSelect: (bird: Bird) => void;
  value: Bird | null;
}

export default function BirdSearchComboBox({
  onSelect,
  value,
}: BirdSearchComboBoxProps) {
  const [query, setQuery] = useState("");
  const [filteredBirds, setFilteredBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(false);

  const searchBirds = async (searchTerm: string) => {
    setLoading(true);
    try {
      const birds = await birdsService.searchBirds(searchTerm);
      setFilteredBirds(birds);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      searchBirds(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <Combobox value={value} onChange={onSelect}>
      <div className="relative">
        <ComboboxInput
          className="w-full px-4 py-2 rounded-lg border border-lilac text-purple bg-offwhite"
          displayValue={(bird: Bird | null) => (bird ? bird.commonName : "")}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (filteredBirds.length === 0) {
              // Triggering search when focusing the input
              searchBirds("");
            }
          }}
          placeholder="Type bird name or scientific name..."
        />

        {loading && (
          <div className="absolute right-3 top-3 text-gray-400">Loading...</div>
        )}

        {filteredBirds.length > 0 && (
          <ComboboxOptions className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
            {filteredBirds.map((bird) => (
              <ComboboxOption
                key={bird.id}
                value={bird}
                className={({ active }) =>
                  `cursor-pointer px-4 py-2 ${active ? "bg-purple/10" : ""}`
                }
              >
                {bird.displayText}{" "}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
