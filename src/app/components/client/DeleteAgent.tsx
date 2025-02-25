import { Typography } from "@mui/material";
import { AccManagerRootState } from "app/store/AccountManager/Interface";
import { AgentGroupRootState } from "app/store/Agent group/Interface";
import { AgentRootState } from "app/store/Agent/Interafce";
import { ClientRootState } from "app/store/Client/Interface";
import { ProjectRootState } from "app/store/Projects/Interface";
import { DeleteIcon, DeleteIconModel } from "public/assets/icons/common";
import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import CommonModal from "../CommonModal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDelete?: () => void;
  loading?: boolean;
  heading?: string;
  description?: string;
  isLoading?: boolean;
  CallListApi?: any;
}

function DeleteAgent({
  isOpen,
  setIsOpen,
  onDelete,
  loading,
  heading,
  description,
  isLoading,
}: IProps) {
  return (
    <>
      <CommonModal
        open={isOpen}
        handleToggle={() => setIsOpen(false)}
        modalTitle="Add Client"
        maxWidth="310"
        DeleteModal={true}
        disabled={isLoading}
        onSubmit={onDelete}
        btnTitle="Yes"
        closeTitle="Cancel"
      >
        <div className="flex flex-col items-center justify-center gap-10 ">
          {/* <div className="h-56 w-56 flex items-center justify-center rounded-full border-1 border-solid border-[#F44336] cursor-pointer "> */}
          <DeleteIconModel className="h-56 w-56 " />
          {/* </div> */}
          <Typography className="text-[20px] font-600 text-[#111827] px-10 text-center">
            {heading}
          </Typography>
          <Typography className="text-[14px] font-400 text-[#757982] text-center px-28 ">
            {description}
          </Typography>
        </div>
      </CommonModal>
    </>
  );
}

export default DeleteAgent;
