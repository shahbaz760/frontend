import Typography from "@mui/material/Typography";
import { SucessSubCancel } from "public/assets/icons/common";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
} from "public/assets/icons/welcome";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function SubscriptionCancel() {
  // State to track loading

  return (
    <>
      <div className="flex justify-center items-center flex-col min-h-screen gap-60 px-28 pt-60 pb-60">
        <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
        <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
        <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />

        <img src="assets/icons/remote-icon.svg" alt="" />

        <div className="bg-[#fff] w-[60%] h-auto sm:py-[8rem] py-60 px-20 sm:px-20 flex justify-center rounded-lg shadow-md ">
          <div
            className="flex flex-col justify-center align-items-center gap-40"
            style={{ alignItems: "center" }}
          >
            <SucessSubCancel />
            <Typography className="text-[24px] text-center font-600 leading-normal">
              Subscription Cancelled!
              <p className="text-[16px] font-300 text-[#757982] leading-4 pt-20">
                Your subscription has been terminated, and you will no
              </p>
              <p className="text-[16px] font-300 text-[#757982] leading-4 pt-10">
                longer have access to the services or benefits
              </p>
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}
