import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { FaSyncAlt } from "react-icons/fa";

const UploadArea = ({
  uploadIcon,
  infoIcon,
  greenTickIcon,
  info,
  setInfo,
  progress,
  alpha,
  handleFileChange,
  handleDrop,
  consentChecked,
  uploadFailed = false,
  onUploadAttempt,
  handleRequestId,
  fileInputRef,
  isUploadComplete,
  onRefresh,
  checks,
}) => (
  <div
    className={`max-h-66 py-20 w-full box-border bg-white rounded-[10px] border-2 border-dashed ${
      isUploadComplete
        ? "border-gray-300 cursor-not-allowed"
        : "border-[#012386] cursor-pointer"
    } flex flex-col items-center justify-center relative`}
    onDrop={(e) => {
      if (!consentChecked) onUploadAttempt();
      if (!isUploadComplete) handleDrop(e);
    }}
    onDragOver={(e) => e.preventDefault()}
    onClick={() => {
      if (!consentChecked) onUploadAttempt();
      if (!isUploadComplete) handleRequestId();
    }}
  >
    <img className="w-12 h-12" alt="Cloud upload outline" src={uploadIcon} />
    <div className="text-xs text-gray-400 tracking-[0.50px] leading-[21px] box-border flex text-center gap-1 flex-col">
      <div className="flex gap-2">
        Drag and Drop files or{" "}
        <label
          className={`text-[#012386]  ${
            isUploadComplete
              ? "cursor-not-allowed"
              : "cursor-pointer hover:font-semibold"
          } flex text-center`}
        >
          Browse
          {consentChecked && !isUploadComplete ? (
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.zip"
              ref={fileInputRef}
              disabled={isUploadComplete}
            />
          ) : null}
        </label>
      </div>
      {isUploadComplete && (
        <button
          disabled={checks.some((c) => c.checked)}
          onClick={onRefresh}
          className={`flex justify-center items-center gap-2 ${
            checks.some((c) => c.checked) ? "text-gray-300" : "text-[#012378]"
          } font-medium text-xs rounded hover:font-semibold`}
        >
          <span>Discard Upload</span>
          <span>
            <FaSyncAlt />
          </span>
        </button>
      )}
    </div>
    <div className="absolute left-2 bottom-2">
      <div className="w-5 h-5 bg-[#ececec] rounded-[80px] flex items-center justify-center">
        <img
          className="w-5 h-5"
          alt="Information variant"
          src={infoIcon}
          onMouseEnter={() => setInfo(true)}
          onMouseLeave={() => setInfo(false)}
        />
      </div>
      {info && (
        <div className="absolute left-8 bottom-0 w-60 bg-white rounded-[10px] shadow-[0px_2px_14px_4px_#00000014] px-1">
          <div className="text-[10px] text-[#626262] tracking-[0.50px] leading-[21px] text-left">
            Supported file types: JPG, JPEG, PNG, PDF
          </div>
          <div className="text-[10px] text-[#626262] tracking-[0.50px] leading-[21px]">
            <span className="font-medium">Max individual file size: </span>
            <span className="font-semibold">5 MB</span>
          </div>
          <div className="text-[10px] text-[#626262] tracking-[0.50px] leading-[21px]">
            <span className="font-medium">Max total file size: </span>
            <span className="font-semibold">250 MB</span>
          </div>
        </div>
      )}
    </div>
    <div className="absolute w-8 h-8 right-1 bottom-1">
      <CircularProgressbarWithChildren
        value={uploadFailed ? 0 : progress}
        strokeWidth="14"
        text={uploadFailed ? "X" : progress === 100 ? "" : `${progress}%`}
        styles={buildStyles({
          rotation: 0.25,
          strokeLinecap: "butt",
          textSize: "25px",
          pathTransitionDuration: 0.5,
          pathColor: uploadFailed ? "red" : alpha(progress),
          trailColor: uploadFailed ? "#e0e0e0" : "#d6d6d6",
        })}
      >
        {!uploadFailed && progress === 100 && (
          <img src={greenTickIcon} alt="tick" width="15" />
        )}
      </CircularProgressbarWithChildren>
    </div>
  </div>
);

export default UploadArea;
