import React from "react";

const FileUploadButton = ({ info2, setInfo2, infoIcon }) => (
  <button className="col-span-1 w-full bg-white rounded-lg shadow-md hover:bg-gray-50 flex items-center justify-between gap-4 px-2">
    <div className="w-4/5 text-xs text-[#3c3c3c] leading-4">
      Upload the file
    </div>
    <div className="w-1/5 flex items-center">
      <div className=" h-auto bg-[#ececec] rounded-[80px] flex items-center justify-center">
        <img
          className="w-5 h-5"
          alt="Image"
          src={infoIcon}
          onMouseEnter={() => setInfo2(true)}
          onMouseLeave={() => setInfo2(false)}
        />
      </div>
      {info2 && (
        <div className="absolute w-auto ml-5 bg-white rounded-[10px] shadow-[0px_2px_14px_4px_#00000014] p-2 z-20 flex item-center justify-center">
          <div className="text-xs text-[#626262]  text-center  leading-[21px]">
            Supported file types <br /> xlsx, xlsm, xls, xlsb
          </div>
        </div>
      )}
    </div>
  </button>
);

export default FileUploadButton;
