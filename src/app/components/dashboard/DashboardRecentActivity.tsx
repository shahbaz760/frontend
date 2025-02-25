// import { Button, Tab, Tabs, Theme } from "@mui/material";
import { Grid, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { ClientRootState } from "app/store/Client/Interface";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserDetail } from "src/utils";

export default function DashboardRecentActivity() {
  const theme: Theme = useTheme();
  const userDetails = getUserDetail();
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [showUpdateTable, setShowUpdateTable] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [updateTableIndex, setUpdateTableIndex] = useState<number>();
  const { resetActivity, clientResetActivity } = useSelector(
    (store: ClientRootState) => store.client
  );
  const [activityData, setActivityData] = useState([]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  const openRecentUpdateTable = (i: number) => {
    setUpdateTableIndex(i === updateTableIndex ? null : i);
    setShowUpdateTable(!showUpdateTable);
  };
  const hideRecenctTableUpdate = () => {
    setShowUpdateTable(false);
  };
  useEffect(() => {
    if (userDetails.role_id == 2) {
      setActivityData(resetActivity);
    } else {
      const newData = clientResetActivity?.map((item) => {
        return {
          ...item,
          createdAt: item?.created_at,
        };
      });
      setActivityData(newData);
    }
  }, [clientResetActivity, resetActivity]);
  return (
    <Grid container spacing={3} className="px-[15px] mb-[1rem] ">
      <Grid item xs={12} lg={12}>
        <div className="shadow-sm bg-white rounded-lg relative ">
          <Typography className="text-[16px] font-600 py-16 px-20">
            Recent Activity
          </Typography>
          {activityData?.length > 0 &&
            activityData?.map((item) => {
              return (
                <>
                  <div className="flex items-center justify-between gap-20 px-20 border-y-1 py-10 ">
                    <div>
                      <img
                        className="h-40 w-40 rounded-full"
                        src={
                          item.user_image
                            ? urlForImage + item.user_image
                            : "../assets/images/logo/images.jpeg"
                        }
                      ></img>
                    </div>
                    <div className="flex w-full gap-10 justify-between sm:flex-row flex-col">
                      <div>
                        <p className="font-500 text-[16px] text-[#151D48]">
                          {item.userName}
                        </p>
                        <p className="text-[14px] text-[#737791]">
                          {item.message}
                        </p>
                      </div>
                      <Typography className="text-[14px] text-[#757982] whitespace-nowrap ">
                        {item?.createdAt
                          ? moment(item?.createdAt).format("MMMM Do, YYYY")
                          : "N/A"}
                      </Typography>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </Grid>
    </Grid>
  );
}
