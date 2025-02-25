import { Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { ClientRootState } from "app/store/Client/Interface";
import { DeleteIcon, DeleteIconModel } from "public/assets/icons/common";
import { useSelector } from "react-redux";
import CommonModal from "src/app/components/CommonModal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDelete?: () => void;
  loading?: boolean;
  description?: string;
}

function UnassignedAgent({
  isOpen,
  setIsOpen,
  loading,
  onDelete,
  description,
}: IProps) {
  const { actionStatus, actionStatusDisabled } = useSelector(
    (store: ClientRootState) => store.client
  );
  return (
    <>
      <CommonModal
        open={isOpen}
        handleToggle={() => setIsOpen((prev) => !prev)}
        modalTitle="Add Client"
        maxWidth="310"
        DeleteModal={true}
        btnTitle="Yes"
        closeTitle="Cancel"
        onSubmit={onDelete}
        disabled={actionStatus || actionStatusDisabled}
      >
        <div className="flex flex-col items-center justify-center gap-10 ">
          <div className="h-56 w-56 flex items-center justify-center rounded-full border-1 border-solid border-[#F44336] cursor-pointer ">
            <DeleteIconModel className="h-56 w-56 " />
          </div>
          <Typography className="text-[20px] font-600 text-[#111827]">
            Unassigned
          </Typography>
          <Typography className="text-[14px]  text-[#757982] text-center px-28">
            {description}
          </Typography>
        </div>
      </CommonModal>
    </>
  );
}

export default UnassignedAgent;
