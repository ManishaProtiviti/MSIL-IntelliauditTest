import React, { useState } from "react";

const FieldSelector = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="cols-span-1 w-full bg-white rounded-lg shadow-md flex items-center justify-between px-2 relative group">
      <div
        className="flex items-center text-center justify-between w-full cursor-pointer"
        onMouseEnter={() => setIsOpen(!isOpen)}
      >
        <div className="text-xs text-[#3c3c3c] leading-[18px]">
          Select the field
        </div>
        <div className="text-sm mb-2">⌄</div>
      </div>
      {isOpen && (
        <div
          className="absolute w-36 mt-36 bg-white border border-gray-200 rounded-md shadow-lg z-20"
          onMouseLeave={() => setIsOpen(!isOpen)}
        >
          <a
            href="#"
            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
          >
            Field 1
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
          >
            Field 2
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
          >
            Field 3
          </a>
        </div>
      )}
    </div>
  );
};

export default FieldSelector;
