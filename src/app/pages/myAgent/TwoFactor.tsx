import { Typography } from "@mui/material";
import { ToggleAsscessAssignTask } from "app/store/Client";
import { useAppDispatch } from "app/store/store";
import { CrossGreyIcon, TwoFAIcon } from "public/assets/icons/common";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import CommonModal from "src/app/components/CommonModal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isAuthenticated?: number;
  setIsAuthenticate?: any;
  id?: any;
  value?: any;
  tableList?: boolean;
  setAuthSwitches?: any;
  title?: string;
  fetchAgentList?: any;
}

function TwoFactorAuth({
  isOpen,
  setIsOpen,
  tableList,
  isAuthenticated,
  id,
  title,
  fetchAgentList,
}: IProps) {
  const [disable, setDisable] = useState(false);

  const dispatch = useAppDispatch();

  const handleSave = async () => {
    setDisable(true);

    // setAuthSwitches(value);
    const res = await dispatch(ToggleAsscessAssignTask(id));
    fetchAgentList();
    if (res?.payload?.data?.status) {
      setDisable(false);
      toast.success(res?.payload?.data?.message);
    } else {
      setDisable(false);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen(false);
        setTimeout(() => {
          // setIsAuthenticate(!isAuthenticated);
        }, 100);
      }}
      modalTitle="Two-Factor Authentication"
      maxWidth="310"
      isHeaderDisplay={true}
      btnTitle="Yes"
      closeTitle="Cancel"
      onSubmit={handleSave}
      disabled={disable}
    >
      <div className="flex justify-end ">
        <CrossGreyIcon
          onClick={() => {
            setIsOpen(false);
            setTimeout(() => {
              // setIsAuthenticate(!isAuthenticated);
            }, 100);
          }}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-10 ">
        <TwoFAIcon />
        <Typography className="text-[20px] font-600 text-[#111827] text-center">
          {!isAuthenticated ? "Enable" : "Disable"} access
        </Typography>
        <Typography
          className={`text-[14px] font-400 text-[#757982] ${!isAuthenticated ? "px-20" : "px-28"} text-center `}
        >
          {`Are you sure you want to ${!isAuthenticated ? "enable" : "disable"} ${title}?`}
        </Typography>
      </div>
    </CommonModal>
  );
}

export default TwoFactorAuth;
