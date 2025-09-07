import React, { useState } from "react";
import { Link } from "react-router-dom";

const MyViewTableModal = ({ isOpen, onClose }) => {
  const handleModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-4 rounded-md shadow-lg relative">
        <div className="flex flex-row gap-2">
          <span className="border-2 border-[#012378] rounded-md"></span>
          <span className="text-md font-medium text-[#012378] p-1">
            Last 10 Reports
          </span>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>
        <div className="mt-4 max-h-96 sm:max-h-[600px] overflow-y-auto rounded-md">
          <table className="min-w-full text-xs text-gray-800 border-collapse text-center rounded-md border border-gray-200">
            <thead className="sticky top-0 bg-gray-100 text-[10px] font-normal uppercase text-gray-600">
              <tr>
                <th className="box-border py-2 whitespace-nowrap border border-gray-200">
                  S.no
                </th>
                <th className="box-border py-2 whitespace-nowrap border border-gray-200">
                  Report No.
                </th>
                <th className="box-border py-2 whitespace-nowrap border border-gray-200">
                  Date & Time
                </th>
                <th className="box-border py-2 whitespace-nowrap border border-gray-200">
                  No. of Files
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs  font-normal">
              {[
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
                {
                  report: "#VZ2110",
                  dateAndTime: "2025-06-27 10:15 AM",
                  numberOfDoc: 10,
                },
              ].map((row, i) => (
                <tr key={i} className="">
                  <td className="box-border py-2 border border-gray-200">
                    {i + 1}
                  </td>

                  <td className="box-border py-2 border border-gray-200">
                    <Link
                      to="/my-view"
                      target="_blank"
                      className="bg- hover:text-blue-700 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline underline"
                    >
                      {row.report}
                    </Link>
                  </td>
                  <td className="box-border py-2 border border-gray-200">
                    {row.dateAndTime}
                  </td>
                  <td className="box-border py-2 border border-gray-200">
                    {row.numberOfDoc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyViewTableModal;
