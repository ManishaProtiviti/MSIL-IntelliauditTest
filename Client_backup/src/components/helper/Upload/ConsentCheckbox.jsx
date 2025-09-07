import React from "react";

const ConsentCheckbox = ({
  checked,
  onChange,
  consentWarning,
  onConsentChange,
}) => (
  <div className="relative flex items-center justify-center">
    <div
      className={`flex gap-2 ${
        consentWarning ? "border-2 border-red-500 rounded-lg p-2" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked);
          if (e.target.checked) onConsentChange(); // Reset warning when checked
        }}
        className="w-5 h-5 bg-[#012386] rounded-sm border-[#012386] checked:bg-[#012386] checked:text-white focus:ring-[#012386] accent-[#012386]"
      />
      <div className="text-xs text-[#191919] leading-2">
        Please ensure that you are not uploading PII data, or if you are
        uploading, that you have the necessary consent
      </div>
    </div>
  </div>
);

export default ConsentCheckbox;
