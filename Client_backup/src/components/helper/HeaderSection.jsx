import React from "react";
import deLogo from "../../assets/power-by-DE-logo.png";
import profileIcon from "../../assets/header-icons/profile-icon.svg";
import clockIcon from "../../assets/header-icons/clock-icon.svg";
import { convertNormalToTimestamp, convertTimestampToNormal, convertTimestampToNormalWithoutMS } from "../utils/timeStampFormatter";

const HeaderSection = ({ title }) => {
  let userData =  JSON.parse(sessionStorage.getItem("session"));
  //const dateObject = new Date(userData.loginTime);
  //const formattedDate = dateObject.toLocaleTimeString('en-US')
  return (
    <header className="w-full bg-white border-b border-[#e6e9eb] p-2 flex justify-between items-center sticky z-20">
      <h1 className="text-sm font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-6">
        {/* Clock */}
        <div className="flex items-center gap-2 text-xs text-[#737891]">
          <img src={clockIcon} alt="clock" className="w-5 h-5" />
          <div className="leading-tight">
            <div className="font-semibold">{userData?.loginTime ? convertTimestampToNormalWithoutMS(userData?.loginTime, true) : "0000-00-00 00:00:00"}</div>
            <div>Login time</div>
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src={profileIcon}
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
          <div className="text-xs text-[#737891]">
            <div className="font-medium">{userData?.givenName}</div>
            <div className="text-[11px]">{userData?.department} - Super Admin</div>
          </div>
        </div>

        <img src={deLogo} alt="DE Logo" className="pb-2 w-24 h-8 object-contain" />
      </div>
    </header>
  );
};

export default HeaderSection;
