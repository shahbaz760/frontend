import { Switch, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { GetReminder } from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import { useEffect, useRef, useState } from "react";
import TitleBar from "src/app/components/TitleBar";
import { getClientId, getUserDetail } from "src/utils";
import TwoFactorAuth from "./TwoFactor";
import { NavigateFunction, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import ListLoading from "@fuse/core/ListLoading";

const Android12Switch = styled(Switch)(() => ({
  padding: 0,
  height: 27,
  width: 66,
  borderRadius: 100,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#9DA0A6",

    opacity: 1,
    "&::before, &::after": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    },
    "&::before": {
      content: '"Yes"',
      left: 10,
      color: "#fff",
      display: "none",
    },
    "&::after": {
      content: '"No"',
      right: 10,
      color: "#fff",
    },
  },
  "& .MuiButtonBase-root": {
    padding: 0,
    "& .MuiSwitch-input": {
      left: 0,
    },
    "&.Mui-checked": {
      "& .MuiSwitch-input": {
        left: "-55px",
      },
      transform: "translateX(36px)",
      "&+.MuiSwitch-track": {
        backgroundColor: "#4f46e5",
        opacity: 1,
        "&::before": {
          display: "inline",
        },
        "&::after": {
          display: "none",
        },
      },
    },
  },
  "& .MuiSwitch-thumb": {
    filter: "drop-shadow(0px 0px 6px rgba(0,0,0,0.1))",
    display: "block",
    boxShadow: "none",
    width: "23px",
    height: "auto",
    aspectRatio: 1,
    margin: "2px 4px",
    backgroundColor: "white",
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
        {text || "N/A"}
      </Typography>
    </Tooltip>
  );
};

const userDetail = getUserDetail();

export default function Reminder() {
  const dispatch = useAppDispatch();
  const { Accesslist } = useSelector((state: RootState) => state.project);

  const [updatedAuth, setUpdatedAuth] = useState([]);
  const [isAuthenticated, setIsAuthenticate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authSwitches, setAuthSwitches] = useState([]);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const navigate: NavigateFunction = useNavigate();
  const handleAuthSwitch = (index) => (e) => {
    const updatedSwitches = authSwitches?.map((item, idx) =>
      idx === index ? { ...item, value: e.target.checked ? 1 : 0 } : item
    );
    setUpdatedAuth(updatedSwitches);
    const matchingValue = updatedSwitches[index].value;
    setIsAuthenticate(matchingValue == 1 ? true : false);
    setIsOpenAuthModal(true);
  };

  const fetchDetalis = async () => {
    setLoading(true);
    try {
      const res = await dispatch(GetReminder());
      setAuthSwitches(res?.payload?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (userDetail.role_id != 1 && userDetail.role_id != 4) {
      fetchDetalis();
    }
  }, []);

  const clientId = getClientId();

  useEffect(() => {
    if (clientId) {
      const localStorageKeys = Object.keys(localStorage);
      const clientIdInStorage = localStorageKeys.some((key) =>
        key.includes(clientId)
      );

      if (!clientIdInStorage) {
        window.close();
      }
    }
  }, [clientId]);

  useEffect(() => {
    if (
      window.location.pathname.includes("setting") &&
      (userDetail?.role_id == 4 || userDetail?.role_id == 5) &&
      Accesslist.is_settings == 0
    ) {
      navigate(`/401`);
    }
    // client_id
  }, [Accesslist]);

  return (
    <>
      <TitleBar title="Settings" />
      <div className="px-[15px] mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm p-[2rem]">
          <div className=" flex items-center justify-between">
            <Typography className="text-[18px] font-600 text-[#0A0F18]">
              Reminders
            </Typography>
          </div>
          {loading ? (
            <ListLoading />
          ) : (
            <div className="bg-[#F6F6F6] rounded-lg shadow-sm px-[2rem] py-[1rem] my-[2rem] max-w-[850px]">
              {authSwitches?.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between ${index < authSwitches.length - 1 ? "border-b-1 border-[#E7E8E9]" : ""} pt-[1rem] pb-[2rem]`}
                >
                  <Typography className="text-[16px] font-600 text-[#111827]">
                    {item.key}
                  </Typography>
                  <Android12Switch
                    checked={item.value}
                    onChange={handleAuthSwitch(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TwoFactorAuth
        isOpen={isOpenAuthModal}
        setIsOpen={setIsOpenAuthModal}
        isAuthenticated={isAuthenticated}
        setIsAuthenticate={setIsAuthenticate}
        value={updatedAuth}
        setAuthSwitches={setAuthSwitches}
        title={"Reminder"}
        // id={userDetails?.id}
      />
    </>
  );
}
