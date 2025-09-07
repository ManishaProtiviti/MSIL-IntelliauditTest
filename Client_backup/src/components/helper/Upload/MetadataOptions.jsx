import React from "react";

const MetadataOptions = ({ metadataOption, setMetadataOption }) => (
  <div className="relative flex items-center">
    <div className="text-xs text-black font-semibold">
      Do you want to upload meta-data?
    </div>
    <div className="ml-4 flex gap-6">
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          value="yes"
          id="yes"
          checked={metadataOption === "yes"}
          onChange={() => setMetadataOption("yes")}
          className="w-3 h-3 rounded-[6.59px] border border-[#012386] checked:bg-[#012386] checked:border-[#012386] focus:ring-[#012386] accent-[#012386]"
        />
        <label
          htmlFor="yes"
          className="text-xs text-black leading-[18px] cursor-pointer"
        >
          Yes
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          value="no"
          id="no"
          checked={metadataOption === "no"}
          onChange={() => setMetadataOption("no")}
          className="w-3 h-3 rounded-[6.59px] border border-[#012386] checked:bg-[#012386] checked:border-[#012386] focus:ring-[#012386] accent-[#012386]"
        />
        <label
          htmlFor="no"
          className="text-xs text-black leading-[18px] cursor-pointer"
        >
          No
        </label>
      </div>
    </div>
  </div>
);

export default MetadataOptions;
