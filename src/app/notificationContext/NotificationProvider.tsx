import {
  GetNotificaitonList,
  GetUnreadNotificationCount,
  MarkNotificationRead,
} from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext({
  fetchNext: (is_mark: 0 | 1 = 0) => {},
  loading: false,
  pageLoading: false,
  notificationsList: [],
  setLoading: (loading: boolean) => {},
  getNotificationsData: (page = 0, is_mark: 0 | 1 = 0) => {},
  markAllRead: (notificationId, is_mark: 0 | 1 = 0) => {},
  getUnreadCount: () => {},
  unreadCount: 0,
  hasMore: true,
});

export const NotificationProvider = ({ children }) => {
  const [page, setPage] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [notificationsList, setNotificationList] = useState([]);
  const limit = 20;

  const getNotificationsData = async (start = 0, is_mark = 0) => {
    getUnreadCount();
    const res = await dispatch(GetNotificaitonList({ start, limit, is_mark }));
    if (res?.payload?.data?.data) {
      const list = res.payload.data.data.list.map((data) => ({
        id: data.id,
        title: data.userName,
        desc: data.message,
        date: data.createdAt,
        isRead: data.is_read === 1,
        url:
          data.type === 7
            ? `/password-manager`
            : data.type === 8
              ? `/shared-files`
              : `/projects/${data.project_id}/${data.project_name}`,
      }));
      const newList = start === 0 ? [...list] : [...notificationsList, ...list];
      setNotificationList([...newList]);
      setPage((prev) => start + 1);
      setPageLoading(false);
      setLoading(false);
      setHasMore(
        res.payload.data.data.total_records > newList.length ? true : false
      );
    } else {
      setHasMore(false);
    }
  };

  const fetchNext = async (is_mark = 0) => {
    if (hasMore) {
      setPageLoading(true);
      await getNotificationsData(page, is_mark);
    }
  };

  const markAllRead = async (notificationId, is_mark = 0) => {
    if (notificationId === 0) {
      setLoading(true);
    }
    await dispatch(MarkNotificationRead(notificationId));
    if (notificationId === 0) {
      await getNotificationsData(0, is_mark);
    } else {
      const newList = notificationsList.map((notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            isRead: true,
          };
        }
        return notification;
      });
      setNotificationList([...newList]);
      getUnreadCount();
    }
  };

  const getUnreadCount = async () => {
    const res = await dispatch(GetUnreadNotificationCount());
    setUnreadCount(res?.payload?.data?.data?.total_count || 0);
  };

  return (
    <NotificationContext.Provider
      value={{
        fetchNext,
        loading,
        pageLoading,
        notificationsList,
        setLoading,
        getNotificationsData,
        markAllRead,
        unreadCount,
        getUnreadCount,
        hasMore,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
