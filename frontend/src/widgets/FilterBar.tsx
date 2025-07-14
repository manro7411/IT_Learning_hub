import { useState } from "react";

interface Props {
  assignType: string;
  onAssignTypeChange: (type: string) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FilterBar = ({
  assignType,
  onAssignTypeChange,
  categories,
  selectedCategories,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: Props) => {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-3 rounded-lg shadow mb-6">
      <input
        type="text"
        placeholder="Search lessons..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 w-64"
      />

      <div className="relative">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 text-sm"
        >
          {selectedCategories.length > 0
            ? `Category (${selectedCategories.length})`
            : "Filter by Category"}
        </button>

        {showCategories && (
          <div className="absolute z-10 mt-2 w-48 bg-white border rounded-md shadow-lg p-2 space-y-1">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() =>
                    onCategoryChange(
                      selectedCategories.includes(cat)
                        ? selectedCategories.filter((c) => c !== cat)
                        : [...selectedCategories, cat]
                    )
                  }
                  className="mr-2"
                />
                {cat}
              </label>
            ))}
            <button
              onClick={() => onCategoryChange([])}
              className="text-xs text-blue-500 hover:underline mt-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {["all", "team", "specific"].map((type) => (
          <button
            key={type}
            onClick={() => onAssignTypeChange(type)}
            className={`px-3 py-1 rounded-md text-sm ${
              assignType === type ? "bg-purple-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
