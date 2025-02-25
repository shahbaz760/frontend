import { Tooltip, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import { NotificationIcon } from "public/assets/icons/topBarIcons";
import { useEffect, useRef, useState } from "react";
import Popover from "@mui/material/Popover";
import moment from "moment";
import { useNotificationContext } from "src/app/notificationContext/NotificationProvider";
import ListLoading from "@fuse/core/ListLoading";
import { debounce } from "lodash";
import { getClientId } from "src/utils";
import { useNavigate } from "react-router";

type NotificationsProps = {
  className?: string;
};

export default function Notifications(props: NotificationsProps) {
  const { className = "" } = props;
  const [userNotification, setUserNotification] = useState<HTMLElement | null>(
    null
  );
  const [active, setActive] = useState<0 | 1>(0);
  const {
    notificationsList,
    loading,
    pageLoading,
    fetchNext,
    setLoading,
    getNotificationsData,
    markAllRead,
    unreadCount,
    hasMore,
  } = useNotificationContext();
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);

  const userNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setLoading(true);
    getNotificationsData(0, active);
    setUserNotification(event.currentTarget);
  };

  const userNotificationClose = () => {
    setUserNotification(null);
  };

  const clientId = getClientId();
  const handleScroll = debounce(async () => {
    if (scrollRef.current && !pageLoading && hasMore) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 300 &&
        scrollTop > lastScrollTop
      ) {
        await fetchNext(active);
      }
      setLastScrollTop(scrollTop);
    }
  }, 300);
  // Effect to attach scroll event listener when component mounts

  useEffect(() => {
    const scrolledElement = scrollRef.current;
    if (scrolledElement) {
      scrolledElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrolledElement) {
        scrolledElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const navigateUser = async (notification) => {
    userNotificationClose();
    navigate(`${notification.url}${clientId ? `?ci=${clientId}` : ""}`);
    if (!notification.isRead) {
      await markAllRead(notification.id, active);
    }
  };

  const onChangeType = async (active) => {
    setActive(active);
    setLoading(true);
    await getNotificationsData(0, active);
  };

  return (
    <>
      <Tooltip title="Notifications" placement="bottom">
        <IconButton
          onClick={userNotificationClick}
          className={clsx(
            "h-40 w-40 p-8 mr-16",
            className,
            "bg-[#F7F9FB] relative"
          )}
          size="large"
        >
          <NotificationIcon />
          {unreadCount > 0 && (
            <div
              className={`absolute h-[25px] w-[25px] text-center top-[-5px] right-[-10px] flex justify-center items-center bg-[#4F46E5] z-10 text-[10px] text-white border border-white rounded-full`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(userNotification)}
        anchorEl={userNotification}
        onClose={userNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="top-[5px] rounded-[15px] border-[#EDEDFC] notification-data"
      >
        <div className="h-full min-h-[200px] sm:w-[439px] w-[280px] bg-white border">
          <div className="sm:h-[65px] h-[53px] w-full flex justify-between sm:items-center border-b px-[20px] border-[#EDEDFC] flex-col sm:flex-row sm:mt-0 mt-10">
            <Typography className="text-[18px] text-[#111827]">
              All Notifications
            </Typography>
            <button
              onClick={() => markAllRead(0, active)}
              disabled={loading || unreadCount == 0}
            >
              <Typography
                className={`text-[14px] ${loading || unreadCount == 0 ? "text-grey-400" : "text-[#4F46E5]"} cursor-pointer xs:text-left`}
              >
                Mark all as read
              </Typography>
            </button>
          </div>
          <div className="h-[50px] w-full flex gap-[20px] items-center px-[20px]">
            <button onClick={() => onChangeType(0)}>
              <Typography
                className={`text-[14px] ${active === 0 ? "text-[#111827]" : "text-[#757982]"} cursor-pointer`}
              >
                All
              </Typography>
            </button>
            <button onClick={() => onChangeType(1)}>
              <Typography
                className={`text-[14px] ${active === 1 ? "text-[#111827]" : "text-[#757982]"} cursor-pointer`}
              >
                Only Unread
              </Typography>
            </button>
          </div>
          <div
            className="overflow-y-auto h-[75vh] max-h-[75vh]"
            ref={scrollRef}
            onScroll={() => handleScroll}
          >
            {loading ? (
              <ListLoading className={"h-[100px]"} />
            ) : notificationsList && notificationsList.length > 0 ? (
              notificationsList.map((notification, index) => (
                <div
                  key={`notification-${index}`}
                  onClick={() => navigateUser(notification)}
                  className="min-h-[75px] w-full cursor-pointer bg-[#F6F8FA] border-b px-[20px] py-[18px] border-[#EDEDFC]"
                >
                  <div className="">
                    <div className="flex justify-between gap-1">
                      <Typography className="text-[14px] w-[220px] font-500 text-[#000000] truncate">
                        {notification?.title || "NA"}
                      </Typography>
                      <div className="h-[18px] flex gap-4 items-center justify-end">
                        {!notification.isRead && (
                          <div className="bg-[#4F46E5] h-[6px] w-[6px] rounded-full"></div>
                        )}
                        <Typography className="text-[12px] text-[#757982] whitespace-nowrap">
                          {notification?.date
                            ? moment(notification.date).format("MM/DD/YYYY") ===
                              moment().format("MM/DD/YYYY")
                              ? moment(notification.date).format("hh:mm a")
                              : moment(notification.date).format("DD MMM YYYY")
                            : "NA"}
                        </Typography>
                      </div>
                    </div>
                    <Typography className="text-[14px] text-[#757982] flex flex-wrap">
                      {notification?.desc || "NA"}
                    </Typography>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[75px] w-full px-[20px] font-500 py-[18px] flex justify-center items-center">
                No Notification Available!
              </div>
            )}
            {pageLoading && !loading && <ListLoading />}
          </div>
        </div>
      </Popover>
    </>
  );
}
