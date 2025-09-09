import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DocPreviewModal from "../Modals/DocPreviewModal";
import downloadIcon from "../../../assets/downloadIcon.svg";
import reportTableData from "../../utils/reportTableData";

const TransactionalOutcomeTable = ({ tableData, getDocData, docData, handleDownload }) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState({
    fileData: "",
    checkType: "",
  });
  const [tableModal, setTableModal] = useState(false);
  console.log(previewFile, "Preview Files");
  const handleThumbsDownClick = async (data, checkType) => {
    setPreviewFile({
      fileData: await getDocData(data, checkType),
      checkType: checkType,
    });
    setIsPreviewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewFile({ fileData: "", checkType: "" });
  };
  // const handleTableModal = () => {
  //   setTableModal(true);
  // };
  // const handleTableCloseModal = () => {
  //   setTableModal(false);
  // };
  const handleTableContentDisplay = (status, data, checkType) => {
    return (
      <td className="box-border px-1 py-2 border border-gray-200">
        {status === "No" ? (
          <button>
            <div className="cursor-default border rounded-full p-2 bg-green-500 shadow-sm"></div>
          </button>
        ) : status === "Yes" ? (
          <button onClick={() => handleThumbsDownClick(data, checkType)}>
            <div className="border rounded-full p-2 bg-red-500 shadow-sm "></div>
          </button>
        ) : (
          <button>
            <div className="cursor-default border rounded-full p-2 bg-gray-300 shadow-sm"></div>
          </button>
        )}
      </td>
    );
  };
  return (
    <div className="mt-2 col-span-8 bg-white rounded-md shadow-sm py-1 h-full">
      <div className="flex flex-row gap-2">
        <span className="border-2 border-[#012378] rounded-md"></span>
        <div className="flex justify-between w-full pr-2">
          <span className="text-md font-medium text-[#012378] p-1">
            Transactional Outcome
          </span>
          <div className="text-[10px] font-normal text-gray-600 flex items-center gap-3">
            <div className="flex items-center justify-center gap-1">
              <div className="flex items-center border rounded-full p-1 bg-green-500 shadow-sm"></div>
              <span>Pass</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="flex items-center border rounded-full p-1 bg-red-500 shadow-sm"></div>
              <span>Fail (Click to view details)</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="flex items-center border rounded-full p-1 bg-gray-300 shadow-sm"></div>
              <span>Not selected</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-h-[calc(100vh-150px)] overflow-y-auto px-1 rounded-md">
        <table className="min-w-full text-xs text-gray-800 border-collapse text-center rounded-md border border-gray-200 max-h-96 md:max-h-[200px] ">
          <thead className="sticky top-0 bg-gray-100 text-xs font-normal  text-gray-600">
            <tr>
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                S.No
              </th>
              {/* <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                ID
              </th> */}
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                File Name
              </th>
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                Checks Failed
              </th>
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                De-Duplication
              </th>
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                PDF Edit
              </th>
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                Copy Move
              </th>
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                Metadata
              </th>
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                QR Code
              </th>
              <th className="box-border px-1 py-2 whitespace-nowrap border border-gray-200">
                Image Edit
              </th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs font-normal">
            {tableData &&
              tableData.map((row, i) => (
                <tr key={i} className="">
                  <td className="box-border px-1 py-2 border border-gray-200">
                    {i + 1}
                  </td>
                  {/* <td className="box-border px-1 py-2 border border-gray-200">
                  --
                </td> */}
                  <td
                    className="box-border cursor-pointer px-1 py-2 border border-gray-200 max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ maxWidth: "120px" }}
                    title={row?.Document_Name}
                  >
                    {row?.Document_Name}
                  </td>
                  <td className="box-border px-1 py-2 border border-gray-200">
                    {
                      Object.values(row)?.filter((value) => value === "Yes")
                        .length
                    }
                    /
                    {
                      Object.values(row)?.filter(
                        (value) => value === "Yes" || value === "No"
                      ).length
                    }
                  </td>
                  {handleTableContentDisplay(
                    row?.Duplicate_Exception_Flag,
                    row,
                    "Duplicate"
                  )}
                  {handleTableContentDisplay(
                    row?.PDF_Edit_Exception_Flag,
                    row,
                    "PDF_Edit"
                  )}
                  {handleTableContentDisplay(
                    row?.Copy_Move_Exception_Flag,
                    row,
                    "Copy_Move"
                  )}
                  {handleTableContentDisplay(
                    row?.MetaData_Exception_Flag,
                    row,
                    "Meta_Data"
                  )}
                  {handleTableContentDisplay(
                    row?.QR_Code_Exception_Flag,
                    row,
                    "QR_Code"
                  )}
                  {handleTableContentDisplay(
                    row?.Image_Edit_Exception_Flag,
                    row,
                    "Image_Edit"
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <DocPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleCloseModal}
        fileData={previewFile.fileData}
        checkType={previewFile.checkType}
      />
      {/* <MyViewTableModal isOpen={tableModal} onClose={handleTableCloseModal} /> */}
      <div className="mt-2 mr-2 flex justify-end items-center ">
        <button className="flex flex-row gap-2 justify-between items-center border bg-[#012378] px-4 rounded-lg p-2" onClick={handleDownload}>
          <div className="text-xs text-white font-bold">Download</div>
          <img src={downloadIcon} alt="download" width="15" />
        </button>
      </div>
    </div>
  );
};

export default TransactionalOutcomeTable;
