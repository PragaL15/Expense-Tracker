import { useState } from "react";

const CategoryDropdown = ({ categories, category, setCategory }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    setCategory(value);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="bg-gray-50 border border-gray-300 rounded-xl py-3 px-3 flex justify-between items-center cursor-pointer focus:ring-2 focus:ring-yellow-400"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-700">
          {category
            ? categories.find((c) => c.category_id === category)?.name
            : "Select a category"}
        </span>
        <svg
          className={`w-4 h-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {categories.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No categories found
            </div>
          ) : (
            categories.map((c) => (
              <div
                key={c.category_id}
                onClick={() => handleSelect(c.category_id)}
                className="px-4 py-2 text-gray-700 hover:bg-[#dad7cd] cursor-pointer"
              >
                {c.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
