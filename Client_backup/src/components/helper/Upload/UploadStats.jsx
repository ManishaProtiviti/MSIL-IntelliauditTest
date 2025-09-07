import React from "react";

const UploadStats = ({ uploadStats, uploadStatus }) => (
  <div className="flex flex-col">
    {uploadStats.map((stat, index) => (
      <div
        key={index}
        className="text-xs font-semibold text-[#191919] leading-4"
      >
        <span>{stat.label} - </span>
        <span className="font-semibold">{stat.value}</span>
      </div>
    ))}
    {/* {uploadStatus && (
      <div className="text-sm text-green-400 leading-[18px] mt-2">
        {uploadStatus}
      </div>
    )} */}
  </div>
);

export default UploadStats;
