import { Typography } from "@mui/material";
import { UpdateGlobalReminder, UpdateReminder } from "app/store/Password";
import { useAppDispatch } from "app/store/store";
import { CrossGreyIcon, TwoFAIcon } from "public/assets/icons/common";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import CommonModal from "src/app/components/CommonModal";
import { Role } from "src/utils";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isAuthenticated?: boolean;
  setIsAuthenticate?: any;
  value?: any;
  tableList?: boolean;
  setAuthSwitches?: any;
  title?: string;
  role?: any;
  id?: string | number;
}

function TwoFactorGlobal({
  isOpen,
  setIsOpen,
  isAuthenticated,
  title,
  setAuthSwitches,
  value,
  role,
  id,
}: IProps) {
  const [disable, setDisable] = useState(false);

  const dispatch = useAppDispatch();

  const handleSave = async () => {
    setDisable(true);
    // setIsAuthenticate(isAuthenticated);
    const newStatus = isAuthenticated ? 1 : 0;
    setAuthSwitches(value);
    const res = await dispatch(
      UpdateGlobalReminder({
        two_factor_setting: value,
      })
    );
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
          {role == 6
            ? `${isAuthenticated ? "Allow" : "Disallow"} Clients to Cancel Subscriptions`
            : `${isAuthenticated ? "Enable" : "Disable"} 2FA for ${Role(role)}`}
        </Typography>
        <Typography
          className={`text-[14px] font-400 text-[#757982] ${!isAuthenticated ? "px-20" : "px-28"} text-center `}
        >
          {role == 6
            ? `Are you sure you want to ${isAuthenticated ? "enable" : "disable"} subscription cancellation for clients?`
            : `Are you sure you want to ${isAuthenticated ? "enable" : "disable"} 2-factor authentication?`}
        </Typography>
      </div>
    </CommonModal>
  );
}

export default TwoFactorGlobal;
