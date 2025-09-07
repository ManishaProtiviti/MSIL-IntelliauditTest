import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import marutiBlueLogo from "../../assets/maruti-blue-logo.png";
import homeBlueIcon from "../../assets/sidebar-icons/home-blue-icon.svg";
import homeGrayIcon from "../../assets/sidebar-icons/home-gray-icon.svg";
import myViewBlueIcon from "../../assets/sidebar-icons/myview-blue-icon.svg";
import myViewGrayIcon from "../../assets/sidebar-icons/myview-gray-icon.svg";
import adminBlueIcon from "../../assets/sidebar-icons/admin-blue-icon.svg";
import adminGrayIcon from "../../assets/sidebar-icons/admin-gray-icon.svg";
import superAdminBlueIcon from "../../assets/sidebar-icons/super-admin-blue-icon.svg";
import superAdminGrayIcon from "../../assets/sidebar-icons/super-admin-gray-icon.svg";
import apiViewBlueIcon from "../../assets/sidebar-icons/api-view-blue-icon.svg";
import apiViewGrayIcon from "../../assets/sidebar-icons/api-view-gray-icon.svg";
import mastersBlueIcon from "../../assets/sidebar-icons/masters-blue-icon.svg";
import mastersGrayIcon from "../../assets/sidebar-icons/masters-gray-icon.svg";
import userGuideBlueIcon from "../../assets/sidebar-icons/user-guide-blue-icon.svg";
import userGuideGrayIcon from "../../assets/sidebar-icons/user-guide-gray-icon.svg";
import supportBlueIcon from "../../assets/sidebar-icons/support-blue-icon.svg";
import supportGrayIcon from "../../assets/sidebar-icons/support-gray-icon.svg";
import logoutBlueIcon from "../../assets/sidebar-icons/logout-blue-icon.svg";
import logoutGrayIcon from "../../assets/sidebar-icons/logout-gray-icon.svg";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState("");
  const [isHover, setIsHover] = useState(false);

  const navigationItems = [
    {
      id: "Home",
      label: "Home",
      selectedIcon: homeBlueIcon,
      unSelectedIcon: homeGrayIcon,
      iconSize: "w-4 h-4",
      url: "/home",
    },
    {
      id: "My View",
      label: "My View",
      selectedIcon: myViewBlueIcon,
      unSelectedIcon: myViewGrayIcon,
      iconSize: "w-4 h-4",
      url: "/my-view",
    },
    {
      id: "Admin View",
      label: "Admin View",
      selectedIcon: adminBlueIcon,
      unSelectedIcon: adminGrayIcon,
      iconSize: "w-4 h-4",
      url: "/admin-view",
    },
    {
      id: "Super Admin View",
      label: "Super Admin View",
      selectedIcon: superAdminBlueIcon,
      unSelectedIcon: superAdminGrayIcon,
      iconSize: "w-4 h-4",
      url: "/super-admin-view",
    },
    {
      id: "API View",
      label: "API View",
      selectedIcon: apiViewBlueIcon,
      unSelectedIcon: apiViewGrayIcon,
      iconSize: "w-4 h-4",
      url: "/api-view",
    },
    {
      id: "User Guide",
      label: "User Guide",
      selectedIcon: userGuideBlueIcon,
      unSelectedIcon: userGuideGrayIcon,
      iconSize: "w-4 h-4",
      url: "/user-guide",
    },
    {
      id: "Support",
      label: "Support",
      selectedIcon: supportBlueIcon,
      unSelectedIcon: supportGrayIcon,
      iconSize: "w-4 h-4",
      url: "/support",
    },
  ];

  useEffect(() => {
    const current = navigationItems.find((item) =>
      location.pathname.startsWith(item.url)
    );
    if (current) {
      setActiveItem(current.id);
    }
  }, [location.pathname]);

  const handleItemClick = (itemId, url) => {
    setActiveItem(itemId);
    navigate(url);
  };

  const handleLogout = () =>{
    sessionStorage.clear();
    navigate("/")
  }

  return (
    <nav className="relative col-span-2 grid grid-rows-12 grid-flow-col w-full max-h-full bg-white border-r border-[#e0e0e0] px-4">
      <div className="grid w-full justify-center items-center row-span-1">
        <img
          src={marutiBlueLogo}
          alt="Maruti Logo"
          width="180"
          className="relative h-8 object-contain"
        />
      </div>

      <div className="grid row-span-6 items-center">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-[7px] w-full justify-start ${
              activeItem === item.id
                ? "bg-[#023eed1a] text-[#012386] hover:bg-[#023eed1a]"
                : "text-[#737891] hover:bg-gray-50"
            }`}
            onClick={() => handleItemClick(item.id, item.url)}
            aria-current={activeItem === item.id ? "page" : undefined}
          >
            <img
              className={`relative ${item.iconSize}`}
              alt={`${item.label} icon`}
              src={
                activeItem === item.id ? item.selectedIcon : item.unSelectedIcon
              }
            />
            <span className="text-xs text-left leading-[17px] font-medium">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <button
        className="row-span-3 flex items-center gap-2.5 p-3 rounded-[7px] w-full justify-start hover:text-[#012386] text-[#737891] "
        onClick={handleLogout}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <img
          className="relative w-4 h-4"
          alt="Logout"
          src={isHover ? logoutBlueIcon : logoutGrayIcon}
        />
        <span className="text-xs text-left leading-[17px] font-medium">
          Sign Out
        </span>
      </button>

      <hr className="relative grid row-span-1" />
      <div className="grid row-span-1 relative justify-center">
        <div className="relative text-black text-xs">
          <div>©️ Protiviti</div>
        </div>
      </div>
    </nav>
  );
};

export default SideBar;
