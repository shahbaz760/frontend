import { Box, Button, Modal, Typography } from "@mui/material";
import {
  setCondition,
  setFilter,
  setFilterData,
  setMainOp,
  setSortFilter,
  setprojectColumnId,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { GroupIcon } from "public/assets/icons/projectsIcon";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import ProjectMenuItems from "./ProjectMenuItems";

const GroupModal = ({ listData }) => {
  const isMobile = window.innerWidth <= 768;
  const location = useLocation();
  const { filterdata, filtered, conditions, MainOp, sorting } = useSelector(
    (store: ProjectRootState) => store?.project
  );
  const { id, uuid, name, subuuid } = useParams<{
    id: string;
    uuid?: string;
    name: string;
    subuuid?: string;
  }>();
  const [open, setOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState({});
  const dispatch = useAppDispatch();
  const [tableStatus, setTableStatus] = useState(0);
  const [tableOrder, setTableSelectedOrder] = useState(0);
  const buttonRef = useRef(null);

  const handleOpen = () => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    setModalStyle({
      top: buttonRect.bottom + 10,
      left: isMobile ? 20 : buttonRect.left,
      position: "absolute",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    if (filterdata?.key == null) {
      setTableSelectedOrder(0);
      setTableStatus(0);
    }
  };

  const groupMenuData = [
    { label: "Status", value: "0" },
    { label: "Assignee ", value: "1" },
    { label: "Priority", value: "2" },
    { label: "Label", value: "3" },
    { label: "Due Date", value: "4" },
  ];

  const groupAssendingData = [
    { label: "Ascending", value: "0" },
    { label: "Descending", value: "1" },
  ];
  const handleApply = ({ save = false }) => {
    setOpen(false);
    const payload = {
      key: tableStatus || 0,
      order: tableOrder,
    };
    dispatch(setFilterData(payload));
    dispatch(setprojectColumnId(tableStatus));
    dispatch(setFilter(1));
    listData({
      search: "",
      loader: false,
      is_filter_save: save ? 1 : 0,
      filter: 1,
      groupkey: tableStatus || filterdata.key || 0,
      order: tableOrder,
      group: true,
      sort: sorting.length > 0 ? sorting : [],
    });
  };

  const handleClearAll = () => {
    handleClose();

    if (filterdata?.key != null) {
      if (conditions.length == 0 || sorting.length == 0) {
        dispatch(setFilter(0));
      } else {
        dispatch(setFilter(1));
      }

      const payload = {
        key: null,
        order: 0,
      };
      dispatch(setFilterData(payload));
      setTableStatus(0);
      listData({
        search: "",
        loader: false,
        is_filter_save: 1,
        filter: conditions.length > 0 ? 1 : sorting.length > 0 ? 1 : 0,
        groupkey: null,
        order: 0,
        group: true,
        sort: sorting.length > 0 ? sorting : [],
        drag: false,
      });
    }
  };

  return (
    <>
      <Button
        ref={buttonRef}
        variant="contained"
        onClick={handleOpen}
        className={`${filterdata?.key != null ? "bg-[#EDEDFC] text-[#4F46E5] " : "bg-[#F6F6F6] text-[#757982] "} rounded-md text-12
          hover:bg-[#0000001f]  md:w-fit  items-center justify-start `}
      >
        {<GroupIcon fill={filterdata?.key != null ? "#4F46E5" : "#757982"} />}
        &nbsp;&nbsp; Group By{filterdata?.key != null && ":"}{" "}
        {filterdata?.key != null
          ? groupMenuData.find(
              (item) => item.value == (filterdata?.key || 0)?.toString()
            )?.label
          : ""}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiModal-backdrop ": {
            background: "transparent !important",
          },
        }}
      >
        <Box
          sx={{
            ...modalStyle,
            maxWidth: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 1.9,
            px: 3,
            py: 1,
          }}
        >
          <div
            className="flex justify-between py-2 sm:gap-20 gap-0 sm:flex-row flex-col items-start sm:items-center "
            // style={{ alignItems: "center" }}
          >
            <Typography
              className="rounded-md  text-[#000000] font-600 
          cursor-pointer text-[16px] pl-[7px] sm:pl-0"
            >
              Group By
            </Typography>
            <div className="flex sm:gap-[10px] gap-[5px] items-center">
              <Button
                className="text-para_light h-[30px] text-[12px]"
                onClick={() => handleClearAll()}
              >
                Clear All
              </Button>
              <Button
                className="h-[30px] text-[12px] text-secondary whitespace-nowrap"
                onClick={() => handleApply({})}
              >
                Apply
              </Button>
              <Button
                className="h-[30px] text-[12px] text-secondary bg-[#EDEDFC] rounded-4 py-0 whitespace-nowrap"
                onClick={() => handleApply({ save: true })}
              >
                Save Filter
              </Button>
            </div>
          </div>
          <div className="flex gap-10 mt-5 sm:flex-row flex-col">
            <ProjectMenuItems
              label={"Status"}
              icon={<GroupIcon />}
              className="bg-[#F6F6F6] rounded-md px-10 py-20 text-[#9DA0A6] font-400
          cursor-pointer text-[12px]"
              setTableSelectedItemDesign={setTableStatus}
              groupMenuData={groupMenuData}
              initial={filterdata?.key}
            />
            <ProjectMenuItems
              label={"Order"}
              icon={<GroupIcon />}
              className="bg-[#F6F6F6] rounded-md px-10 py-20 text-[#9DA0A6] font-400
          cursor-pointer text-[12px]"
              setTableSelectedItemDesign={setTableSelectedOrder}
              groupMenuData={groupAssendingData}
              initial={filterdata?.order}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default GroupModal;
