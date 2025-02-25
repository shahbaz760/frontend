import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Box,
  Button,
  Checkbox,
  Popover,
  TextField,
  Tooltip,
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
import { getUserDetail, Role, StyledMenuItem } from "src/utils";
import ListLoading from "@fuse/core/ListLoading";
import { AddLabellList, DeleteLabel, getLabelList } from "app/store/Agent";
import { projectColumnList, TaskAdd, TaskListColumn } from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useFormik } from "formik";
import { CrossGreyIcon } from "public/assets/icons/common";
import { useSelector } from "react-redux";
import DropdownMenu from "../Dropdown";
import CommonChip from "../chip";
import { dateTimeMenuData, priorityMenuData } from "./AddTask";
import CustomButton from "../custom_button";
import InputField from "../InputField";
import DeleteClient from "../client/DeleteClient";

function formatDate(dateString) {
  // Define possible input formats, including the new format
  const inputFormats = [
    "MM/DD/YYYY h:mm A",
    "DD/MM/YYYY h:mm A",
    "YYYY-MM-DD h:mm",
    "YYYY-MM-DD HH:mm",
    "DD/MM/YYYY HH:mm A",
    "DD/MM/YYYY, HH:mm:ss",
    "DD/MM/YYYY , h:mm A",
    "MM/DD/YYYY , h:mm A",
    "MMM Do, YYYY , h:mm A",
    "DD/MM/YYYY HH:mm",
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
  const formattedDate = moment.utc(date).format("YYYY-MM-DD, h:mm:A");
  return formattedDate;
}

export const TruncateText = ({ text, maxWidth }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);
  return (
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      <Typography
        ref={textRef}
        noWrap
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          // display: "inline-block",
          whiteSpace: "nowrap",
          fontSize: "1.4rem",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

const EditTodoInlineSubTask = ({
  project_id,
  ColumnId,
  setShowInLineAddForm,
  parentId,
  tasktable = false,
  scrollToBottom,
  CallListApi = null,
  tab = 0,
  margin = 48,
  setAllSubtask,
}) => {
  const TodoId = localStorage.getItem("todoColumn");
  const { filtered, filterdata, projectList } = useSelector(
    (store: ProjectRootState) => store?.project
  );
  const is_private = projectList.find(
    (item) => item.id == project_id
  )?.is_private;
  const dispatch = useAppDispatch();
  const getLoginedUser = getUserDetail();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [selectedPriority, setSelectedPriority] =
    useState<string>("Add Priority");
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  // filter for agents
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: getLoginedUser.role_id == 3 ? project_id : getLoginedUser?.id,
    is_user: 1,
    project_id: is_private == 1 ? project_id : 0,
  });
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("Add Assignee ");
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [dateTimeMenu, setDateTimeMenu] = useState<HTMLElement | null>(null);
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("Add Date");
  const [businessDate, setBusinessDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [calculatedDate, setCalculatedDate] = useState("");
  const [labelsMenu, setLabelsMenu] = useState<HTMLElement | null>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [customDate, setCustomDate] = useState(null);
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);
  const [showLabelForm, setShowLabelForm] = useState<boolean>(false);
  const [showReminder, setShowReminder] = useState<HTMLElement | null>(null);
  const [selectedlabel, setSelectedLabel] = useState<string>("Labels");
  const [labelCount, setLabelCount] = useState(0);
  const [labelsMenuData, setLabelsMenuData] = useState([]);
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setCalenderOpen(true);
  };

  const listData = async ({
    task_start = 0,
    columnid = 0,
    loader = false,
    drag = false,
    search = null,
    filter = null,
  }) => {
    const payload: any = {
      start: 0,
      limit: -1,
      search: search,
      project_id: project_id as string,
      task_start: task_start,
      task_limit: 20,
      project_column_id: columnid,
      is_filter: filter != null ? filter : filtered,
      group: {
        key: null,
        order: 0,
      },
      sort: [],
      filter: [],
      is_view: 0,
      is_filter_save: 0,
    };
    try {
      const res = await dispatch(projectColumnList({ payload, loader, drag }));
      // setColumnList(res?.payload?.data?.data?.list);
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const taskLIstData = async ({
    search = null,
    applyopMain = "",
    filter = null,
    sort = [],
    start = 0,
    condition = [],
    loading = true,
  }) => {
    const payload = {
      project_id: project_id,
      start: start,
      limit: 20,
      search: "",
      type: 0,
      is_view: 0,
      is_filter_save: 0,
      // is_filter: filter != null ? filter : filtered,
      sort: [],
      filter: [],
    };
    const taskLists = await dispatch(TaskListColumn({ payload, loading }));
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
    const task = taskLists?.payload?.data?.data?.list;
  };

  const handleDateChange = (newDate) => {
    setCustomDate(newDate);
    const formattedDate = moment(newDate).format("DD/MM/YYYY h:mm:A");
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
        setSelectedAgent("Add Assignee");
      }
    } else {
      // If not selected, add to selection
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const handleDelete = (id: number) => {
    dispatch(DeleteLabel(id)).then((res) => {
      setIsLabelLoading(false);
      // setLabelsMenu(null);
      if (selectedLabels?.length > 0) {
        setSelectedLabels((prevLabels) =>
          prevLabels.filter((label) => label != id)
        );
      } else {
        setSelectedLabels([]);
      }
      fetchLabel({});
      formik.setFieldValue("newLabel", "");
      setShowLabelForm(false);
      setSelectedLabel("Labels");
    });
    setIsLabelLoading(false);
    setIsOpenDeletedModal(false);
  };

  const handleAddLabel = () => {
    setShowLabelForm(true);
  };

  const formik = useFormik({
    initialValues: {
      newLabel: "",
    },

    onSubmit: (values) => { },
  });

  const fetchLabel = async ({ news = false }) => {
    await dispatch(
      getLabelList({ project_id: project_id, start: 0, limit: -1 })
    ).then((res) => {
      setLabelCount(res?.payload?.data?.data?.list?.length);
      setLabelsMenuData(res?.payload?.data?.data?.list);
      const data = res?.payload?.data?.data?.list;
      if (news == true) {
        setSelectedLabels([...selectedLabels, data[data?.length - 1]?.id]);
      }
    });
  };
  useEffect(() => {
    if (project_id) {
      fetchLabel({ news: false });
    }
  }, [project_id]);

  const handleLabelSave = () => {
    if (formik?.values?.newLabel) {
      setIsLoading(true); // Start loader
      const newRes = dispatch(
        AddLabellList({
          project_id: project_id,
          label: formik?.values?.newLabel,
        })
      )
        .then((res) => {
          setIsLoading(false); // Stop loader
          setLabelsMenu(null);
          fetchLabel({ news: true });
          setSelectedLabel(formik?.values?.newLabel);
          formik.setFieldValue("newLabel", "");
          setShowLabelForm(false);
          setAllSubtask();
        })
        .catch(() => {
          setIsLoading(false); // Stop loader on error
        });
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
    const formattedDate = moment(date).format("DD/MM/YYYY h:mm:A");
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
    if (parentId) {
      formData.append("parent_task_id", parentId);
    }
    formData.append("project_id", project_id);
    formData.append(
      "project_column_id",
      filterdata?.key > 0 ? TodoId : ColumnId ? ColumnId : TodoId
    );
    formData.append("title", taskName);
    formData.append("description", description);
    formData.append(
      "due_date_time",
      calculatedDate
        ? calculatedDate
        : selectedDate == "Add Date"
          ? ""
          : selectedDate
    );
    formData.append(
      "priority",
      selectedPriority === "Add Priority" ? "" : selectedPriority
    );
    formData.append("labels", selectedLabels as any);
    formData.append("agent_ids", selectedAgents as any);
    try {
      const res = await dispatch(TaskAdd(formData));
      setAllSubtask((prev) => [...prev, res?.payload?.data?.data]);

      setLoading(false);

      setShowInLineAddForm(false);

      setTimeout(() => {
        if (parentId) {
          setShowInLineAddForm(parentId);
          const timer = setTimeout(() => {
            scrollToBottom();
          }, 200);
          return () => clearTimeout(timer);
        } else {
          setShowInLineAddForm(true);
          const timer = setTimeout(() => {
            scrollToBottom();
          }, 200);
          return () => clearTimeout(timer);
        }
      }, 3);

      setTaskName("");
      setDescription("");
      setSelectedPriority("Add Priority");
      setCalculatedDate("");
      setSelectedAgents([]);
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 500);
      return () => clearTimeout(timer);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.closest(".MuiPopover-root") &&
      // !event.target.closest(".MuiDialog-root") &&
      !event.target.closest(" .MuiPickersLayout-root") // Add this check for clicks inside Popover (dropdown)
    ) {
      setShowInLineAddForm(false); // Close the form when clicking outside
    }
  };

  const handleLabelSelect = (agentId) => {
    if (selectedLabels.includes(agentId)) {
      setSelectedLabels(selectedLabels.filter((id) => id != agentId));
      if (selectedLabels?.length == 1) {
        setSelectedLabel("Labels");
      }
    } else {
      // If not selected, add to selection
      setSelectedLabels([...selectedLabels, agentId]);
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

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  return (
    <div
      className={`flex justify-between flex-col border-1 border-[#C3C4C5] pr-10 rounded-6  ${parentId ? `ml-${margin}` : "pl-0"}`} //w-[82%]
      ref={dropdownRef}
    >
      <form
        className="flex relative justify-between flex-col  "
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          name="title"
          placeholder={parentId ? "Subtask Name..." : "Task Name..."}
          variant="outlined"
          value={taskName}
          size="small"
          autoFocus={true}
          onChange={(e) => setTaskName(e.target.value)}
          className="basis-2/3"
          InputProps={{
            style: {
              backgroundColor: "transparent",
              border: "none",
              // paddingLeft: parentId ? 30 : 0,
            },
            sx: {
              "&:focus": {
                outline: "none",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#757982",
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
              "& .MuiInputBase-input": {
                // color: "#757982",
                paddingBottom: 0,
              },
            },
          }}
        />

        <TextField
          name="title"
          placeholder={"Description"}
          variant="outlined"
          value={description}
          size="small"
          onChange={(e) => setDescription(e.target.value)}
          className="basis-2/3"
          InputProps={{
            style: {
              backgroundColor: "transparent",
              border: "none",
              // paddingLeft: parentId ? 30 : 0,
              paddingTop: 0,
              // color: "#757982",
            },
            sx: {
              "&:focus": {
                outline: "none",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#757982",
                opacity: 1,
              },
              "& .MuiInputBase-input": {
                // color: "#757982",
                paddingTop: 0,
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

        <div
          style={{
            display: "flex",
            // flex: "40%",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            // paddingLeft: parentId ? 48 : 0,
          }}
          className="max-w-[650px] sm:max-w-full overflow-y-auto"
        >
          <div className="flex gap-10 mb-10 px-2">
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
                  className={` flex !flex-row !justify-start gap-8 !text-14 !items-center !pl-1  !pr-5 !bg-transparent hover:!bg-[#E0E0E0] ${dateTimeMenu
                    ? "border-1 border-solid border-[#9DA0A6] "
                    : ""
                    }`}
                  icon={
                    <FuseSvgIcon size={16}>
                      material-outline:calendar_today
                    </FuseSvgIcon>
                  }
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
                    const futureDate = calculateFutureDate(
                      item.days,
                      item.label
                    );
                    setCalculatedDate(futureDate.toLocaleString()); // Store the calculated date
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
                    <FuseSvgIcon>
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
              anchorEl={priorityMenu}
              handleClose={() => setPriorityMenu(null)}
              button={
                <CommonChip
                  onClick={(event) => setPriorityMenu(event.currentTarget)}
                  label={selectedPriority}
                  className={` flex !flex-row !justify-start gap-8 !text-14 !items-center !pl-1 
                     !pr-5 hover:!bg-[#E0E0E0]  !bg-transparent${priorityMenu
                      ? "border-1 border-solid border-[#9DA0A6] "
                      : ""
                    }`}
                  icon={<PriorityIcon height={16} width={16} />}
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
                <StyledMenuItem
                  onClick={() => handlePriorityMenuClick(item.label)}
                >
                  {item.label}
                </StyledMenuItem>
              ))}
              <Typography className="border-t-1 border-color-[#3333]">
                <StyledMenuItem onClick={() => setSelectedPriority("Priority")}>
                  Clear
                </StyledMenuItem>
              </Typography>
            </DropdownMenu>

            <DropdownMenu
              anchorEl={labelsMenu}
              handleClose={() => setLabelsMenu(null)}
              button={
                <CommonChip
                  onClick={(event) => setLabelsMenu(event.currentTarget)}
                  style={{ maxWidth: "150px" }}
                  // label={selectedlabel}

                  className={`flex !flex-row !justify-start gap-8 !text-14 !items-center !pl-1  !pr-5 hover:!bg-[#E0E0E0]  !bg-transparent${labelsMenu ? "border-1 border-solid border-[#9DA0A6] " : ""
                    }`}
                  // label={<TruncateText text={selectedlabel} maxWidth={170} />}
                  label={
                    <TruncateText
                      text={
                        selectedLabels?.length > 0
                          ? selectedLabels
                            ?.map(
                              (agentId) =>
                                labelsMenuData?.find(
                                  (item) => item.id === agentId
                                )?.label
                            )
                            .join(", ")
                          : "Label"
                      }
                      maxWidth={170}
                    />
                  }
                  icon={
                    <FuseSvgIcon size={16}>heroicons-outline:tag</FuseSvgIcon>
                  }
                />
              }
              popoverProps={{
                open: !!labelsMenu,
                classes: {
                  paper: "pt-10 pb-20",
                },
              }}
            >
              {!showLabelForm ? (
                <div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {labelsMenuData?.map((item, index) => (
                      <div
                        className="flex items-center gap-10 px-20 w-full"
                        key={item.id}
                      >
                        <label className="flex items-center gap-10 w-full cursor-pointer">
                          <Checkbox
                            className="d-none hover:!bg-transparent"
                            checked={// index + 1 > labelCount ||
                              selectedLabels?.includes(item.id)}
                            onChange={() => handleLabelSelect(item.id)}
                          />
                          <span>{item?.label}</span>
                        </label>
                        <div>
                          <CrossGreyIcon
                            onClick={() => {
                              setIsOpenDeletedModal(true),
                                setIsLabelList(item.id);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-20">
                    <CustomButton
                      fullWidth
                      variant="contained"
                      color="secondary"
                      startIcon={
                        <FuseSvgIcon>
                          material-outline:add_circle_outline
                        </FuseSvgIcon>
                      }
                      className="min-w-[224px] mt-10 "
                      onClick={handleAddLabel}
                    >
                      Create New Label
                    </CustomButton>
                  </div>
                </div>
              ) : (
                <div className="px-20  py-20">
                  <InputField
                    formik={formik}
                    name="newLabel"
                    id="group_names"
                    label="New Label"
                    placeholder="Enter New Label"
                  />
                  <div className="mt-20">
                    <Button
                      variant="contained"
                      color="secondary"
                      className="sm:w-[156px] h-[48px] text-[16px] font-400"
                      disabled={
                        formik?.values?.newLabel.trim() == "" || isloading
                      }
                      onClick={() => handleLabelSave()}
                    >
                      {isloading ? <ListLoading /> : "Save"}
                    </Button>
                    <Button
                      variant="outlined"
                      // disabled={disabled}
                      color="secondary"
                      className="sm:w-[156px] h-[48px] text-[16px] font-400 ml-14"
                      onClick={() => {
                        setLabelsMenu(null);
                        formik.setFieldValue("newLabel", "");
                        setShowLabelForm(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
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
                  className=" w-full flex !flex-row !justify-start !text-14 !items-center  !pl-1 
                   !pr-5 !bg-transparent hover:!bg-[#E0E0E0]  overflow-hidden max-w-[150px]"
                  sx={{
                    "& .MuiButtonBase-root-MuiChip-root": {
                      background: transparent,
                    },
                    "& .MuiChip-label": {
                      display: "inline-block",
                      maxWidth: 120,
                      overflowX: "hidden",
                      // paddingLeft: "4px",
                      // paddingRight: "4px",
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
                <p className="text-title font-600 text-[1.6rem]">
                  Assignee Name
                </p>
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
                        <label className="flex items-center gap-10 w-full cursor-pointer">
                          <Checkbox
                            className="d-none  hover:!bg-transparent"
                            checked={selectedAgents?.includes(item.agent_id)}
                            onChange={() => handleAgentSelect(item.agent_id)}
                          />
                          <div className="h-[35px] w-[35px] rounded-full">
                            {item.user_image ? (
                              <img
                                src={urlForImage + item.user_image}
                                alt=""
                                className="h-[35px] w-[35px] rounded-full"
                              />
                            ) : (
                              <img
                                src="../assets/images/logo/images.jpeg"
                                alt=""
                              />
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
          </div>

          <div className="flex gap-10">
            <Button
              variant="contained"
              color="secondary"
              className="h-[30px] text-[14px] flex gap-8 w-[40px]"
              size="small"
              sx={{
                bgcolor: "#EDEDFC",
                color: "#4F46E5",
                ":hover": {
                  bgcolor: "#F5F5F5",
                  color: "#4F46E5",
                },
              }}
              onClick={() => {
                setShowInLineAddForm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="h-[30px] text-[14px] flex gap-8 w-[40px] bg-secondary text-[#ffffff]"
              size="small"
              disabled={taskName.trim() == ""}
              sx={{
                bgcolor: "#EDEDFC",
                color: "#4F46E5",
                ":hover": {
                  bgcolor: "#EDEDFC",
                  color: "#4F46E5",
                },
              }}
            >
              {/* {loading ? (
                <Box
                  marginTop={0}
                  id="spinner"
                  sx={{
                    "& > div": {
                      backgroundColor: "palette.secondary.main",
                    },
                  }}
                >
                  <div className="bounce1 mt-[-40px] !bg-[#4f46e5]" />
                  <div className="bounce2 mt-[-40px] !bg-[#4f46e5]" />
                  <div className="bounce3 mt-[-40px] !bg-[#4f46e5]" />
                </Box>
              ) : (
                "Save"
              )} */}
              Save
            </Button>
          </div>
        </div>
      </form>
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => {
          handleDelete(isLabelList);
        }}
        heading={`Delete Label`}
        description={`Are you sure you want to delete this Label? `}
        isLoading={isLabelLoading}
      />
    </div>
  );
};

export default EditTodoInlineSubTask;
