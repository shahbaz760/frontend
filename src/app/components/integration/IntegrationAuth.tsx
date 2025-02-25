import { Typography } from "@mui/material";
import { twoFactorAuthentication } from "app/store/Auth";
import { useAppDispatch } from "app/store/store";
import { CrossGreyIcon, TwoFAIcon } from "public/assets/icons/common";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { getUserDetail } from "src/utils";
import CommonModal from "../CommonModal";
import { twoFactorAuthIntegration } from "app/store/integration";
import {
  GoogleIntegrationIcon,
  OutlookIcon,
} from "public/assets/icons/billingIcons";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isAuthenticated?: boolean;
  setIsAuthenticate?: any;
  id?: any;
  handleChange?: any;
  integration?: string;
}

function IntegrationAuth({
  isOpen,
  setIsOpen,
  isAuthenticated,
  setIsAuthenticate,
  id,
  handleChange,
  integration,
}: IProps) {
  const [disable, setDisable] = useState(false);
  const userDetails = getUserDetail();
  const dispatch = useAppDispatch();
  console.log(integration, "integration");
  const handleSave = async () => {
    setDisable(true);
    const newStatus = isAuthenticated ? 1 : 0;
    const newType = integration == "google" ? 1 : 2;

    const res = await dispatch(
      twoFactorAuthIntegration({
        type: newType,
        is_enable: newStatus === 0 ? 1 : 0,
      })
    );
    if (res?.payload?.data?.code == 201) {
      setDisable(false);
      toast.success(res?.payload?.data?.message);
      setIsAuthenticate(!isAuthenticated);
    } else if (res?.payload?.data?.code == 402) {
      toast.error(res?.payload?.data?.message);
      setIsAuthenticate(isAuthenticated);
      setDisable(false);
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
          setIsAuthenticate(isAuthenticated);
        }, 100);
      }}
      modalTitle="Google Integration Authentication"
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
            // setTimeout(() => {
            //   setIsAuthenticate(!isAuthenticated);
            // }, 100);
          }}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-10 ">
        {integration == "google" ? <GoogleIntegrationIcon /> : <OutlookIcon />}
        <Typography className="text-[20px] font-600 text-[#111827]">
          {!isAuthenticated ? "Enable" : "Disable"} Syncing
        </Typography>
        <Typography
          className={`text-[14px] font-400 text-[#757982] ${!isAuthenticated ? "px-20" : "px-28"} text-center `}
        >
          {`Are you sure you want to ${!isAuthenticated ? "enable" : "disable"} the syncing?`}
        </Typography>
      </div>
    </CommonModal>
  );
}

export default IntegrationAuth;
