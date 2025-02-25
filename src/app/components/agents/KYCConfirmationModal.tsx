/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import { useSelector } from "react-redux";
import { AgentRootState } from "app/store/Agent/Interafce";
import { ApprovedIcon, RejectIcon } from "public/assets/icons/common";

interface IProps {
  isOpen: boolean;
  type?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: () => void;
  onChangeInput?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  heading?: string;
  description?: string;
  error?: string;
  isLoading?: boolean;
}

function KYCConfirmationModal({
  isOpen,
  type, // 1 For Reject 2 For Approved
  setIsOpen,
  onSubmit,
  onChangeInput,
  heading,
  error,
  description,
  isLoading,
}: IProps) {
  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => setIsOpen(false)}
      modalTitle=""
      maxWidth="310"
      DeleteModal
      disabled={isLoading}
      onSubmit={onSubmit}
      btnTitle="Yes"
      closeTitle="Cancel"
    >
      <div className="flex flex-col items-center justify-center gap-10 ">
        {/* <div className="h-56 w-56 flex items-center justify-center  border-1 border-solid border-[#F44336] cursor-pointer "> */}
        {type === 1 ? <RejectIcon /> : <ApprovedIcon />}
        {/* </div> */}
        <Typography className="text-[20px] font-600 text-[#111827]">
          {heading}
        </Typography>
        <Typography className="text-[14px] font-400 text-[#757982] text-center px-28">
          {description}
        </Typography>
        {type === 1 ? (
          <>
            <InputField
              onChange={onChangeInput}
              name="reject_reason"
              label="Reason"
              placeholder="Enter Reject Reason"
              multiline
              minRows={4}
              maxRows={4}
            />
            {error !== "" ? (
              <span className="text-left w-[100%] mt-[-10px] text-red  block ">
                {error}
              </span>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </CommonModal>
  );
}

export default KYCConfirmationModal;
