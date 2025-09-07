// AdminPage.jsx
import SideBar from "../helper/SideBar";
import HeaderSection from "../helper/HeaderSection";
import BarGraph from "../helper/Graphs/BarGraph";
import PieChart from "../helper/Graphs/PieChart";
import UserTable from "../helper/Tables/UserTable";
import activeUserData from "../utils/activeUserData";
import LineGraph from "../helper/Graphs/LineGraph";
import DateFilter from "../helper/DateFilter";

const AdminPage = () => {
  return (
    <div className="bg-[#f3f3f3] min-h-screen w-full">
      <div className="w-full h-auto">
        <div className="relative grid grid-cols-12 min-h-screen">
          <SideBar activePage="Admin View" />

          <div className="relative col-span-10 grid grid-rows-[auto_1fr_auto] h-screen overflow-hidden">
            <HeaderSection title="Admin View" />

            {/* <div className="p-4 overflow-y-auto grid grid-cols-12 gap-2">
              <div className="col-span-12 grid grid-cols-12 gap-4 h-8">
                <div className="col-span-4">
                  <DateFilter />
                </div>
                <div className="col-span-4 bg-white rounded-md shadow-sm p-2 py-1 flex justify-between items-center text-sm font-medium">
                  <span>Files validated</span>
                  <span className="px-2 py-1 rounded bg-[#012378] text-white text-center text-xs">
                    42,200
                  </span>
                </div>
                <div className="col-span-4 bg-white rounded-md shadow-sm p-2 py-1 flex justify-between items-center text-sm font-medium">
                  <span>Data processed</span>
                  <span className="px-2 py-1 rounded bg-[#012378] text-white text-center text-xs">
                    1.5GB
                  </span>
                </div>
              </div>
              <div className="col-span-12">
                <h2 className="text-[#012378] text-xl font-semibold">
                  Outcome Overview
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                <PieChart />
                <BarGraph />
              </div>
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UserTable
                    title="Most active user"
                    tableData={activeUserData}
                    tableHeaders={[
                      "User Name",
                      "# of logins",
                      "# of files analyzed",
                    ]}
                  />
                  <UserTable
                    title="Most in-active user"
                    tableData={activeUserData}
                    tableHeaders={[
                      "User Name",
                      "# of logins",
                      "# of files analyzed",
                    ]}
                  />
                </div>
                <LineGraph />
              </div>
            </div> */}
            <div className="text-xl text-gray-400 font-semibold flex w-full items-center justify-center">Coming Soon...</div>

            {/* Footer */}
            <div className="px-6 py-2 text-xs text-[#737891]">
              * Results are AI generated and may vary. Check for inaccuracies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
