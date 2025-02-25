import { Typography } from "@mui/material";
import { DeleteIcon, DeleteIconModel } from "public/assets/icons/common";
import { Dispatch, SetStateAction } from "react";
import CommonModal from "src/app/components/CommonModal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDelete?: () => void;
  loading?: boolean;
  disable?: boolean;
}

function DeleteProject({
  isOpen,
  setIsOpen,
  onDelete,
  loading,
  disable,
}: IProps) {
  return (
    <CommonModal
      open={isOpen}
      handleToggle={(e) => {
        setIsOpen(!isOpen);
        // e.stsopPropagation();
      }}
      modalTitle="Delete Product"
      maxWidth="310"
      DeleteModal={true}
      disabled={disable}
      onSubmit={onDelete}
      btnTitle="Yes"
      closeTitle="Cancel"
    >
      <div className="flex flex-col items-center justify-center gap-10 ">
        {/* <div className="h-56 w-56 flex items-center justify-center rounded-full border-1 border-solid border-[#F44336] cursor-pointer "> */}
        <DeleteIconModel className="h-56 w-56 " />
        {/* </div> */}
        <Typography className="text-[20px] font-600 text-[#111827]">
          Delete Project
        </Typography>
        <Typography className="text-[14px] font-400 text-[#757982] text-center px-28">
          Are you sure you want to delete this project?
        </Typography>
      </div>
    </CommonModal>
  );
}

export default DeleteProject;
