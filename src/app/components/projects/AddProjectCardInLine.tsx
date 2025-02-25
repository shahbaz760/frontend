import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Box,
  Button,
  Checkbox,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { GetAssignAgentsInfo } from "app/store/Client";
import { useAppDispatch } from "app/store/store";
import { debounce } from "lodash";
import { transparent } from "material-ui/styles/colors";
import moment from "moment";
import { AssignIconNew, PriorityIcon } from "public/assets/icons/task-icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getUserDetail, listData, Role, StyledMenuItem } from "src/utils";
import DropdownMenu from "../Dropdown";
import InputField from "../InputField";
import CommonChip from "../chip";
import CustomButton from "../custom_button";
import { dateTimeMenuData, priorityMenuData } from "../tasks/AddTask";
import { TaskAdd, updateProjectColumnList } from "app/store/Projects";
import { useSelector } from "react-redux";
import { ProjectRootState } from "app/store/Projects/Interface";

function formatDate(dateString) {
  // Define possible input formats, including the new format
  const inputFormats = [
    "DD/MM/YYYY h:mm A",
    "MM/DD/YYYY h:mm A",
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DD HH:mm A",
    "DD/MM/YYYY, HH:mm:ss",
    "DD/MM/YYYY , HH:mm:ss",
    "MMM Do, YYYY , h:mm A",
    "DD/MM/YYYY HH:mm",
    "DD/MM/YYYY HH:mm A",
    "YYYY-MM-DD HH:mm:ss",
  ];

  // Try to parse the date with each format
  let date = null;
  for (const format of inputFormats) {
    date = moment.utc(dateString, format, true);
    if (date.isValid()) {
      break;
    }
  }

  // Check if date is valid after attempting all formats
  if (!date || !date.isValid()) {

    return "";
  }

  // Format the date to the desired output format
  const formattedDate = moment.utc(date).format("DD/MM/YYYY h:mm A");

  return formattedDate;
}

const AddProjectCardInLine = ({
  project_id,
  ColumnId,
  setShowInLineAddForm,
  name,
  scrollToBottom,
  column_ids = null,
  state,
}) => {
  const TodoId = localStorage.getItem("todoColumn");
  const { filtered, filterdata, projectList, conditions } = useSelector(
    (store: ProjectRootState) => store?.project
  );
  const is_private = projectList.find(
    (item) => item.id == project_id
  )?.is_private;
  const dispatch = useAppDispatch();
  const getLoginedUser = getUserDetail();
  const [taskName, setTaskName] = useState("");
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>(
    filterdata.key == 2 ? (name != "" ? name : "Add Priority") : "Add Priority"
  );
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const userId = getUserDetail();
  // filter for agents
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: userId.role_id == 3 ? project_id : getLoginedUser?.id,
    is_user: 1,
    project_id: is_private == 1 ? project_id : 0,
  });
  const [selectedAgents, setSelectedAgents] = useState<any[]>(
    filterdata?.key == 1
      ? column_ids != 0
        ? column_ids?.split(",").map((id) => parseInt(id))
        : []
      : []
  );
  const [selectedLabels, setSelectedLabels] = useState<any[]>(
    filterdata?.key == 3
      ? column_ids != 0
        ? column_ids?.split(",").map((id) => parseInt(id))
        : []
      : []
  );
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("Add Assignee ");
  const [dateTimeMenu, setDateTimeMenu] = useState<HTMLElement | null>(null);
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    filterdata?.key == 4
      ? column_ids != ""
        ? moment(column_ids).format("DD/MM/YYYY h:mm A")
        : "Add Date"
      : "Add Date"
  );
  const [businessDate, setBusinessDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [calculatedDate, setCalculatedDate] = useState(
    filterdata?.key == 4 ? (column_ids != "" ? column_ids : "") : ""
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [customDate, setCustomDate] = useState(null);
  const [showLabelForm, setShowLabelForm] = useState<boolean>(false);
  const [showReminder, setShowReminder] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setCalenderOpen(true);
  };

  const handleDateChange = (newDate) => {
    setCustomDate(newDate);

    const formattedDate = moment(newDate).format("DD/MM/YYYY h:mm A");

    // Set the formatted date to the state variables
    setSelectedDate(formattedDate);
    setCalculatedDate(formattedDate);
    // formik.setFieldValue("date", "");
    setSelectedTime(null);
  };
  const debouncedSearch = useCallback(debounce((searchValue) => {
    // Update the search filter here
    setFilterMenu((prevFilters) => ({
      ...prevFilters,
      search: searchValue,
    }));
  }, 800), []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    debouncedSearch(value);
  };

  const handleAgentSelect = (agentId) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter((id) => id != agentId));
      if (selectedAgents?.length == 1) {
        setSelectedAgent("Add Assignee ");
      }
    } else {
      // If not selected, add to selection
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  // handle priority change
  const handlePriorityMenuClick = (data) => {
    setSelectedPriority(data);
    setPriorityMenu(null); // Close the dropdown priority menu after selection
  };

  const calculateFutureDate = (days, label) => {
    setBusinessDate(label);
    let date = new Date();
    // moment(date).format("DD/MM/YYYY h:mm A");
    let addedDays = 0;

    // Save the current time
    const currentHours = date.getHours();
    const currentMinutes = date.getMinutes();
    const currentSeconds = date.getSeconds();
    const currentMilliseconds = date.getMilliseconds();

    while (addedDays < days) {
      date.setDate(date.getDate() + 1);
      if (label.includes("business")) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          addedDays++;
        }
      } else {
        addedDays++;
      }
    }

    // Restore the current time
    date.setHours(
      currentHours,
      currentMinutes,
      currentSeconds,
      currentMilliseconds
    );

    // Format the date to YYYY-MM-DD HH:mm
    const formattedDate = moment(date).format("DD/MM/YYYY h:mm A");
    setSelectedDate(formattedDate);
    return formattedDate;
  };

  useMemo(() => {
    dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
      setAgentMenuData(res?.payload?.data?.data?.list);
    });
  }, [filterMenu.search]);

  const handleClose = () => {
    setAnchorEl(null);
    setCalenderOpen(false);
  };

  const handleSubmit = async () => {

    setLoading(true);
    const formData = new FormData();
    formData.append("project_id", project_id);
    formData.append(
      "project_column_id",
      filterdata?.key > 0 ? TodoId : ColumnId ? ColumnId : TodoId
    );
    formData.append("title", taskName);
    formData.append(
      "due_date_time",
      calculatedDate
        ? formatDate(calculatedDate)
        : selectedDate == "Due Date & Time"
          ? ""
          : formatDate(selectedDate)
    );

    formData.append("labels", selectedLabels as any);
    formData.append(
      "priority",
      selectedPriority === "Add Priority" ? "" : selectedPriority
    );
    formData.append("agent_ids", selectedAgents as any);

    const payloadResponse = {
      project_id: project_id,
      project_column_id:
        filterdata?.key > 0 ? TodoId : ColumnId ? ColumnId : TodoId,
      title: taskName,
      due_date_time: calculatedDate
        ? moment.utc(calculatedDate, "DD/MM/YYYY h:mm A").toISOString()
        : selectedDate == "Add Date"
          ? ""
          : moment.utc(selectedDate, "DD/MM/YYYY h:mm A").toISOString(),
      labels: selectedLabels as any,
      priority: selectedPriority == "Add Priority" ? "" : selectedPriority,
      agent_ids: selectedAgents as any,
    };
    dispatch(
      updateProjectColumnList({
        operation: "add",
        task: payloadResponse,
      })
    );
    setShowInLineAddForm(false);
    setTimeout(() => {
      setShowInLineAddForm(true);
      setTaskName("");
      setSelectedPriority("Add Priority");
      setCalculatedDate("");
      setSelectedAgents([]);
      // scrollToBottom();
    }, 0);


    try {
      const res = await dispatch(TaskAdd(formData));

      listData({
        loader: false,
        dispatch,
        project_id,
        groupkey: filterdata.key,
        drag: false,
        order: filterdata.order,
        filter: 1,
      });
      // }
      setLoading(false);


      setTaskName("");
      setSelectedPriority("Add Priority");
      setCalculatedDate("");
      setSelectedAgents([]);
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 400);
      return () => clearTimeout(timer);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.closest(".MuiPopover-root") && // Add this check for clicks inside Popover (dropdown)
      !event.target.closest(" .MuiPickersLayout-root")
    ) {
      setShowInLineAddForm(false); // Close the form when clicking outside
    }
  };

  useEffect(() => {
    // Attach the event listener when the component is mounted
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     scrollToBottom();
  //   }, 1500);
  // }, [state]);
  return (
    <div
      className="bg-[#F7F9FB] p-14 rounded-md  flex items-center flex-col border-2 border-[#4f46e5] "
      // style={{
      //   minHeight: 210,
      // }}
      ref={dropdownRef}
    >
      <form
        // style={{ width: "-webkit-fill-available !important" }}
        className="flex flex-col gap-1 relative w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          name="title"
          placeholder="Task Name..."
          variant="outlined"
          size="small"
          value={taskName}
          autoFocus={true}
          onChange={(e) => setTaskName(e.target.value)}
          InputProps={{
            style: {
              backgroundColor: "transparent",
              border: "none",
              marginBottom: "10px",
            },
            sx: {
              "&:focus": {
                outline: "none",
              },
              "& .MuiInputBase-input": {
                width: "calc(100% - 90px)",
                paddingLeft: "4px !important",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "black",
                opacity: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
              },
            },
          }}
        />

        <DropdownMenu
          handleClose={() => {
            setDateTimeMenu(null);
            setCalenderOpen(false);
          }}
          anchorEl={dateTimeMenu}
          button={
            <CommonChip
              onClick={(event) => setDateTimeMenu(event.currentTarget)}
              label={selectedDate}
              className={`w-full flex !flex-row !justify-start gap-8 !text-12 !items-center !px-0 hover:!bg-[#E0E0E0]  !bg-transparent${dateTimeMenu ? "border-1 border-solid border-[#9DA0A6] " : ""
                }`}
              icon={
                <FuseSvgIcon size={16}>
                  material-outline:calendar_today
                </FuseSvgIcon>
              }
              height={true}
            />
          }
          popoverProps={{
            open: !!dateTimeMenu,
            classes: {
              paper: "pt-10 pb-20",
            },
          }}
        >
          {dateTimeMenuData?.map((item) => (
            <StyledMenuItem
              key={item.label}
              onClick={() => {
                const futureDate = calculateFutureDate(item.days, item.label);
                setCalculatedDate(futureDate); // Store the calculated date
                // setSelectedDate(item.label); // Display the label
                setDateTimeMenu(null);
              }}
            >
              {item.label}
            </StyledMenuItem>
          ))}
          <div className="px-20">
            <CustomButton
              fullWidth
              variant="contained"
              startIcon={
                <FuseSvgIcon size={16}>
                  material-outline:add_circle_outline
                </FuseSvgIcon>
              }
              className="min-w-[224px] mt-10"
              onClick={handleClick}
            >
              Custom Date
            </CustomButton>
            <Popover
              open={calenderOpen}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <DateTimePicker
                open={calenderOpen}
                // onOpen={() => setOpen(true)} // Ensure open state is true when the calendar opens
                onClose={() => {
                  setCalenderOpen(false);
                  setDateTimeMenu(null);
                }}
                closeOnSelect={false}
                format="dd/MM/yyyy hh:mm A"
                value={customDate}
                minDate={new Date()}
                disablePast
                views={["year", "month", "day", "hours", "minutes"]}
                onChange={handleDateChange}
              />
            </Popover>
          </div>
          {selectedDate != "Add Date" && (
            <div className="px-20">
              <CustomButton
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={
                  <FuseSvgIcon>
                    material-outline:remove_circle_outline
                  </FuseSvgIcon>
                }
                className="min-w-[224px] mt-10"
                onClick={() => {
                  setSelectedDate("Add Date");
                  setCalculatedDate(null);
                  setShowLabelForm(false);
                  setShowReminder(null);
                  setDateTimeMenu(null);
                  setCalenderOpen(false);
                  //   formik.setFieldValue("time", "");
                  //   formik.setFieldValue("date", "");
                  setCustomDate(null);
                }}
              >
                Remove
              </CustomButton>
            </div>
          )}
        </DropdownMenu>

        <DropdownMenu
          // ref={dropdownRef}
          anchorEl={priorityMenu}
          handleClose={() => setPriorityMenu(null)}
          button={
            <CommonChip
              onClick={(event) => setPriorityMenu(event.currentTarget)}
              label={selectedPriority}
              className={`w-full flex !flex-row !justify-start gap-8 !text-12 hover:!bg-[#E0E0E0] !items-center !px-0 !bg-transparent${priorityMenu ? "border-1 border-solid border-[#9DA0A6] " : ""
                }`}
              icon={<PriorityIcon height={16} width={16} />}
              height
            />
          }
          popoverProps={{
            open: !!priorityMenu,
            classes: {
              paper: "pt-10 pb-20",
            },
          }}
        >
          {priorityMenuData?.map((item) => (
            <StyledMenuItem onClick={() => handlePriorityMenuClick(item.label)}>
              {item.label}
            </StyledMenuItem>
          ))}
          <Typography className="border-t-1 border-color-[#3333]">
            <StyledMenuItem
              onClick={() => {
                setSelectedPriority("Add Priority");
                setPriorityMenu(null);
              }}
            >
              Clear
            </StyledMenuItem>
          </Typography>
        </DropdownMenu>

        <DropdownMenu
          anchorEl={AgentMenu}
          handleClose={() => {
            setFilterMenu((prevFilters) => ({
              ...prevFilters,
              search: "",
            }));
            setAgentMenu(null);
          }}
          button={
            <CommonChip
              onClick={(event) => setAgentMenu(event.currentTarget)}
              className=" w-full flex overflow-y-hidden !pl-0 !flex-row !justify-start gap-8 hover:!bg-[#E0E0E0] 
              !text-12 !items-center !px-0 !bg-transparent overflow-x-auto "
              sx={{
                "& .MuiButtonBase-root-MuiChip-root": {
                  background: transparent,
                },
                "& .MuiChip-label": {
                  display: "inline-block",
                  maxWidth: 200,
                  overflowX: "auto",
                  msOverflowY: "hidden",
                  textOverflow: "inherit !important",
                  paddingLeft: 0,
                },
                "&:active": {
                  background: transparent,
                  boxShadow: "none !important",
                },
                "&:hover": {
                  background: transparent,
                  border: "none",
                },
                "&:focus": {
                  background: transparent,
                  outline: "none",
                },
              }}
              icon={<AssignIconNew height={16} width={16} />}
              label={
                selectedAgents?.length > 0
                  ? selectedAgents
                    ?.map(
                      (agentId) =>
                        agentMenuData?.find(
                          (item) => item.agent_id === agentId
                        )?.first_name
                    )
                    .join(",  ")
                  : selectedAgent
              }
              height={true}
            />
          }
          popoverProps={{
            open: !!AgentMenu,
            classes: {
              paper: "pt-10 pb-20",
            },
          }}
        >
          <div className="sm:w-[375px] p-10">
            <p className="text-title font-600 text-[1.6rem]">Assignee Name</p>
            <div className="relative w-full mt-10 mb-3 sm:mb-0">
              <InputField
                name={"agent"}
                placeholder={"Search Assignee"}
                className="common-inputField "
                inputProps={{
                  className: "w-full sm:w-full",
                }}
                onChange={handleSearchChange}
              />
              <div className="max-h-[150px] w-full overflow-y-auto shadow-sm cursor-pointer">
                {agentMenuData?.map((item: any) => (
                  <div
                    className="flex items-center gap-10 px-20 w-full"
                    key={item.id}
                    onChange={() => handleAgentSelect(item.agent_id)}
                  >
                    <label className="flex items-center gap-10 w-full cursor-pointer my-5">
                      <Checkbox
                        className="d-none hover:!bg-transparent"
                        checked={selectedAgents?.includes(item.agent_id)}
                        onChange={() => handleAgentSelect(item.agent_id)}
                      />
                      {/* <span>{item?.userName}</span> */}
                      <div className="h-[35px] w-[35px] rounded-full">
                        {item.user_image ? (
                          <img
                            src={urlForImage + item.user_image}
                            alt=""
                            className="h-[35px] w-[35px] rounded-full"
                          />
                        ) : (
                          <img src="../assets/images/logo/images.jpeg" alt="" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span>{item?.userName}</span>
                        <span className="text-[#757982] text-12">
                          {Role(item?.role_id)}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DropdownMenu>

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          className="h-[40px] text-[16px] flex gap-8  w-[40px]"
          size="small"
          // disabled={taskName.trim() == "" || loading}
          disabled={taskName.trim() == ""}
          sx={{
            bgcolor: "#EDEDFC",
            color: "#4F46E5",
            ":hover": {
              bgcolor: "#EDEDFC",
              color: "#4F46E5",
            },
            position: "absolute",
            top: 2,
            right: 2,
          }}
        >

          Save
        </Button>
      </form>
    </div>
  );
};

export default AddProjectCardInLine;
