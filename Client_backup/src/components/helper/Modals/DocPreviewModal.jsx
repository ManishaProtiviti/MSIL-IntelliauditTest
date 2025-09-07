import { useEffect, useState } from "react";
import MetaDataTable from "../Tables/MetaDataTable";

const DocPreviewModal = ({ isOpen, onClose, fileData, checkType }) => {
  const [zoomLevels, setZoomLevels] = useState([]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const VITE_API_URL_UPLOADS = import.meta.env.VITE_API_URL_UPLOADS;
  useEffect(() => {
    if (
      (checkType !== "Meta_Data" || checkType !== "Qr_Code") &&
      fileData?.fileUrls
    ) {
      setZoomLevels(fileData.fileUrls.map(() => 1));
    }
  }, [fileData, checkType]);

  const getFileExtension = (filename) =>
    filename.split(".").pop().toLowerCase();

  // ✅ Extract filename from your URL structure
  const extractFileName = (url) => {
    if (!url) return "";
    const parts = url.split(/[/\\]/); // handles both \ and /
    return parts[parts.length - 1]; // last part = filename
  };

  if (!isOpen) return null;

  const isSingleFile = fileData?.fileUrls?.length === 1;
  const checkData = fileData?.check_data?.length === 1;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
      <div
        className="relative bg-white max-h-[95vh] rounded-md shadow-lg overflow-auto"
        style={{
          width: isSingleFile || checkData ? "auto" : "80%",
          maxWidth: isSingleFile ? "80%" : "1000px",
          minWidth: isSingleFile ? "500px" : "600px",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-2 text-gray-600 hover:text-black text-xl z-20"
        >
          &times;
        </button>

        {/* ✅ Show yellow instruction box if it's PDF forgery */}
        {checkType === "PDF_Edit" && (
          <div className="flex justify-center my-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-md">
              <div className="w-4 h-4 bg-[#ff0] border rounded-sm"></div>
              <span>
                Potential Anomalies Detected
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-4 flex-wrap justify-center items-start">
          {fileData?.fileUrls?.map((url, index) => {
            const fileExtension = getFileExtension(url);
            const zoom = zoomLevels[index] || 1;
            const fileName = extractFileName(url);

            return (
              <div
                key={index}
                className="border p-2 rounded-md flex flex-col items-center"
                style={{
                  width: isSingleFile
                    ? "100%" // Full width for single file
                    : "calc(50% - 1rem)", // Two files side by side
                  minWidth: "300px",
                  maxWidth: "600px",
                  overflow: "auto",
                }}
              >
                {/* ✅ File Name Header */}
                <button
                  className="w-full text-center text-sm font-semibold text-blue-600 hover:underline mb-2 truncate"
                  onClick={() =>
                    window.open(
                      `${VITE_API_URL_UPLOADS}/${url.replace(
                      // `${VITE_API_URL}/uploads/${url.replace(
                        /\\/g,
                        "/"
                      )}`,
                      "_blank"
                    )
                  }
                >
                  {fileName}
                </button>

                {fileExtension === "pdf" ? (
                  <div
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                      width: "100%",
                      overflow: "auto",
                    }}
                  >
                    <iframe
                      // src={`${VITE_API_URL}/uploads/${url.replace(
                      src={`${VITE_API_URL_UPLOADS}/${url.replace(
                        /\\/g,
                        "/"
                      )}#navpanes=0&toolbar=1`}
                      className="w-full h-[500px] rounded-md"
                      title={`PDF Preview ${index + 1}`}
                    />
                  </div>
                ) : (
                  <img
                    src={`${VITE_API_URL_UPLOADS}/${url.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={`Files Preview ${index + 1}`}
                    className="w-full h-auto rounded-md"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "center",
                    }}
                  />
                )}
              </div>
            );
          })}

          {(checkType === "Meta_Data" || checkType === "QR_Code") && (
            <MetaDataTable
              title={
                checkType === "Meta_Data" ? "Meta Data Table" : "QR Code Table"
              }
              tableData={fileData.check_data}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocPreviewModal;
