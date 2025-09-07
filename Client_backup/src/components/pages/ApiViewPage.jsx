import SideBar from "../helper/SideBar";
import HeaderSection from "../helper/HeaderSection";
import UserTable from "../helper/Tables/UserTable";
import activeUserData from "../utils/activeUserData";
import LineGraph from "../helper/Graphs/LineGraph";
import DateFilter from "../helper/DateFilter";
import MomTrendChart from "../helper/Graphs/MomTrendChart";

const ApiViewPage = () => {
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
  ];
  const passData = [99, 98, 99, 97, 99.5, 94, 98, 99, 99];
  const failData = [1, 2, 1, 3, 0.5, 6, 2, 1, 1];
  return (
    <div className="bg-[#f3f3f3] min-h-screen w-full">
      <div className="w-full h-auto">
        <div className="relative grid grid-cols-12 min-h-screen">
          <SideBar activePage="API View" />

          <div className="relative col-span-10 box-border grid grid-rows-[auto_1fr_auto] h-screen overflow-hidden">
            <HeaderSection title="API View" />

            {/* <div className="p-4 overflow-y-auto grid grid-cols-12 gap-4">

              <div className="col-span-12 grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <DateFilter />
                </div>
                <div className="col-span-8 grid grid-cols-6 gap-2">
                  <div className="col-span-2 bg-white rounded-md shadow-sm p-2 flex justify-between items-center text-sm font-medium">
                    <span>Geography</span>
                    <span>⌄</span>
                  </div>

                  <div className="col-span-2 bg-white rounded-md shadow-sm p-2 flex justify-between items-center text-sm font-medium">
                    <span>Dealer</span>
                    <span>⌄</span>
                  </div>
                  <div className="col-span-2 bg-white rounded-md shadow-sm p-2 flex justify-between items-center text-sm font-medium">
                    <span>XXX</span>
                    <span>⌄</span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-12 gap-4">
                <div className="lg:col-span-3 flex flex-col gap-3 bg-white py-2">
                  <div className="flex flex-row gap-2">
                    <span className="border-2 border-[#012378] rounded-md"></span>
                    <span className="text-md font-medium text-[#012378] p-1">
                      Key Numbers
                    </span>
                  </div>
                  <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 p-2">
                    <div className="flex items-center gap-2 bg-[#eeeeee] p-2 rounded-md">
                      <div className="flex justify-center text-xs font-medium bg-[#3CD188] text-white px-2 py-1 min-w-14 rounded">
                        42,200
                      </div>
                      <div className="text-xs font-medium">Docs Checked</div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#eeeeee] p-2 rounded-md">
                      <div className="flex justify-center text-xs font-medium bg-[#FF8800] text-white px-2 py-1 rounded min-w-14">
                        1122
                      </div>
                      <div className="text-xs font-medium">
                        Claims attempted
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#eeeeee] p-2 rounded-md">
                      <div className="flex justify-center text-xs font-medium bg-[#012378] text-white px-2 py-1 rounded min-w-14">
                        1.5GB
                      </div>
                      <div className="text-xs font-medium">Data Processed</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
                  <MomTrendChart
                    dataLabels={months}
                    passData={passData}
                    failData={failData}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <UserTable
                      title="Dealers with highest rejections"
                      tableData={activeUserData}
                      tableHeaders={[
                        "Dealer Name",
                        "Claims Attempted",
                        "Claims Failed",
                      ]}
                    />
                    <UserTable
                      title="Document wise rejection (%)"
                      tableData={activeUserData}
                      tableHeaders={[
                        "Document Type",
                        "Documents Processed",
                        "Documents Failed",
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div> */}
            <div className="text-xl text-gray-400 font-semibold flex w-full items-center justify-center">Coming Soon...</div>


            {/* Footer Note */}
            <div className="px-6 py-2 text-xs text-[#737891]">
              * Results are AI generated and may vary. Check for inaccuracies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiViewPage;
