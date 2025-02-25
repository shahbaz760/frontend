import { projectGetMenu } from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import {
  ChatIcon,
  DocIcon,
  WhiteBoardIcon,
} from "public/assets/icons/projectsIcon";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CommonModal from "../../CommonModal";
import CommonChip from "../../chip";
import ChatDesign from "./ChatDesign";
import DocDesign from "./DocDesign";
import WhiteBoardPage from "./WhiteBoardPage";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  boardList: any;
  setBoardList: (data: any) => void;
  id?: any;
}

function WhiteBoard({
  isOpen,
  setIsOpen,
  boardList,
  setBoardList,
  id,
}: IProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const [boardDetails, setBoardDetails] = useState({
    whiteBoard: false,
    doc: false,
    chat: false,
  });
  const [boardlistData, setDataBoardList] = useState([]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    // setBoardDetails({ ...boardList });
  }, [boardList]);

  const handleChipClick = (component: string) => {
    setSelectedComponent(component);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedComponent(null); // Reset selected component when closing modal
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => setIsOpen((prev) => !prev)}
      modalTitle="Add More List"
      maxWidth="910"
      btnTitle={"Add List"}
      closeTitle={"Close"}
      onSubmit={() => {
        setBoardList({ ...boardDetails });
        setIsOpen((prev) => !prev);
        setBoardDetails({
          whiteBoard: false,
          doc: false,
          chat: false,
        });
      }}
      // customButton={true}
    >
      <div className="flex gap-12 flex-wrap text-[#333333]">
        <CommonChip
          // label={
          //   (boardlistData &&
          //     boardlistData.find((board) => board.menu == 4)?.name) ||
          //   "Whiteboard"
          // }
          label="Whiteboard"
          icon={<WhiteBoardIcon />}
          className={`cursor-pointer !text-[#333333] ${
            boardDetails?.whiteBoard
              ? " border-1 border-solid border-[#393F4C]"
              : ""
          }`}
          onClick={() => {
            handleChipClick("whiteboard");

            setBoardDetails((values) => {
              return {
                ...values,
                whiteBoard: !boardDetails.whiteBoard,
              };
            });
          }}
        />

        <CommonChip
          label="Doc"
          icon={<DocIcon />}
          className={`cursor-pointer !text-[#333333] ${
            boardDetails?.doc ? "border-1 border-solid border-[#393F4C]" : ""
          }`}
          onClick={() => {
            handleChipClick("doc");
            setBoardDetails((values) => {
              return {
                ...values,
                doc: !boardDetails.doc,
              };
            });
          }}
        />
        <CommonChip
          // label={
          //   (boardlistData &&
          //     boardlistData.find((board) => board.menu == 6)?.name) ||
          //   "Chat"
          // }
          label="Chat"
          icon={<ChatIcon />}
          className={`cursor-pointer !text-[#333333] ${
            boardDetails?.chat ? " border-1 border-solid border-[#393F4C]" : ""
          }`}
          onClick={() => {
            handleChipClick("chat");

            setBoardDetails((values) => {
              return {
                ...values,
                chat: !boardDetails.chat,
              };
            });
          }}
        />
      </div>
      {selectedComponent == "whiteboard" && <WhiteBoardPage />}
      {selectedComponent == "doc" && <DocDesign />}
      {selectedComponent == "chat" && <ChatDesign />}
      {/* Add more conditions for other components */}
    </CommonModal>
  );
}

export default WhiteBoard;
