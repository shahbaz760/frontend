import ListLoading from "@fuse/core/ListLoading";
import { Typography } from "@mui/material";
import {
  AgentPaginationActivity,
  AgentRecentActivity,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { debounce } from "lodash";
import moment from "moment";
import { NoDataFound } from "public/assets/icons/common";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
interface ActivityData {
  activityData?: any;
  setActivityData?: any;
}
function RecentData(props: ActivityData) {
  const { activityData, setActivityData } = props;
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const scrollRef = useRef(null);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const [page, setPage] = useState(0);
  const { agentActivity } = useSelector(
    (store: ProjectRootState) => store?.project
  );

  const [listRecentData, setListRecentData] = useState<any>(agentActivity);

  useEffect(() => {
    setListRecentData(agentActivity);
  }, [agentActivity]);

  const loadMoreData = useCallback(async () => {
    setLoading(true);
    setIsFetching(true);
    try {
      const response = await dispatch(AgentPaginationActivity(activityData));
      // const payload=response.
      setLoading(false);
      const updatedList = response?.payload?.data?.data?.list;

      setListRecentData((prevData) => {
        const existingIds = new Set(prevData?.map((item) => item.id)); // Assuming items have an 'id' property
        const filteredNewData =
          updatedList?.filter((item) => !existingIds.has(item.id)) || [];
        return [...prevData, ...filteredNewData];
      });
      setActivityData((prevData) => ({
        ...prevData,
        start: prevData.start + 1,
      }));
    } finally {
      setIsFetching(false);
    }
  }, [listRecentData]);

  const handleScroll = useCallback(
    debounce(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const hasMoreData = agentActivity.length > 5; // Check if there's more data to fetch
        const totalRecordsFetched = agentActivity.length;

        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          !isFetching &&
          hasMoreData
          // scrollTop > lastScrollTop
        ) {
          setIsFetching(true);
          loadMoreData();
          setPage(page + 1);
          setIsFetching(false);
          // });
        }
        setLastScrollTop(scrollTop);
      }
    }, 300),
    [isFetching, agentActivity, page, lastScrollTop]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
  // useEffect(() => {
  //   const payload = {
  //     project_id: activityData.project_id,
  //     start: 0,
  //     limit: 10,
  //   };
  //   dispatch(AgentRecentActivity(payload));
  // }, []);

  return (
    <div
      className="shadow-md bg-white px-[18px] py-10 rounded-lg "
      ref={scrollRef}
    >
      <Typography className="text-xl font-600 mb-10">
        Recent Activity
      </Typography>
      <div>
        {listRecentData.length === 0 && loading != true ? (
          <div className="flex flex-col justify-center items-center gap-20 bg-[#F7F9FB] py-20 h-[calc(100vh-300px)]">
            <NoDataFound />
            <Typography className="text-[24px] text-center font-600 leading-normal">
              No Activity Found!
            </Typography>
          </div>
        ) : (
          listRecentData?.map((item, index) => {
            return (
              <div
                className="flex gap-[7px] py-14 border-b border-b-[#EDF2F6]"
                key={index}
              >
                <div className="w-[20%]">
                  <img
                    className="h-[34px] w-[34px] rounded-full"
                    src={
                      item?.user_image
                        ? urlForImage + item.user_image
                        : "../assets/images/logo/images.jpeg"
                    }
                    alt="User"
                  />
                </div>
                <div className="w-[78%]">
                  <div className="flex items-center justify-between mb-6 gap-10">
                    <Typography className="font-500 text-[14px] whitespace-nowrap">
                      {item?.userName}
                    </Typography>
                    <Typography className="text-[12px] text-[#757982] whitespace-nowrap">
                      {item?.created_at
                        ? moment(item.created_at).format("MMM Do, YYYY")
                        : "N/A"}
                    </Typography>
                  </div>
                  <Typography className="text-grey-600 text-[12px]">
                    {item?.message}
                  </Typography>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentData;
