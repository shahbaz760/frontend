import FuseLoading from "@fuse/core/FuseLoading";
import {
  FormControlLabel,
  Radio,
  Switch,
  Theme,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/styles";
import { GetGlobalReminder, UpdateGlobalReminder } from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router";
import TitleBar from "src/app/components/TitleBar";
import { getUserDetail } from "src/utils";
import TwoFactorGlobal from "./TwoFactorGlobal";
import toast from "react-hot-toast";

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

const userDetail = getUserDetail();

export default function Setting2FA() {
  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [limit, setLimit] = useState(20);
  const [selectedValue, setSelectedValue] = useState();
  const [filters, setfilters] = useState<any>({
    start: 0,
    limit,
    search: "",
  });
  const passRequir = [
    {
      label: "Weak: ",
      name: "Minimum 6 characters with no additional requirements.",
      highlights: [],
      value: 1,
    },
    {
      label: "Medium: ",
      name: "Minimum 8 characters, must include at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
      highlights: [],
      value: 2,
    },
    {
      label: "High: ",
      name: "Minimum 8 characters, must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and cannot contain repeated sequences like abcabc or 123123.",
      value: 3,
      highlights: ["abcabc", "123123"],
    },
    {
      label: " Extreme: ",
      name: "Minimum 8 characters, must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and cannot contain repeated sequences like abcabc or 123123.",
      value: 4,
      highlights: ["abcabc", "123123"],
    },
  ];
  const theme: Theme = useTheme();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {},
  });
  const { Accesslist, AccessStatus } = useSelector(
    (state: RootState) => state.project
  );
  const [updatedAuth, setUpdatedAuth] = useState([]);
  const [isAuthenticated, setIsAuthenticate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [authSwitches, setAuthSwitches] = useState([]);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [isOpenAuthModalClient, setIsOpenAuthModalClient] = useState(false);
  const navigate: NavigateFunction = useNavigate();
  const handleAuthSwitch = (userRole) => (e) => {
    setRole(userRole); // Set the user role

    // Update the switches based on userRole
    const updatedSwitches = authSwitches?.map((item) =>
      item.user_role === userRole
        ? { ...item, is_authenticate: e.target.checked ? 1 : 0 }
        : item
    );
    setUpdatedAuth(updatedSwitches);

    // Find the matching value using userRole
    const matchingItem = updatedSwitches.find(
      (item) => item.user_role === userRole
    );
    const isAuth = matchingItem?.is_authenticate === 1;

    setIsAuthenticate(isAuth);

    // Open the appropriate modal
    if (userRole === 6) {
      setIsOpenAuthModalClient(true);
    } else {
      setIsOpenAuthModal(true);
    }
  };

  const handleAuthRadio = async (userRole, value) => {
    setSelectedValue(value);
    setRole(userRole); // Set the user role

    setUpdatedAuth(value);
    setIsAuthenticate(value);

    // Update "Password Setting" if it exists, otherwise add it
    const updatedSettings = authSwitches.map((item) =>
      item.key === "Password Setting" && item.user_role === 7
        ? { ...item, is_authenticate: value }
        : item
    );

    const hasPasswordSetting = updatedSettings.some(
      (item) => item.key === "Password Setting" && item.user_role === 7
    );

    if (!hasPasswordSetting) {
      updatedSettings.push({
        key: "Password Setting",
        user_role: 7,
        is_authenticate: value,
      });
    }

    // Dispatch updated settings
    const res = await dispatch(
      UpdateGlobalReminder({
        two_factor_setting: updatedSettings,
      })
    );
    if (res?.payload?.data?.status == 1) {
      toast.success(res?.payload?.data?.message);
    }
  };
  const fetchDetalis = async () => {
    setLoading(true);
    try {
      const res = await dispatch(GetGlobalReminder());
      // toast.success(res?.payload?.data?.message);
      setAuthSwitches(res?.payload?.data?.data);

      const passwordSetting = res?.payload?.data?.data?.find(
        (item) => item.key === "Password Setting"
      );

      if (passwordSetting) {
        setSelectedValue(passwordSetting.is_authenticate);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDetalis();
  }, []);
  useEffect(() => {
    if (
      window.location.pathname.includes("setting") &&
      userDetail?.role_id == 4 &&
      Accesslist.is_settings == 0
    ) {
      navigate(`/401`);
    }
    // client_id
  }, [Accesslist]);

  if (loading == true) {
    return <FuseLoading />;
  }

  return (
    <>
      <>
        <TitleBar title="Global Settings"></TitleBar>

        <div className="px-[14px] mb-[3rem]">
          <div className="bg-white rounded-lg shadow-sm p-[2rem]">
            <div className=" flex items-center justify-between">
              <Typography className="text-[18px] font-600 text-[#0A0F18]">
                Manage 2 Factor Authentication
              </Typography>
            </div>
            <div className="bg-[#F6F6F6] rounded-lg shadow-sm px-[2rem] py-[1rem] my-[2rem] max-w-[850px]">
              {authSwitches
                ?.filter((item) => item.user_role !== 6 && item.user_role !== 7) // Filter items where user_role is not 6
                .map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between ${
                      index < authSwitches.length - 1
                        ? "border-b-1 border-[#E7E8E9]"
                        : ""
                    } pt-[1rem] pb-[2rem]`}
                  >
                    <Typography className="text-[16px] font-600 text-[#111827]">
                      {item.key}
                    </Typography>
                    <Android12Switch
                      checked={item.is_authenticate}
                      onChange={handleAuthSwitch(item.user_role)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="px-[15px] mb-[3rem]">
          <div className="bg-white rounded-lg shadow-sm p-[2rem]">
            <div className=" flex items-center justify-between">
              <Typography className="text-[18px] font-600 text-[#0A0F18]">
                Client Subscription Cancellation
              </Typography>
            </div>
            <div className="bg-[#F6F6F6] rounded-lg shadow-sm px-[2rem] py-[1rem] my-[2rem] mx-[10px] sm:mx-0 max-w-[850px]">
              {authSwitches
                ?.filter((item) => item.user_role === 6) // Filter items where user_role is not 6
                .map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between pt-[1rem] pb-[2rem]`}
                  >
                    <Typography className="text-[16px] font-600 text-[#111827]">
                      {item.key}
                    </Typography>
                    <Android12Switch
                      checked={item.is_authenticate}
                      onChange={handleAuthSwitch(item.user_role)}
                    />
                  </div>
                ))}
            </div>
            <div>
              <Typography className="text-[18px] font-600 text-[#0A0F18]">
                Password Requirements
              </Typography>
              <div className="bg-[#F6F6F6] rounded-lg shadow-sm px-[2rem] py-[1rem] my-[2rem] max-w-[850px]">
                {passRequir.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pt-[1rem] pb-[1rem]  border-b-1 border-[#E7E8E9]  "
                  >
                    <div className="flex gap-10 w-[90%] ">
                      <Typography className="text-[16px] font-600 text-[#111827] ">
                        {item.label}
                        {/* <span
                          className="text-[14px] font-400 "
                          style={{
                            color: "rgb(117 124 146 )",
                          }}
                        >
                          {item.name}
                        </span> */}
                        <span
                          className="text-[14px] font-400"
                          style={{ color: "rgb(117 124 146 )" }}
                          dangerouslySetInnerHTML={{
                            __html: item.highlights.reduce(
                              (text, highlight) => {
                                // Handle "abcabc" and "123123" with quotes
                                if (
                                  highlight === "abcabc" ||
                                  highlight === "123123"
                                ) {
                                  const regex = new RegExp(
                                    `(${highlight})`,
                                    "gi"
                                  );
                                  return text.replace(
                                    regex,
                                    '<span style="font-weight: bold;">"$1"</span>'
                                  );
                                }
                                // Default highlighting for other phrases
                                const regex = new RegExp(
                                  `(${highlight})`,
                                  "gi"
                                );
                                return text.replace(
                                  regex,
                                  '<span style="font-weight: bold;">$1</span>'
                                );
                              },
                              item.name
                            ),
                          }}
                        ></span>
                      </Typography>
                    </div>
                    <div className="w-[5%] sm:w-auto">
                      <FormControlLabel
                        value={item.label}
                        label={""}
                        control={
                          <Radio
                            checked={selectedValue === item.value}
                            onChange={() => {
                              // setSelectedValue(item.value);
                              handleAuthRadio(7, item.value);
                            }}
                            sx={{
                              color: "#ADAFB5",
                              background: "none",
                              "&:hover": {
                                background: "none", // Remove the hover background
                              },
                            }}
                          />
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <TwoFactorGlobal
          isOpen={isOpenAuthModal}
          setIsOpen={setIsOpenAuthModal}
          isAuthenticated={isAuthenticated}
          setIsAuthenticate={setIsAuthenticate}
          value={updatedAuth}
          setAuthSwitches={setAuthSwitches}
          title={"Reminder"}
          role={role}
          // id={userDetails?.id}
        />

        <TwoFactorGlobal
          isOpen={isOpenAuthModalClient}
          setIsOpen={setIsOpenAuthModalClient}
          isAuthenticated={isAuthenticated}
          setIsAuthenticate={setIsAuthenticate}
          value={updatedAuth}
          setAuthSwitches={setAuthSwitches}
          title={"Reminder"}
          role={role}
          // id={userDetails?.id}
        />
        {/* <AddGroupModel isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} /> */}
      </>
    </>
  );
}
