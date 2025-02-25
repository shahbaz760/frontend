import { Typography } from "@mui/material";
import { AccManagerRootState } from "app/store/AccountManager/Interface";
import { AgentGroupRootState } from "app/store/Agent group/Interface";
import { AgentRootState } from "app/store/Agent/Interafce";
import { ClientRootState } from "app/store/Client/Interface";
import { ProjectRootState } from "app/store/Projects/Interface";
import { DeleteIcon } from "public/assets/icons/common";
import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import CommonModal from "../../CommonModal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: () => void;
  loading?: boolean;
  heading?: string;
  description?: string;
  isLoading?: boolean;
  CallListApi?: any;
  icon?: any;
}

function PausedSubscription({
  isOpen,
  setIsOpen,
  onDelete,
  loading,
  heading,
  description,
  isLoading,
  icon,
}: IProps) {
  const { actionStatus } = useSelector(
    (store: AccManagerRootState) => store.accManagerSlice
  );
  const { actionStatusDisabled, actionStatusGroupMember } = useSelector(
    (store: AgentGroupRootState) => store.agentGroup
  );
  const { actionStatusAttachment } = useSelector(
    (store: AgentRootState) => store.agent
  );
  const { actionStatusClient } = useSelector(
    (store: ClientRootState) => store.client
  );
  const { actionDisable } = useSelector(
    (store: ProjectRootState) => store.project
  );
  return (
    <>
      <CommonModal
        open={isOpen}
        handleToggle={() => setIsOpen(false)}
        modalTitle="Add Client"
        maxWidth="310"
        DeleteModal={true}
        disabled={
          actionStatus ||
          actionStatusDisabled ||
          actionStatusAttachment ||
          actionStatusClient ||
          actionStatusGroupMember ||
          actionDisable ||
          isLoading
        }
        onSubmit={onDelete}
        btnTitle="Yes"
        closeTitle="Cancel"
      >
        <div className="flex flex-col items-center justify-center gap-10 ">
          <div className="h-56 w-56 flex items-center justify-center rounded-full cursor-pointer ">
            {icon}
          </div>
          <Typography className="text-[20px] font-600 text-[#111827]">
            {heading}
          </Typography>
          <Typography className="text-[14px] font-400 text-[#757982] text-center px-28">
            {description}
          </Typography>
        </div>
      </CommonModal>
    </>
  );
}

export default PausedSubscription;
