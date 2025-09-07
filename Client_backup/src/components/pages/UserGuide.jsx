import SideBar from "../helper/SideBar";
import HeaderSection from "../helper/HeaderSection";

const UserGuide = () => {
  return (
    <div className="bg-[#f3f3f3] min-h-screen w-full">
      <div className="w-full h-auto">
        <div className="relative grid grid-cols-12 min-h-screen">
          <SideBar activePage="User Guide" />

          <div className="relative col-span-10 grid grid-rows-[auto_1fr_auto] h-screen overflow-hidden">
            <HeaderSection title="User Guide" />
            <div className="text-xl text-gray-400 font-semibold flex w-full items-center justify-center">Coming Soon...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
