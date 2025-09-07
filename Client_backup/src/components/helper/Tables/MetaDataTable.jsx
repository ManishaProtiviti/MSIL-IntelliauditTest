import React from "react";
import { convertTimestampToNormalWithoutMS } from "../../utils/timeStampFormatter";

const MetaDataTable = ({ title, tableData }) => {
  // Get headers dynamically by extracting keys from the first item in tableData
  const tableHeaders = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="bg-white rounded-md shadow-sm box-border">
      <div className="flex flex-row gap-2 ">
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
              {tableHeaders.map((header, idx) => (
                <th
                  className="box-border py-1 px-2 whitespace-nowrap border border-gray-200"
                  key={idx}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y text-xs font-normal">
            {tableData.map((row, i) => (
              <tr key={i}>
                <td className="box-border py-1 px-2 border border-gray-200">
                  {i + 1}
                </td>
                {tableHeaders.map((header, rowIdx) => (
                  <td
                    className="box-border py-1 px-2 border border-gray-200"
                    key={rowIdx}
                  >
                    {header === "Creation_Date" || header === "Modified_Date"
                      ? convertTimestampToNormalWithoutMS(row[header], false) ||
                        "NA"
                      : row[header] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaDataTable;
