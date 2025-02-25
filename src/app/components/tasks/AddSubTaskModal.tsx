import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  Checkbox,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  AddLabellList,
  DeleteLabel,
  getLabelList,
  getStatusList,
} from "app/store/Agent";
import { GetAssignAgentsInfo } from "app/store/Client";
import {
  EditTaskAdd,
  projectColumnList,
  SubTaskDetails,
  TaskAdd,
  TaskDetails,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import moment from "moment";
import { CrossGreyIcon } from "public/assets/icons/common";
import {
  AssignIconNew,
  PriorityIcon,
  ReminderIcon,
  StatusIcon,
} from "public/assets/icons/task-icons";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Role, getUserDetail } from "src/utils";
import * as Yup from "yup";
import CommonModal from "../CommonModal";
import DropdownMenu from "../Dropdown";
import InputField from "../InputField";
import CommonChip from "../chip";
import DeleteClient from "../client/DeleteClient";
import CustomButton from "../custom_button";
import TimePicker from "./CustomTime";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  ColumnId?: any;
  project_id?: any;
  callListApi?: any;
  Edit?: any;
  fetchSubTaskList?: any;
  selectedStatusIds?: any;
  task_Id?: number;
}
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "8px 20px",
  minWidth: "250px",
}));

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
          fontSize: "1.6rem",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

function AddSubTaskModal({
  isOpen,
  setIsOpen,
  ColumnId,
  project_id,
  callListApi,
  Edit,
  fetchSubTaskList,
  selectedStatusIds,
  task_Id,
}: IProps) {
  const [expandedImage, setExpandedImage] = useState(null);
  const [dateTimeMenu, setDateTimeMenu] = useState<HTMLElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("Due Date & Time");
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [showReminder, setShowReminder] = useState<HTMLElement | null>(null);
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>("Priority");
  const [selectedAgent, setSelectedAgent] = useState<string>("Assigned To");
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const [statusMenu, setStatusMenu] = useState<HTMLElement | null>(null);
  const [labelsMenu, setLabelsMenu] = useState<HTMLElement | null>(null);
  const [selectedlabel, setSelectedlabel] = useState<string>("Labels");
  const [showLabelForm, setShowLabelForm] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("Status");
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [timerId, setTimerId] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const [customDate, setCustomDate] = useState(null);
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [agentid, setAgentID] = useState(null);
  const [dateError, setDateError] = useState("");
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const [audioRecorder, setAudioRecorder] = useState<File | null>(null);
  const [screenRecorder, setScreenRecorder] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string>("Labels");
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);
  const timerRef = useRef(null);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userId = getUserDetail();
  const [disable, setDisable] = useState(false);
  const [screenSharingStream, setScreenSharingStream] = useState(null);
  const [statusMenuData, setStatusMenuData] = useState([]);
  const [labelsMenuData, setLabelsMenuData] = useState([]);
  const [deleteid, setDeleteId] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState("0");
  const [TimeError, setTimeError] = useState("");
  const [initialRender, setInitialRender] = useState(false);
  const { fetchSubTask, projectList } = useSelector(
    (store: ProjectRootState) => store?.project
  );
  const is_private = projectList.find(
    (item) => item.id == project_id
  )?.is_private;
  const { projectId, taskId } = useParams();
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: userId.role_id == 3 ? project_id : userId.id,
    is_user: 1,
    project_id: is_private == 1 ? project_id : 0,
  });
  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required.")
      .matches(/^(?!\s*$).+/, "Please enter the title."),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      time: "",
      date: "",
      newLabel: "",
    },
    validationSchema,
    onSubmit: (values) => { },
  });
  const removeInitialSpace = (value: string) => {
    const val = value.replace(/^\s+/g, "");
    formik.setFieldValue("description", val);
  };
  const dateTimeMenuData = [
    { label: "In 1 business day", days: 1 },
    { label: "In 2 business days", days: 2 },
    { label: "In 3 business days", days: 3 },
    { label: "In 1 week", days: 7 },
    { label: "In 2 week", days: 14 },
    { label: "In 1 month", days: 30 },
    { label: "In 3 months", days: 90 },
    { label: "In 6 months", days: 180 },
  ];
  const priorityMenuData = [
    { label: "Medium" },
    { label: "High" },
    { label: "Low" },
  ];

  const handleAddLabel = () => {
    setShowLabelForm(true);
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
        setAgentMenuData(res?.payload?.data?.data?.list);
      });
    }
  }, [filterMenu.search]);
  useEffect(() => {
    if (project_id) {
      dispatch(getStatusList({ id: project_id })).then((res) => {
        setStatusMenuData(res?.payload?.data?.data?.list);
      });
    }
  }, [project_id, isOpen]);

  const fetchLabel = async () => {
    await dispatch(
      getLabelList({ project_id: project_id, start: 0, limit: 10 })
    ).then((res) => {
      setLabelsMenuData(res?.payload?.data?.data?.list);
    });
  };

  useEffect(() => {
    if (project_id) {
      fetchLabel();
    }
  }, [project_id, isOpen]);

  useEffect(() => {
    if (labelsMenu) {
      setShowLabelForm(false);
    }
  }, [labelsMenu]);

  const handleStatusMenuClick = (event) => {
    setStatusMenu(event.currentTarget);
  };

  const handleStatusMenuItemClick = (status) => {
    setSelectedStatus(status.name);
    setSelectedStatusId(status.id);
    setStatusMenu(null); // Close the dropdown menu after selection
  };

  const handlePriorityMenuClick = (data) => {
    setSelectedPriority(data);
    setPriorityMenu(null); // Close the dropdown priority menu after selection
  };

  const handleAgentMenuClick = (item) => {
    const agentId = item.id;
    if (selectedAgents?.includes(agentId)) {
      setSelectedAgents(selectedAgents?.filter((id) => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  useEffect(() => {
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, [timerId]);

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsOpen(false);
    formik.resetForm();
    setSelectedAgent("Assigned To");
    setSelectedStatus("Status");
    setSelectedStatusId("0");
    setSelectedPriority("Priority");
    setSelectedlabel("Labels");
    setCalculatedDate("");
    setAgentID(null);
    setCustomDate(null);
    setSelectedAgents([]);
    setDeleteId([]);
  };

  const listData = async ({
    task_start = 0,
    columnid = 0,
    loader = false,
    drag = true,
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
      is_filter: 0,
      is_view: 0,
      is_filter_save: 0,
      group: {
        key: null,
        order: 0,
      },
      sort: [],
      filter: [],
    };
    try {
      const res = await dispatch(projectColumnList({ payload, loader, drag }));
      // setColumnList(res?.payload?.data?.data?.list);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function formatDate(dateString) {
    // Define possible input formats
    const inputFormats = [
      "YYYY-MM-DD h:mm",
      "YYYY-MM-DD h:mm A",
      "MM/DD/YYYY h:mm A",
      "DD/MM/YYYY h:mm A",
      "DD/MM/YYYY, HH:mm:ss",
      "MM/DD/YYYY , h:mm A",
      "DD/MM/YYYY h:mm A",
      "MMM Do, YYYY , h:mm A",
      "DD/MM/YYYY HH:mm A",
      "DD/MM/YYYY HH:mm",
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
      console.error(
        "Invalid date format. Please ensure the date string matches one of the expected formats."
      );
      return moment
        .utc(dateString, "DD/MM/YYYY h:mm A")
        .format("DD/MM/YYYY h:mm A");
    }

    // Format the date to the desired output format
    const formattedDate = moment.utc(date).format("DD/MM/YYYY, h:mm A");

    return formattedDate;
  }

  const onSubmit = async () => {
    formik.handleSubmit();

    if (Object.keys(formik.errors).length > 0 || formik?.values?.title == "") {
      // If there are validation errors, do not proceed further
      return;
    }
    // Check if formik has any validation errors
    // If there are validation errors, do not proceed further
    setDisable(true);
    const formData = new FormData();

    formData.append("parent_task_id", taskId);
    formData.append("project_id", project_id);
    formData.append("project_column_id", ColumnId || selectedStatusIds);
    formData.append("title", formik.values.title);
    formData.append("description", formik.values.description);
    formData.append(
      "priority",
      selectedPriority == "Priority" ? "" : selectedPriority
    );
    formData.append("labels", selectedLabels as any);
    // formData.append("status", ColumnId);
    formData.append("status", selectedStatusId || "0");
    formData.append("agent_ids", selectedAgents as any);
    formData.append("voice_record_file", audioRecorder || "");
    formData.append("screen_record_file", screenRecorder);
    formData.append(
      "due_date_time",
      calculatedDate
        ? formatDate(calculatedDate)
        : selectedDate == "Due Date & Time"
          ? ""
          : formatDate(selectedDate)
    );
    const formattedDateREminder = selectedDate.replace(" ", ", ");
    formData.append("business_due_date", formattedDateREminder);
    const getOnlyDate = moment(formik?.values?.date).format("YYYY-MM-DD");
    formData.append(
      "reminders",
      formik?.values?.date != "" && selectedTime != ""
        ? moment(getOnlyDate + " " + selectedTime).format("DD/MM/YYYY, h:mm A")
        : ""
      // moment(formik?.values?.date + " " + formik?.values?.time).format(
      //   "YYYY-MM-DD HH:mm"
      // )
    );
    // Append each file with the same key

    try {
      const res = await dispatch(TaskAdd(formData));

      fetchSubTaskList();
      setIsOpen(false);
      setDisable(false);

      formik.resetForm();
      handleReset();
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setCalenderOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCalenderOpen(false);
  };

  // const calculateFutureDate = (days, label) => {
  //   let date = new Date();
  //   let addedDays = 0;

  //   while (addedDays < days) {
  //     date.setDate(date.getDate() + 1);
  //     if (label.includes("business")) {
  //       const dayOfWeek = date.getDay();
  //       if (dayOfWeek !== 0 && dayOfWeek !== 6) {
  //         addedDays++;
  //       }
  //     } else {
  //       addedDays++;
  //     }
  //   }
  //   setSelectedDate(moment.utc(date).format("DD/MM/YYYY ,  HH:mm:ss"));
  //   return moment(date).format("YYYY-MM-DD HH:mm");
  // };

  const calculateFutureDate = (days, label) => {
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

    // Format the date to DD/MM/YYYY HH:mm
    const formattedDate = moment(date).format("DD/MM/YYYY h:mm A");
    setSelectedDate(formattedDate);
    return formattedDate;
  };

  const handleDateChange = (newDate) => {
    setCustomDate(newDate);

    const formattedDate = moment(newDate).format("DD/MM/YYYY h:mm A");

    // Set the formatted date to the state variables
    setSelectedDate(formattedDate);
    setCalculatedDate(formattedDate);
  };

  const open = Boolean(anchorEl);
  const today = new Date();

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

  const EditDetails = () => {
    dispatch(SubTaskDetails(ColumnId)).then((res: any) => {
      const data = res?.payload?.data?.data;
      let date: any;
      let time: any;
      if (data?.reminders) {
        time = moment.utc(data?.reminders).format("h:mm:ss A");
        date = new Date(data?.reminders); // Extract the date component
      } else {
        // Set default empty values if no reminder exists
        time = ""; // No reminder time
        date = ""; // No reminder date
      }

      formik.setFieldValue("title", data.title);
      formik.setFieldValue("description", data.description);
      formik.setFieldValue("date", date);
      formik.setFieldValue("time", time);
      setSelectedTime(time || "");
      setSelectedDate(
        !data?.due_date_time
          ? "Due Date & Time"
          : moment.utc(data?.due_date_time).format("DD/MM/yyyy , hh:mm:ss")
      );
      setCalculatedDate(
        !data?.due_date_time
          ? ""
          : moment.utc(data?.due_date_time).format("DD/MM/yyyy , hh:mm:ss")
      );
      const labelName = data?.task_selected_labels?.map((user) => user.label);
      const LabelId = data?.task_selected_labels?.map((user) => user.label_id);
      setSelectedLabel(labelName.join(", "));
      if (data?.task_selected_labels?.length == 0) {
        setSelectedAgent("labels");
      }
      setSelectedLabels(LabelId);
      setSelectedPriority(
        data?.priority == ""
          ? "Priority"
          : !data?.priority
            ? ""
            : data?.priority
      );
      setSelectedStatusId(!data?.status ? "Status" : data?.status);
      const userNames = data?.assigned_task_users?.map(
        (user) => user.first_name
      );
      const userId = data?.assigned_task_users?.map((user) => user.user_id);
      setSelectedAgent(userNames.join(", "));
      if (data?.assigned_task_users?.length == 0) {
        setSelectedAgent("Assign To");
      }

      setSelectedAgents(userId);
    });
  };

  useEffect(() => {
    if (Edit) {
      EditDetails();
    }
  }, [isOpen]);

  const onSubmitEdit = async () => {
    formik.handleSubmit();

    if (formik?.values?.title.trim() == "") {
      // If there are validation errors, do not proceed further
      return;
    }
    setDisable(true);
    const formData = new FormData();
    formData.append("task_id", ColumnId);
    formData.append("title", formik.values.title);
    formData.append("description", formik.values.description);
    formData.append(
      "priority",
      selectedPriority == "Priority" ? "" : selectedPriority
    );
    formData.append("labels", selectedLabels as any);
    formData.append("status", selectedStatusId || selectedStatusIds);
    formData.append("agent_ids", selectedAgents as any);
    formData.append("voice_record_file", "");
    formData.append("screen_record_file", "");
    formData.append(
      "due_date_time",
      calculatedDate
        ? formatDate(calculatedDate)
        : selectedDate == "Due Date & Time"
          ? ""
          : formatDate(selectedDate)
    );
    const formattedDateREminder = selectedDate.replace(" ", ", ");
    formData.append("business_due_date", formattedDateREminder);
    formData.append("delete_agent_ids", "");
    formData.append("delete_file_ids", deleteid as any);
    const getOnlyDate = moment(formik?.values?.date).format("YYYY-MM-DD");
    formData.append(
      "reminders",
      formik?.values?.date != "" && selectedTime != ""
        ? moment(getOnlyDate + " " + selectedTime).format("DD/MM/YYYY, h:mm A")
        : formik?.values?.date != ""
          ? moment(getOnlyDate).format("DD/MM/YYYY, h:mm A")
          : ""
    );

    try {
      const res = await dispatch(EditTaskAdd(formData));
      if (callListApi) {
        callListApi({ drag: false, loading: false });
      } else {
        dispatch(TaskDetails(taskId));

        listData({ drag: false });
      }

      fetchSubTaskList();
      setDisable(false);
      setIsOpen(false);
      formik.resetForm();
      handleReset();
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
      setIsOpen(false);
    }
  };

  const handleAgentSelect = (agentId) => {
    setSelectedAgents((prevSelectedAgents) => {
      if (prevSelectedAgents.includes(agentId)) {
        // Remove agent if already selected
        const updatedAgents = prevSelectedAgents.filter((id) => id !== agentId);

        // Check if the selection becomes empty after removal
        if (updatedAgents.length === 0) {
          setSelectedAgent("Assign To");
        }

        return updatedAgents;
      } else {
        // If not selected, add the agent to the list
        return [...prevSelectedAgents, agentId];
      }
    });
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

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(id)) {
        return prevCheckedItems.filter((item) => item !== id);
      } else {
        return [...prevCheckedItems, id];
      }
    });
  };

  const handleSelectAllAgents = () => {
    if (selectedAgents?.length == agentMenuData?.length) {
      // If all agents are already selected, deselect all
      setSelectedAgents([]);
    } else {
      // Otherwise, select all agents
      setSelectedAgents(agentMenuData?.map((item) => item.id));
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleLabelSave = () => {
    if (formik?.values?.newLabel) {
      dispatch(
        AddLabellList({
          project_id: project_id,
          label: formik?.values?.newLabel,
        })
      ).then((res) => {
        setLabelsMenu(null);
        fetchLabel();
        setSelectedlabel(formik?.values?.newLabel);
        formik.setFieldValue("newLabel", "");
        setShowLabelForm(false);
      });
    }
  };

  useEffect(() => {
    if (!Edit) {
      setSelectedStatusId(selectedStatusIds);
    }
  }, []);

  const showReminderLabel = (newdate: string | Date, time: string) => {
    let date = moment(newdate).format("DD/MM/YYYY");
    if (date && time) {
      return moment(
        `${moment(newdate).format("YYYY-MM-DD")} ${time}`,
        "YYYY-MM-DD h:mm A"
      ).format("DD/MM/YYYY, h:mm A");
    } else {
      return "Reminder";
    }
  };

  const handleDelete = (id: number) => {
    dispatch(DeleteLabel(id)).then((res) => {
      setIsLabelLoading(false);
      // setLabelsMenu(null);
      fetchLabel();
      formik.setFieldValue("newLabel", "");
      setShowLabelForm(false);
    });
    setIsLabelLoading(false);
    setIsOpenDeletedModal(false);
  };

  return (
    <CommonModal
      open={isOpen}
      disabled={disable}
      handleToggle={() => handleReset()}
      modalTitle={Edit ? "Edit Subtask" : "Add Subtask"}
      maxWidth="910"
      btnTitle={Edit ? "Save Edit" : "Save"}
      closeTitle="Close"
      onSubmit={Edit ? onSubmitEdit : onSubmit}
    >
      {fetchSubTask == "loading" && Edit ? (
        <div className="h-[50vh]">
          <ListLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-20">
          <InputField
            formik={formik}
            name="title"
            label="Title"
            placeholder="Enter Title"
          />
          <InputField
            formik={formik}
            name="description"
            label="Description"
            placeholder="Enter Description"
            onChange={(e) => removeInitialSpace(e.target.value)}
            multiline
            rows={4}
          />

          <div className="flex gap-10  flex-wrap ">
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
                <div
                  className={`relative
      `}
                  onClick={(event) => setAgentMenu(event.currentTarget)}
                >
                  <CommonChip
                    onClick={(event) => setAgentMenu(event.currentTarget)}
                    style={{ maxWidth: "200px", paddingRight: "27px" }}
                    className={`${AgentMenu ? "border-1 border-solid border-[#9DA0A6] " : ""
                      }`}
                    label={
                      selectedAgents?.length > 0
                        ? selectedAgents
                          ?.map(
                            (agentId) =>
                              agentMenuData?.find(
                                (item) => item.agent_id === agentId
                              )?.first_name
                          )
                          .join(", ")
                        : "Assigned To"
                    }
                  // icon={<AssignIcon />}
                  />
                  <div className="absolute top-[13px] right-3">
                    <AssignIconNew />
                  </div>
                </div>
              }
              popoverProps={{
                open: !!AgentMenu,
                classes: {
                  paper: "pt-10 pb-20",
                },
              }}
            >
              <div className="w-[375px] p-20">
                <p className="text-title font-600 text-[1.6rem]">
                  Assignee Name
                </p>

                <div className="relative w-full mt-10 mb-3 sm:mb-0 ">
                  <InputField
                    name={"agent"}
                    placeholder={"Search Assignee"}
                    className="common-inputField "
                    inputProps={{
                      className: "ps-[2rem] w-full sm:w-full",
                    }}
                    onChange={handleSearchChange}
                  />
                  <div className="max-h-[200px] w-full overflow-y-auto shadow-sm cursor-pointer">
                    {/* <div
                    className="flex items-center gap-10 px-20 w-full"
                    onClick={handleSelectAllAgents}
                  >
                    <Checkbox
                      checked={selectedAgents?.length === agentMenuData?.length}
                      onChange={handleSelectAllAgents}
                    />
                    <span>Select All</span>
                  </div> */}
                    {agentMenuData?.map((item: any) => (
                      <div
                        className="flex items-center gap-10 px-20 w-full"
                        key={item.id}
                        onClick={() => handleAgentSelect(item.agent_id)}
                      >
                        <label
                          className="flex items-center gap-10 w-full cursor-pointer my-5"
                          onClick={() => handleAgentSelect(item.agent_id)}
                        >
                          <Checkbox
                            className="d-none  hover:!bg-transparent"
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
                  className={`${dateTimeMenu
                    ? "border-1 border-solid border-[#9DA0A6] "
                    : ""
                    }`}
                  icon={
                    <FuseSvgIcon size={20}>
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
                  color="secondary"
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
                    onChange={handleDateChange}
                  />
                </Popover>
              </div>
              {selectedDate != "Due Date & Time" && (
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
                      setSelectedDate("Due Date & Time");
                      setCalculatedDate(null);
                      setShowLabelForm(false);
                      setShowReminder(null);
                      setDateTimeMenu(null);
                      setCalenderOpen(false);
                      formik.setFieldValue("time", "");
                      formik.setFieldValue("date", "");
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
                  label={selectedPriority || "Priority"}
                  className={`${priorityMenu
                    ? "border-1 border-solid border-[#9DA0A6] "
                    : ""
                    }`}
                  icon={<PriorityIcon />}
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
                  style={{ maxWidth: "200px" }}
                  // label={selectedlabel}
                  className={`${labelsMenu ? "border-1 border-solid border-[#9DA0A6] " : ""
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
                    <FuseSvgIcon size={20}>heroicons-outline:tag</FuseSvgIcon>
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
                <>
                  {labelsMenuData?.map((item) => (
                    // <StyledMenuItem
                    //   onClick={() => {
                    //     setSelectedlabel(item.label), setLabelsMenu(null);
                    //   }}
                    // >
                    //   {item.label}
                    // </StyledMenuItem>
                    <div
                      className="flex items-center gap-10 px-20 w-full"
                      key={item.id}
                      onChange={() => handleLabelSelect(item.id)}
                    >
                      <label className="flex items-center gap-10 w-full cursor-pointer">
                        <Checkbox
                          className="d-none hover:!bg-transparent"
                          checked={selectedLabels?.includes(item.id)}
                          onChange={() => handleLabelSelect(item.id)}
                        />
                        <span>{item?.label}</span>
                      </label>
                      <CrossGreyIcon
                        onClick={() => {
                          setIsOpenDeletedModal(true), setIsLabelList(item.id);
                        }}
                      />
                    </div>
                  ))}
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
                      className="min-w-[224px] mt-10"
                      onClick={handleAddLabel}
                    >
                      Create New Label
                    </CustomButton>
                  </div>
                </>
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
                      disabled={formik?.values?.newLabel.trim() == ""}
                      onClick={() => handleLabelSave()}
                    >
                      Save
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
          </div>
          <div className="flex gap-20">
            {/* <DropdownMenu
              anchorEl={showReminder}
              handleClose={() => setShowReminder(null)}
              button={
                <CommonChip
                  onClick={(event) => setShowReminder(event.currentTarget)}
                  // label="Reminder"
                  label={`${formik?.values?.date != "" && formik?.values?.time != ""
                    ? moment(
                      formik?.values?.date + " " + formik?.values?.time
                    ).format("MM/DD/YYYY , HH:mm")
                    : "Reminder"
                    }`}
                  icon={<ReminderIcon />}
                  className={`${showReminder
                    ? "border-1 border-solid border-[#9DA0A6] "
                    : ""
                    }`}
                />
              }
              popoverProps={{
                open: !!showReminder,
                classes: {
                  paper: "pt-10 pb-20",
                },
              }}
            >
              <div className="px-20  py-20">
                <InputField
                  formik={formik}
                  name="date"
                  id="date"
                  label="Date"
                  placeholder="Enter Date"
                  type="date"
                  min={new Date()}
                />

                <InputField
                  formik={formik}
                  name="time"
                  id="time"
                  label="Time"
                  type="time"
                  placeholder="Enter Time"
                />
                <div className="mt-20 flex">
                  <Button
                    variant="contained"
                    color="secondary"
                    className="w-[156px] h-[48px] text-[18px]"

                    // onClick={onSubmit}
                    onClick={() => setShowReminder(null)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    // disabled={disabled}
                    color="secondary"
                    className="w-[156px] h-[48px] text-[18px] ml-14"
                    onClick={() => {
                      setShowLabelForm(false);
                      setShowReminder(null);
                      formik.setFieldValue("time", "");
                      formik.setFieldValue("date", "");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DropdownMenu> */}
            {/* <CommonChip label="Reminder" icon={<ReminderIcon />} /> */}

            <DropdownMenu
              anchorEl={showReminder}
              handleClose={() => setShowReminder(null)}
              button={
                <CommonChip
                  onClick={(event) => setShowReminder(event.currentTarget)}
                  label={showReminderLabel(formik.values?.date, selectedTime)}
                  // label={`${
                  //   formik?.values?.date != "" &&
                  //   (!selectedTime || selectedTime != "")
                  //     ? moment(
                  //         formik?.values?.date + " " + selectedTime
                  //       ).format("MM/DD/YYYY , HH:mm")
                  //     : "Reminder"
                  // }`}
                  icon={<ReminderIcon />}
                  className={`${showReminder
                    ? "border-1 border-solid border-[#9DA0A6] "
                    : ""
                    }`}
                />
              }
              popoverProps={{
                open: !!showReminder,
                classes: {
                  paper: "pt-10 pb-20",
                },
              }}
            >
              <div className="px-20  py-20">
                {/* <InputField
                  formik={formik}
                  name="date"
                  id="date"
                  label="Date"
                  placeholder="Enter Date"
                  type="date"
                  min={new Date()}
                  value={formik?.values?.date}
                  max={selectedDate}
                /> */}
                <DatePicker
                  name="date"
                  label="Date"
                  disablePast
                  value={formik.values.date}
                  onChange={(date) => {
                    formik.setFieldValue("date", date);
                    setCustomDate(null);
                  }}
                  shouldDisableDate={(date) => {
                    // Only disable dates if customDate is defined
                    return customDate ? date > customDate : false;
                  }}
                  sx={{
                    width: "326px",
                    background: "#F6F6F6",
                    borderRadius: "10px",

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },

                    "& .MuiInputLabel-root": {
                      display: "none !important",
                    },
                  }}
                />
                {/* <span className=" text-red pt-[9px]  block">{TimeError}</span> */}
                <TimePicker
                  onTimeChange={handleTimeChange}
                  selectedTime={selectedTime}
                  selectedDate={moment(formik.values.date).format("DD/MM/YYYY")}
                  lastDate={selectedDate}
                />
                {/* <span className=" text-red pt-[9px]  block">{TimeError}</span> */}
                {/* <InputField
                  formik={formik}
                  name="time"
                  id="time"
                  label="Time"
                  type="time"
                  placeholder="Enter Time"
                /> */}

                <div className="mt-20">
                  <Button
                    variant="contained"
                    color="secondary"
                    className=" sm:w-[156px] h-[48px] text-[18px]"
                    disabled={!formik.values.date || !selectedTime}
                    // onClick={onSubmit}
                    onClick={() => setShowReminder(null)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    // disabled={disabled}s
                    color="secondary"
                    className=" sm:w-[156px] h-[48px] text-[18px] ml-14"
                    onClick={() => {
                      setShowLabelForm(false);
                      setShowReminder(null);
                      setTimeError("");
                      formik.setFieldValue("time", "");
                      formik.setFieldValue("date", ""); // Reset the form to its initial state
                      setCustomDate(null);
                      setSelectedTime(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DropdownMenu>

            <DropdownMenu
              anchorEl={statusMenu}
              handleClose={() => setStatusMenu(null)}
              button={
                <CommonChip
                  onClick={handleStatusMenuClick}
                  // label={selectedStatus}
                  className={`${statusMenu ? "border-1 border-solid border-[#9DA0A6] " : ""
                    }`}
                  label={
                    selectedStatusId != "0" && selectedStatusId
                      ? statusMenuData?.find(
                        (item) => item.id == selectedStatusId
                      )?.name
                      : selectedStatus || "Status"
                  }
                  icon={<StatusIcon />}
                />
              }
              popoverProps={{
                open: !!statusMenu,
                classes: {
                  paper: "pt-10 pb-20",
                },
              }}
            >
              {statusMenuData?.map((item) => {
                return (
                  <StyledMenuItem
                    key={item.id}
                    onClick={() => handleStatusMenuItemClick(item)}
                  >
                    {item.name}
                  </StyledMenuItem>
                );
              })}
            </DropdownMenu>
          </div>
        </div>
      )}

      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => {
          handleDelete(isLabelList);
        }}
        heading={`Delete  Label`}
        description={`Are you sure you want to delete this Label? `}
        isLoading={isLabelLoading}
      />
    </CommonModal>
  );
}

export default AddSubTaskModal;
