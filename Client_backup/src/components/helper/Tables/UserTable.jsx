import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserTable = ({ title, tableData, tableHeaders }) => {
  return (
    <div className=" bg-white rounded-md shadow-sm box-border py-2">
      <div className="flex flex-row gap-2">
        <span className="border-2 border-[#012378] rounded-md"></span>
        <span className="text-md font-medium text-[#012378] p-1">{title}</span>
      </div>
      <div className="my-2 overflow-y-auto rounded-md px-2 pb-2">
        <table className="min-w-full text-xs text-gray-800 font-normal border-collapse text-center rounded-md border border-gray-200">
          <thead className="sticky top-0 bg-gray-100 text-xs font-light text-gray-600">
            <tr>
              <th className="box-border py-1 whitespace-nowrap border border-gray-200">
                S.no
              </th>
              {tableHeaders &&
                tableHeaders.map((header, idx) => {
                  return (
                    <th
                      className="box-border py-1 whitespace-nowrap border border-gray-200"
                      key={idx}
                    >
                      {header}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody className="divide-y text-xs  font-normal">
            {tableData &&
              tableData.map((row, i) => {
                return (
                  <tr key={i} className="">
                    <td className="box-border py-1 border border-gray-200">
                      {i + 1}
                    </td>
                    {row &&
                      row.map((rowData, rowIdx) => {
                        return (
                          <td
                            className="box-border py-1 border border-gray-200"
                            key={rowIdx}
                          >
                            {rowData}
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
