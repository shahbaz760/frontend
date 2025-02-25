import { Typography } from "@mui/material";
import { AccManagerRootState } from "app/store/AccountManager/Interface";
import { AgentGroupRootState } from "app/store/Agent group/Interface";
import { AgentRootState } from "app/store/Agent/Interafce";
import { ClientRootState } from "app/store/Client/Interface";
import { ProjectRootState } from "app/store/Projects/Interface";
import { Emoji } from "public/assets/icons/common";
import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import CommonModalMedia from "../CommonModalMedia";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDelete?: () => void;
  loading?: boolean;
  media?: string;
  heading?: string;
}

function MicrophonePopup({
  isOpen,
  setIsOpen,
  onDelete,
  loading,
  heading,
  media,
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
      <CommonModalMedia
        open={isOpen}
        handleToggle={() => setIsOpen(false)}
        maxWidth={"auto"}
        onSubmit={() => setIsOpen(false)}
      >
        {/* <div className="flex flex-col items-center  gap-10 "> */}
        <Typography
          className="text-[23px] font-600 text-[#111827] flex text-left  gap-3 px-28"
          style={{ alignItems: "center" }}
        >
          {heading}
          <Emoji />
        </Typography>
        <Typography className="text-[15px] font-400 text-[#757982] text-left px-28 mt-[6px]">
          {` Allow access to your ${
            media == "micro" ? "microphone" : "camera"
          }  by adjusting your media 
          `}
          <Typography>settings in the URL bar.</Typography>
        </Typography>
        {/* <MediaImages /> */}
        {/* </div> */}
        <img
          src={
            media == "micro"
              ? "../assets/images/media.png"
              : "../assets/images/camera.png"
          }
          className="px-28 mt-[16px]"
        />
      </CommonModalMedia>
    </>
  );
}

export default MicrophonePopup;
