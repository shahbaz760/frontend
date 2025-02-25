// import { Button, Tab, Tabs, Theme } from "@mui/material";
import { Typography } from "@mui/material";
import { dashboardCount } from "app/store/Auth";
import { useAppDispatch } from "app/store/store";
import { Arrow1, Polygon } from "public/assets/icons/common";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ActivityChart from "src/app/components/dashboard/ActivityChart";
import BarCharts from "src/app/components/dashboard/BarCharts";
import { getUserDetail } from "src/utils";

export default function AdminDashboard() {
  const initialState = {
    total_active_clients: 0,
    total_active_agents: 0,
    total_active_manager: 0,
    new_clients: [],
    new_sales: [],
  };
  const [count, setCount] = useState(initialState);
  const [sales, setSales] = useState(initialState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userDetails = getUserDetail();
  const fetchData = async (
    type = 0,
    start_date = "",
    end_date: "",
    customType = null
  ) => {
    try {
      const payload = {
        type: type,
        start_date: start_date,
        end_date: end_date,
      };
      //@ts-ignore
      const res = await dispatch(dashboardCount(payload));
      if (!customType) {
        setCount(res?.payload?.data?.data);
        setSales(res?.payload?.data?.data);
      } else if ((type === 0 && customType === 1) || type === 1) {
        setCount(res?.payload?.data?.data);
      } else {
        setSales(res?.payload?.data?.data);
      }

      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(0, "", "");
  }, []);

  return (
    <div>
      <div className="relative flex items-center justify-between py-10 px-28 ">
        <Typography className="text-[18px] py-28 font-bold sm:text-[30px]  ">
          Dashboard
        </Typography>
      </div>
      <div className="relative flex items-center justify-between py-10 px-28 ">
        <div className="w-full mx-auto p-4">
          <div
            className={`grid grid-cols-1  ${userDetails?.role_id == 4 ? "sm:grid-cols-1 lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"} 
             gap-[1.6rem]`}
          >
            <div
              className="bg-[#C7C4F6] rounded-lg p-[20px] relative overflow-hidden w-full cursor-pointer"
              onClick={() => navigate("/admin/client")}
            >
              <Arrow1 color="#4F46E5" />
              <div className="text-gray-900 text-[16px] font-medium font-['Inter'] mt-[23px]">
                Total Active Clients
              </div>
              <div className="text-indigo-600 text-[30px] font-bold font-['Inter'] mt-[8px]">
                {count?.total_active_clients}
              </div>
              <div className="absolute top-[-26px] right-[-30px]">
                <Polygon />
              </div>
            </div>
            <div
              className="bg-[#BAEAFE] shadow rounded-lg p-[20px] relative overflow-hidden w-full cursor-pointer"
              onClick={() => navigate("/admin/agents/list")}
            >
              <Arrow1 color="#2BA7DB" />
              <div className="text-gray-900 text-[16px] font-medium font-['Inter'] mt-[23px]">
                Total Active Agents
              </div>
              <div className="text-[#2BA7DB] text-[30px] font-bold font-['Inter'] mt-[8px]">
                {count?.total_active_agents}
              </div>
              <div className="absolute top-[-26px] right-[-30px]">
                <Polygon />
              </div>
            </div>

            {userDetails?.role_id !== 4 && (
              <div
                className="bg-[#F2CBFB] rounded-lg p-[20px] relative overflow-hidden cursor-pointer"
                onClick={() => navigate("/admin/acc-manager")}
              >
                <Arrow1 color="#A54BBB" />
                <div className="text-gray-900 text-[16px] font-medium font-['Inter'] mt-[23px]">
                  Total Active Managers
                </div>
                <div className="text-[#A54BBB] text-[30px] font-bold font-['Inter'] mt-[8px]">
                  {count?.total_active_manager}
                </div>
                <div className="absolute top-[-26px] right-[-30px]">
                  <Polygon />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative flex items-center py-10 px-28 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div className="w-full">
            <ActivityChart
              graphdata={count?.new_clients}
              fetchData={fetchData}
            />
          </div>
          <div className="w-full">
            <BarCharts graphdata={sales?.new_sales} fetchData={fetchData} />
          </div>
        </div>
      </div>

      {/* <GraphChart /> */}
      {/* <div className="relative flex items-center py-10 px-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      {/* <ActivityChart />
      <ActivityChart /> */}
      {/* </div>
      </div> */}
    </div>
  );
}
