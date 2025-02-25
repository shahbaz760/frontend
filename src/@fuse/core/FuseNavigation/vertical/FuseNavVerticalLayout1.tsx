import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import FuseNavItem from "../FuseNavItem";
import { FuseNavigationProps } from "../FuseNavigation";
import { FuseNavItemType } from "../types/FuseNavItemType";
import { Button, Tooltip, Typography } from "@mui/material";
import { SideBarEmail } from "public/assets/icons/common";
import { useEffect, useRef, useState } from "react";
import { RootState, useAppDispatch } from "app/store/store";
import { GetSupportList, getDefaultDetail } from "app/store/Password";
import { filterType } from "app/store/Client/Interface";
import CreateTicket from "src/app/components/support/CreateTicket";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getUserDetail } from "src/utils";
import { AccessAccountManagerList } from "app/store/Projects";
import { Call, CometChat, Conversation, Group, GroupType, MessagesRequestBuilder, User } from "@cometchat/chat-sdk-javascript";
import ListLoading from "@fuse/core/ListLoading";

const StyledList = styled(List)(({ theme }) => ({
  "& .fuse-list-item": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0,0,0,.04)",
    },
    "&:focus:not(.active)": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(0,0,0,.05)",
    },
  },
  "& .fuse-list-item-text": {
    margin: 0,
  },
  "& .fuse-list-item-text-primary": {
    lineHeight: "20px",
  },
  "&.active-square-list": {
    "& .fuse-list-item, & .active.fuse-list-item": {
      width: "100%",
      borderRadius: "0",
    },
  },
  "&.dense": {
    "& .fuse-list-item": {
      paddingTop: 0,
      paddingBottom: 0,
      height: 32,
    },
  },
}));

export const TruncateText = ({ text, maxWidth }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);
  return (
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      <Typography
        ref={textRef}
        noWrap
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          // display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};
/**
 * FuseNavVerticalLayout1
 * This component is used to render vertical navigations using
 * the Material-UI List component. It accepts the FuseNavigationProps props
 * and renders the FuseNavItem components accordingly
 */
function FuseNavVerticalLayout1(props: FuseNavigationProps) {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const PasswordState = useSelector((state: RootState) => state.password);
  const navigate = useNavigate();
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const [filters] = useState<filterType>({
    start: 0,
    limit: 10,
    search: "",
  });
  const dispatch = useAppDispatch();
  const { navigation, active, dense, className, onItemClick, checkPermission } =
    props;

  function handleItemClick(item: FuseNavItemType) {
    onItemClick?.(item);
  };

  const userDetails = getUserDetail();
  const fetchDepartmentList = async () => {
    try {
      await dispatch(GetSupportList(filters));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchAccountManagerDetails = async () => {
    try {
      await dispatch(getDefaultDetail(userDetails?.id));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    {
      userDetails?.role_id == 2 && fetchAccountManagerDetails();
    }
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      await dispatch(AccessAccountManagerList());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      userDetails &&
      (userDetails?.role_id == 4 || userDetails?.role_id == 5)
    ) {
      fetchList();
    }
  }, []);

  useEffect(() => {
    if (userDetails?.role_id == 4 || userDetails?.role_id == 5) {
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);


  if (loading && (userDetails?.role_id == 4 || userDetails?.role_id == 5)) {
    return <ListLoading />;
  }
  const scrollToBottom = () => {
    const element = document.getElementById("verticalLayout");
    if (element) {
      element.scrollTop = element.scrollHeight; // Ensures it always scrolls to the bottom
    }
  };

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

  return (
    <>
      <StyledList
        className={clsx(
          "navigation whitespace-nowrap py-0",
          `active-${active}-list`,
          dense && "dense",
          className
        )}
        id="verticalLayout"
      >
        {navigation.map((_item) => {
          const accessKey = _item.check;
          const shouldHide = Accesslist && Accesslist[accessKey] == 0;
          // If shouldHide is true, do not render the item

          if (shouldHide) {
            if (location.pathname.includes(_item.url)) {
              // window.location.href = "accountManager/dashboard";
              // window.location.href = "401";
              navigate("/401");
            }
            return null; // Don't render this FuseNavItem
          }
          return (
            <>
              <FuseNavItem
                key={_item.id}
                type={`vertical-${_item.type}`}
                item={_item}
                nestedLevel={0}
                onItemClick={handleItemClick}
                checkPermission={checkPermission}
              />
            </>
          );
        })}
        {!PasswordState?.accManagerdata || PasswordState?.accManagerdata == ""
          ? null
          : userDetails &&
          (userDetails?.projects == true ||
            userDetails?.projects?.length > 0) &&
          userDetails?.role_id == 2 &&
          PasswordState?.accManagerdata &&
          PasswordState?.managerStatus == "idle" && (
            <div
              className="flex justify-center flex-col gap-10 bg-[#393F4C] m-5 rounded-12 py-20 "
              style={{ alignItems: "center" }}
            >
              <img
                src={`${PasswordState?.accManagerdata["Account_manager_details.user_image"] ? urlForImage + PasswordState?.accManagerdata["Account_manager_details.user_image"] : "/assets/images/logo/images.jpeg"}`}
                alt=""
                className="h-[100px] w-[100px] rounded-full"
              />
              <Typography className=" text-[16px] font-semibold capitalize">
                <TruncateText
                  text={
                    PasswordState?.accManagerdata[
                    "Account_manager_details.userName"
                    ] || "N/A"
                  }
                  maxWidth={150}
                />
              </Typography>
              <Typography className="text-[12px] font-semibold capitalize">
                {PasswordState?.accManagerdata[
                  "Account_manager_details.role_name"
                ] || "N/A"}
              </Typography>
              <Typography className="text-[12px] font-semibold flex gap-5">
                <SideBarEmail />{" "}
                <TruncateText
                  text={
                    PasswordState?.accManagerdata[
                    "Account_manager_details.email"
                    ] || "N/A"
                  }
                  maxWidth={140}
                />
              </Typography>
              <Button
                variant="outlined"
                // color="secondary"
                onClick={() => { scrollToBottom(); setIsOpenAddModal(true) }}
                className={` 
           h-[30px] text-[12px] font-500  px-20 w-[200px] cursor-pointer`}
              >
                Send a Message
              </Button>
              {/* <Button
                variant="contained"
                color="secondary"
                className={`
              h-[30px] text-[12px] font-500  px-20 w-[200px]`}
              >
                Schedule a Call
              </Button> */}
            </div>
          )}
      </StyledList>
      {isOpenAddModal && (
        <CreateTicket
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          fetchSupportList={fetchDepartmentList}
          create={true}
        />
      )}
    </>
  );
}

export default FuseNavVerticalLayout1;
