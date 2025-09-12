import React, { useState, useRef } from "react";
import axios from "axios";
const api_url = import.meta.env.VITE_API_URL;
const CheckItem = ({ check, onCheckChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      checked={check.checked}
      onChange={() => onCheckChange(check.id)}
      className="w-4 h-4 text-[#012386] border-gray-300 rounded focus:ring-[#012386]"
    />
    <span className="ml-2 text-sm text-gray-600">{check.title}</span>
  </div>
);

const BulkUploadModal = ({
  isOpen,
  onClose,
  onFileSelect,
  onCheckSubmit,
  analyticalChecks,
  randomNumber,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedChecks, setSelectedChecks] = useState(
    analyticalChecks.map((check) => ({
      ...check,
      checked: check.checked || false,
      description: check.description.split(" ").slice(0, 5).join(" ") + "...",
    }))
  );
  const [message, setMessage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const timeoutRef = useRef(null); // Ref to store timeout ID
  const fileInputRef = useRef(null); // Ref to reset file input
  const userData = JSON.parse(sessionStorage.getItem("session"));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 2 * 1024 * 1024 * 1024) {
      // 2 GB limit
      alert("Total upload size exceeds 2 GB limit.");
      return;
    }

    setSelectedFiles(files);
    onFileSelect(files);
  };

  const handleCheckChange = (id) => {
    setSelectedChecks((prev) =>
      prev.map((check) =>
        check.id === id ? { ...check, checked: !check.checked } : check
      )
    );
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      onClose();
      return;
    }
    setUploading(true);
    setError("");
    try {
      const selected = selectedChecks.filter((check) => check.checked);
      if (selected.length === 0) {
        setUploading(false);
        alert("Please select at least one analytical check.");
        return;
      }

      // Generate new requestId for this upload
      const newRequestId = `${userData?.sessionId}_${Date.now()}`;
      console.log("New Request ID for Bulk Upload:", newRequestId);

      // Upload files with new requestId
      await uploadFiles(selectedFiles, newRequestId);
      console.log("Chunk upload successful, proceeding to process checks");

      // Call bulk-upload-process API with loader still active
      const response = await onCheckSubmit(selected, newRequestId);
      console.log("Bulk process response:", response);

      // Enforce minimum 3-second loader duration
      const startTime = Date.now();
      await new Promise(
        (resolve) => (timeoutRef.current = setTimeout(resolve, 3000))
      );
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 3000 - elapsedTime));
      }

      setUploading(false);
      setMessage(true);
      setError(""); // Clear any previous errors
    } catch (err) {
      setUploading(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear timeout on error
      }
      console.error("Full error object:", err);
      if (err.response) {
        if (err.response.status === 400) {
          setError("Upload failed: Missing requestId. Please try again.");
        } else {
          setError(
            `Upload failed: ${
              err.response.data || "Server error"
            }. Please try again.`
          );
        }
      } else if (err.request) {
        setError(
          "Upload failed: No response from server. Please check your network and try again."
        );
      } else {
        setError(`Upload failed: ${err.message}. Please try again.`);
      }
    }
  };

  const uploadFiles = async (files, requestId) => {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
    for (const file of files) {
      const uploadId = `${file.name}-${Date.now()}`;
      const chunks = [];
      let start = 0;
      while (start < file.size) {
        const end = Math.min(start + CHUNK_SIZE, file.size);
        chunks.push(file.slice(start, end));
        start = end;
      }
      for (let index = 0; index < chunks.length; index++) {
        const formData = new FormData();
        formData.append("chunk", chunks[index]);
        formData.append("index", index.toString());
        formData.append("uploadId", uploadId);
        formData.append("fileName", file.name);
        formData.append("requestId", requestId);

        const session = getSession(); // Assuming getSession is available
        if (session) {
          formData.append("session", JSON.stringify(session));
        } else {
          throw new Error("Session expired. Please restart the session.");
        }

        if (index === chunks.length - 1) {
          formData.append("totalChunks", chunks.length.toString());
        }

        console.log(
          `Sending chunk ${index + 1}/${chunks.length} for ${
            file.name
          } with requestId: ${requestId}`
        );
        const response = await axios.post(
          `${api_url}/enterprise/upload-chunk`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            authorization: `Bearer ${userData.IdToken}`,
            timeout: 600000, // timeout
          }
        );
        console.log(`Chunk ${index + 1} uploaded, status: ${response.status}`);
      }
    }
    // Reset file input after upload to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModal = () => {
    setMessage(false);
    setError("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear timeout on modal close
    }
    setSelectedFiles([]);
    setSelectedChecks(
      analyticalChecks.map((check) => ({
        ...check,
        checked: check.checked || false,
        description: check.description.split(" ").slice(0, 5).join(" ") + "...",
      }))
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {!message && !uploading && !error ? (
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            You have selected bulk upload functionality
          </h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Upload here (Max 2GB)
            </label>
            <label className="text-white text-xs cursor-pointer bg-[#012386] p-2 rounded-md">
              Upload files
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.zip"
                className="w-full p-2 border border-gray-300 rounded text-sm hidden"
                disabled={uploading}
                ref={fileInputRef} // Attach ref to the input
              />
            </label>
            {selectedFiles.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <div>No of Files Uploaded: {selectedFiles.length}</div>
                <div>
                  Size of File Uploaded:{" "}
                  {(
                    selectedFiles.reduce((sum, file) => sum + file.size, 0) /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </div>
              </div>
            )}
          </div>
          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Select Analytical Checks
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {selectedChecks.map((check) => (
                  <CheckItem
                    key={check.id}
                    check={check}
                    onCheckChange={handleCheckChange}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={selectedFiles.length > 0 ? handleSubmit : handleModal}
              className="px-4 py-2 bg-[#012386] text-white text-sm rounded hover:bg-[#011d6b]"
              disabled={uploading}
            >
              {selectedFiles.length > 0 ? "Submit" : "OK"}
            </button>
          </div>
        </div>
      ) : uploading ? (
        <div className="bg-white rounded-lg p-6 w-full max-w-md flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-[#012386] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <h2 className="text-md font-semibold text-gray-800">
            Uploading files...
          </h2>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-md text-center font-semibold text-red-600 mb-4 h-full">
            {error}
          </h2>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleModal}
              className="px-4 py-2 bg-[#012386] text-white text-sm rounded hover:bg-[#011d6b]"
            >
              OK
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-md text-center font-semibold text-gray-800 mb-4 h-full">
            Thanks for your request. The report will be emailed to you and is
            also available on the My View page.
          </h2>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleModal}
              className="px-4 py-2 bg-[#012386] text-white text-sm rounded hover:bg-[#011d6b]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Assuming getSession is available in the scope (import it if needed)
const getSession = () => {
  // Mock implementation; replace with actual session retrieval logic
  return { userId: "mockUser", token: "mockToken" };
};

export default BulkUploadModal;
