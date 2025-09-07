import React from "react";

const UploadMessageModal = ({ isOpen, onClose, message, title, buttonName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
        <h3 className="text-lg font-semibold text-[#012378] mb-4">
          {title}
        </h3>
        <p className="text-sm text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#012378] text-white py-2 rounded-lg hover:bg-[#01307a] transition-colors"
        >
          {buttonName}
        </button>
      </div>
    </div>
  );
};

export default UploadMessageModal;
