import { Typography } from "@mui/material";
import { DeleteIcon, DeleteIconModel } from "public/assets/icons/common";
import { Dispatch, SetStateAction } from "react";
import CommonModal from "src/app/components/CommonModal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDelete?: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
  disable?: boolean;
}

function DeleteModal({
  isOpen,
  setIsOpen,
  onDelete,
  loading,
  title,
  description,
  disable,
}: IProps) {
  return (
    <>
      <CommonModal
        open={isOpen}
        handleToggle={() => setIsOpen(false)}
        modalTitle="Delete Item"
        maxWidth="310"
        DeleteModal={true}
        disabled={loading || disable}
        onSubmit={onDelete}
        btnTitle="Yes"
        closeTitle="Cancel"
      >
        <div className="flex flex-col items-center justify-center gap-10 ">
          {/* <div className="h-56 w-56 flex items-center justify-center rounded-full border-1 border-solid border-[#F44336] cursor-pointer "> */}
          <DeleteIconModel className="h-56 w-56 " />
          {/* </div> */}
          <Typography className="text-[20px] font-600 text-[#111827]">
            {title}
          </Typography>
          <Typography className="text-[14px] font-400 text-[#757982] text-center px-28">
            {description}
          </Typography>
        </div>
      </CommonModal>
    </>
  );
}

export default DeleteModal;
