import React, { useState, useEffect, useRef } from "react";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const options = ["Last week", "Last month", "Last year", "Custom range"];

const DateFilter = ({ onRangeSelect }) => {
  const [selectedOption, setSelectedOption] = useState("Last week");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const filterRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option !== "Custom range") {
      onRangeSelect(option);
      setShowFilterPanel(false);
    }
  };

  const handleDateChange = (ranges) => {
    setRange([ranges.selection]);
    onRangeSelect(ranges.selection);
  };

  return (
    <div className="relative z-50" ref={filterRef}>
      <button
        onClick={() => setShowFilterPanel(!showFilterPanel)}
        className="flex items-center justify-between gap-2 text-sm px-4 py-2 w-full rounded-md bg-white border shadow-sm"
      >
        <span className="font-medium">{selectedOption}</span>
        <CalendarIcon className="h-5 w-5 text-gray-500" />
      </button>

      {showFilterPanel && (
        <div className="absolute mt-2 bg-white border rounded-md shadow-xl flex w-auto overflow-hidden">
          {/* Left: Options list */}
          <div className="flex flex-col w-40 border-r">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedOption === option
                    ? "text-blue-700 font-semibold bg-gray-50 border-l-2 border-blue-700"
                    : "text-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Right: Calendar (only for custom range) */}
          {selectedOption === "Custom range" && (
            <div className="p-4">
              <DateRange
                editableDateInputs
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={range}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateFilter;
