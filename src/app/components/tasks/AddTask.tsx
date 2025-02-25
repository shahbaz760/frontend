import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Grid,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";

import ListLoading from "@fuse/core/ListLoading";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  AddLabellList,
  DeleteLabel,
  getLabelList,
  getStatusList,
} from "app/store/Agent";
import { GetAssignAgentsInfo } from "app/store/Client";
import {
  EditTaskAdd,
  TaskAdd,
  TaskDetails,
  projectColumnList,
  updateProjectColumnList,
  updateProjectTaskList,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";

import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import { transparent } from "material-ui/styles/colors";
import moment from "moment";
import { CrossGreyIcon, PreviewIcon } from "public/assets/icons/common";
import {
  AttachmentDeleteIcon,
  AttachmentIcon,
} from "public/assets/icons/supportIcons";
import {
  AssignIconNew,
  PriorityIcon,
  ReminderIcon,
  ScreenRecordingIcon,
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
import { Role, getUserDetail } from "src/utils";
import * as Yup from "yup";
import CommonModal from "../CommonModal";
import DropdownMenu from "../Dropdown";
import InputField from "../InputField";
import CommonChip from "../chip";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteClient from "../client/DeleteClient";
import CustomButton from "../custom_button";
import AudioRecorderComponent from "./AudioRecorder";
import TimePicker from "./CustomTime";
import { width } from "@mui/system";
import MicrophonePopup from "../client/MicrophonePopup";
import ActionModal from "../ActionModal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  ColumnId?: any;
  project_id?: any;
  Edit?: any;
  name?: string;
  column_ids?: any;
  upperButton?: boolean;
}
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "8px 20px",
  minWidth: "250px",
}));
export const dateTimeMenuData = [
  { label: "In 1 business day", days: 1 },
  { label: "In 2 business days", days: 2 },
  { label: "In 3 business days", days: 3 },
  { label: "In 1 week", days: 7 },
  { label: "In 2 week", days: 14 },
  { label: "In 1 month", days: 30 },
  { label: "In 3 months", days: 90 },
  { label: "In 6 months", days: 180 },
];
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

export const priorityMenuData = [
  { label: "Medium" },
  { label: "High" },
  { label: "Low" },
];

function AddTaskModal({
  isOpen,
  setIsOpen,
  ColumnId,
  project_id,
  Edit,
  name,
  column_ids,
  upperButton = false,
}: IProps) {
  const {
    fetchStatusNew,
    searchStatus,
    filterdata,
    filtered,
    conditions,
    MainOp,
    sorting,
    projectColumnData,
  } = useSelector((store: ProjectRootState) => store?.project);

  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [dateTimeMenu, setDateTimeMenu] = useState<HTMLElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("Due Date & Time");
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [TimeError, setTimeError] = useState("");
  const [showReminder, setShowReminder] = useState<HTMLElement | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>(
    filterdata?.key == 2 ? (name != "" ? name : "Priority") : "Priority"
  );
  const [selectedAgent, setSelectedAgent] = useState<string>("Assigned To");
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const [statusMenu, setStatusMenu] = useState<HTMLElement | null>(null);
  const [labelsMenu, setLabelsMenu] = useState<HTMLElement | null>(null);
  const [selectedlabel, setSelectedlabel] = useState<string>("Labels");
  const [uploadedFilesNew, setUploadedFilesNew] = useState([]);
  const [showLabelForm, setShowLabelForm] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("Status");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isVideoModal, setIsVideoModal] = useState(false);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedAudioURL, setSavedAudioURL] = useState("");
  const [customDate, setCustomDate] = useState(null);
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [agentid, setAgentID] = useState(null);
  const [calenderOpen, setCalenderOpen] = useState(false);
  const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [selectedAgents, setSelectedAgents] = useState<any[]>(
    filterdata?.key == 1
      ? column_ids != 0
        ? column_ids?.split(",").map((id) => parseInt(id))
        : []
      : []
  );

  const [audioRecorder, setAudioRecorder] = useState<File | null>(null);
  const [screenRecorder, setScreenRecorder] = useState("");
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [initial, setInitial] = useState<boolean>(false);
  const timerRef = useRef(null);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("Labels");
  const [selectedLabels, setSelectedLabels] = useState<any[]>(
    filterdata?.key == 3
      ? column_ids != 0
        ? column_ids?.split(",").map((id) => parseInt(id))
        : []
      : []
  );
  const dispatch = useAppDispatch();
  const userId = getUserDetail();
  const [disable, setDisable] = useState(false);
  const [screenSharingStream, setScreenSharingStream] = useState(null);
  const [statusMenuData, setStatusMenuData] = useState([]);
  const [labelsMenuData, setLabelsMenuData] = useState([]);
  const [labelCount, setLabelCount] = useState(0);
  const [businessDate, setBusinessDate] = useState("");
  const [deleteid, setDeleteId] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState("0");
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);

  const { fetchStatusTask, projectList } = useSelector(
    (store: ProjectRootState) => store?.project
  );
  const is_private = projectList.find(
    (item) => item.id == project_id
  )?.is_private;
  const [selectedTime, setSelectedTime] = useState("");

  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: userId.role_id == 3 ? project_id : userId.id,
    is_user: 1,
    project_id: is_private == 1 ? project_id : 0,
  });

  const [isScreenRecordingModal, setIsScreenRecordingModal] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required.")
      .matches(/^(?!\s*$).+/, "Please enter the title."),
    // description: Yup.string(),
    // Allows for null values initially
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
    formik.setFieldValue("description", val ? val : "");
  };

  const handleAddLabel = () => {
    setShowLabelForm(true);
  };

  const listData = async ({ task_start = 0, loader = true, drag = true }) => {
    const payload: any = {
      start: 0,
      limit: -1,
      search: "",
      project_id: project_id as string,
      task_start: task_start,
      task_limit: 20,
      project_column_id: 0,
      is_filter: 1,
      group: {
        key: filterdata?.key || null,
        order: filterdata?.order,
      },
      sort: [],
      filter: [],
      is_view: 0,
      is_filter_save: 0,
    };
    try {
      const res = await dispatch(projectColumnList({ payload, loader, drag }));
      const updatedList = res?.payload?.data?.data?.list;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setShowVideo(false);
    setIsRecording(false);
    videoRef.current = null;
  }, []);

  useEffect(() => {
    // if (isOpen) {
    dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
      setAgentMenuData(res?.payload?.data?.data?.list);
    });
    // }
  }, [filterMenu.search]);

  useEffect(() => {
    if (project_id) {
      dispatch(getStatusList({ id: project_id })).then((res) => {
        setStatusMenuData(res?.payload?.data?.data?.list);
      });
    }
  }, [project_id, isOpen]);

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
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handleRecordClick = async () => {
    setElapsedTime(0);
    try {
      const permission = await navigator.permissions.query({
        //@ts-ignore
        name: "camera",
      });
      if (permission.state === "denied") {
        setIsVideoModal(true); // Show the popup
        setShowVideo(false);
      } else if (permission.state === "granted") {
        let stream;
        let screenStream;
        let audioStream;
        try {
          // Capture screen with audio if available
          screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true, // Capture screen audio if available
          });

          // Capture microphone audio separately
          audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true, // Capture microphone audio
            video: false,
          });

          // Combine the audio tracks from both streams
          const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...screenStream.getAudioTracks(),
            ...audioStream.getAudioTracks(),
          ]);

          setIsRecording(true);
          const mime = MediaRecorder.isTypeSupported(
            "video/webm; codecs=vp8,opus"
          )
            ? "video/webm; codecs=vp8,opus"
            : "video/webm";

          setScreenSharingStream(combinedStream);

          const recorder = new MediaRecorder(combinedStream, {
            mimeType: mime,
          });
          setMediaRecorder(recorder);
          const chunks = [];
          let timerId;
          recorder.addEventListener("dataavailable", (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          });
          recorder.addEventListener("stop", () => {
            const blob = new Blob(chunks, {
              type: chunks[0].type,
            });
            const url = URL.createObjectURL(blob);
            const file = new File([blob], "recorded_video_with_audio.webm", {
              type: chunks[0].type,
            });
            setScreenRecorder(file as any);
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.removeAttribute("src");
              videoRef.current.srcObject = null;
              videoRef.current.load();
              videoRef.current.src = url;
              videoRef.current.onloadedmetadata = () => {
                videoRef.current.currentTime = 0;
              };
              videoRef.current.oncanplay = () => {
                videoRef.current.pause();
              };
              videoRef.current.addEventListener("timeupdate", () => {
                setElapsedTime(videoRef.current.currentTime);
              });
              videoRef.current.addEventListener("ended", () => {
                clearInterval(timerId);
                setElapsedTime(0);
              });
            }
            setIsRecording(false);
            setShowVideo(true);
            clearInterval(timerId);
            setElapsedTime(0);
          });
          recorder.addEventListener("error", (error) => {
            console.error("MediaRecorder Error:", error);
            clearInterval(timerId);
            setElapsedTime(0);
          });
          screenStream.getTracks().forEach((track) => {
            track.onended = () => {
              try {
                recorder.stop(); // Stop recording
                // Stop video and audio tracks from both screenStream and audioStream
                screenStream.getTracks().forEach((track) => track.stop()); // Stop all screen media (audio/video)
                audioStream.getTracks().forEach((track) => track.stop()); // Stop all audio from the mic
                setIsRecording(false);
                setShowVideo(true);
              } catch (error) {
                console.error("Error stopping recording:", error);
              }
            };
          });
          recorder.start();
          // recorder.start();
          timerId = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
          }, 1000);
          setTimerId(timerId);
        } catch (error) {
          console.error("Error accessing screen:", error);
        }
        setIsVideoModal(false); // Hide the popup
      } else if (permission.state === "prompt") {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setIsVideoModal(false); // Permission granted
        } catch (error) {
          setIsVideoModal(true); // Access denied
          setShowVideo(false);
        }
      }
    } catch (error) {
      console.error("Error checking camera permission:", error);
    }

    // Check if the browser supports screen recording
    const isRecordingSupported = () => {
      return (
        navigator.mediaDevices &&
        navigator.mediaDevices.getDisplayMedia &&
        MediaRecorder &&
        MediaRecorder.isTypeSupported("video/webm; codecs=vp8")
      );
    };

    // Check if the device is mobile
    const isMobileDevice = () => {
      return /Mobi|Android/i.test(navigator.userAgent);
    };

    if (!isRecordingSupported()) {
      alert("Screen recording is not supported on this device.");
      return;
    }

    if (isMobileDevice()) {
      ("Screen recording might not be fully supported on mobile devices.");
    }
  };

  const startScreenRecordingWithMic = async () => {
    let screenStream, audioStream, combinedStream;
    try {
      // Capture screen with audio
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Capture microphone audio
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Combine video and audio tracks
      combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      startRecording(combinedStream, screenStream, audioStream);
    } catch (error) {
      console.error("Error starting screen recording with mic:", error);
    }
  };

  const startScreenRecordingWithoutMic = async () => {
    let screenStream;
    try {
      // Capture screen only
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // Include screen audio if available
      });

      startRecording(screenStream, screenStream, null); // No microphone audio
    } catch (error) {
      console.error("Error starting screen recording without mic:", error);
    }
  };

  const startRecording = (combinedStream, screenStream, audioStream) => {
    setIsRecording(true);

    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp8,opus")
      ? "video/webm; codecs=vp8,opus"
      : "video/webm";

    setScreenSharingStream(combinedStream);

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: mime,
    });
    setMediaRecorder(recorder);

    const chunks: Blob[] = [];
    recorder.addEventListener("dataavailable", (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    });

    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: chunks[0]?.type || "video/webm" });
      const url = URL.createObjectURL(blob);
      const file = new File([blob], "recorded_video_with_audio.webm", {
        type: chunks[0]?.type || "video/webm",
      });

      setScreenRecorder(file as any);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.currentTime = 0;
        };
        videoRef.current.pause();
      }

      setIsRecording(false);
      setShowVideo(true);
      clearInterval(timerId);
      setElapsedTime(0);
    });

    recorder.addEventListener("error", (error) => {
      console.error("MediaRecorder Error:", error);
      clearInterval(timerId);
      setElapsedTime(0);
    });

    screenStream.getTracks().forEach((track) => {
      track.onended = () => {
        try {
          recorder.stop();
          screenStream.getTracks().forEach((track) => track.stop());
          if (audioStream) {
            audioStream.getTracks().forEach((track) => track.stop());
          }
          setIsRecording(false);
          setShowVideo(true);
        } catch (error) {
          console.error("Error stopping recording:", error);
        }
      };
    });

    recorder.start();

    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    setTimerId(id);
  };

  useEffect(() => {
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, [timerId]);

  const toggleRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      try {
        await mediaRecorder.stop(); // Stop recording
        setIsRecording(false);
        setShowVideo(true);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }

    // Add logic to stop screen sharing if applicable
    if (screenSharingStream) {
      // Assuming screenSharingStream is the variable holding your screen sharing stream
      screenSharingStream.getTracks().forEach((track) => track.stop());
      // Update any relevant state variables
      setScreenSharingStream(null);
    }
  };

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleRemoveFile = (file: File) => {
    const filteredFiles = uploadedFiles.filter((f) => f !== file);
    setUploadedFiles(filteredFiles);
  };

  const handleReset = async () => {
    const recordElement = document.getElementById("cancel-voice-memo");
    if (recordElement) {
      recordElement.click();
    }
    setIsOpen(false);
    clearInterval(timerId);
    setTimerId(null);
    videoRef.current = null;
    if (mediaRecorder && mediaRecorder.state === "recording") {
      try {
        await mediaRecorder.stop(); // Stop recording
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }

    // Add logic to stop screen sharing if applicable
    if (screenSharingStream) {
      // Assuming screenSharingStream is the variable holding your screen sharing stream
      screenSharingStream.getTracks().forEach((track) => track.stop());
      // Update any relevant state variables
      setScreenSharingStream(null);
    }
    setIsRecording(false);
    setShowVideo(false);
    setScreenRecorder(null);
    setIsRecording(false);
    setElapsedTime(0);
    formik.resetForm();
    setSavedAudioURL("");
    setSelectedAgent("Assigned To");
    setSelectedStatus("Status");
    setSelectedStatusId("0");
    setSelectedPriority("Priority");
    setSelectedlabel("Labels");
    setCalculatedDate("");
    setSelectedDate("Due Date & Time");
    setAgentID(null);
    setUploadedFiles([]);
    setCustomDate(null);
    setSelectedAgents([]);
    setDeleteId([]);
    setSelectedLabels([]);
  };

  function formatDate(dateString) {
    // Define possible input formats, including the new format
    const inputFormats = [
      "MM/DD/YYYY h:mm A",
      "DD/MM/YYYY h:mm A",
      "YYYY-MM-DD h:mm",
      "DD/MM/YYYY HH:mm A",
      "YYYY-MM-DD h:mm A",
      "MM/DD/YYYY , h:mm A",
      "DD/MM/YYYY, HH:mm:ss",
      "DD/MM/YYYY, HH:mm:ss A",
      "DD/MM/YYYY h:mm A",
      "MMM Do, YYYY , h:mm A",
      "DD/MM/YYYY HH:mm",
      "DD/MM/YYYY h:mm A",
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
      return null;
    }

    // Format the date to the desired output format
    const formattedDate = moment.utc(date).format("DD/MM/YYYY HH:mm");

    return formattedDate;
  }

  const TodoId = localStorage.getItem("todoColumn");

  const onSubmit = async () => {
    formik.handleSubmit();
    if (Object.keys(formik.errors).length > 0 || formik?.values?.title == "") {
      // If there are validation errors, do not proceed further
      return;
    }
    // Check if formik has any validation errors
    // If there are validation errors, do not proceed further
    setDisable(true);
    const screenRecordFile = videoRef?.current?.src || "";
    const formData = new FormData();
    formData.append("project_id", project_id);
    formData.append(
      "project_column_id",
      filterdata?.key > 0 ? TodoId : ColumnId ? ColumnId : TodoId
    );
    formData.append("group_id", ColumnId ? ColumnId : TodoId);
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
    formData.append("voice_record_file", audioBlob || "");
    formData.append("screen_record_file", screenRecorder || "");
    formData.append("time_zone", time_zone);

    formData.append(
      "due_date_time",
      calculatedDate
        ? formatDate(calculatedDate)
        : selectedDate == "Due Date & Time"
          ? ""
          : formatDate(selectedDate)
    );
    formData.append("business_due_date", businessDate);
    const getOnlyDate = moment(formik?.values?.date).format("YYYY-MM-DD");
    formData.append(
      "reminders",
      formik?.values?.date != "" && selectedTime != ""
        ? moment(getOnlyDate + " " + selectedTime).format("DD/MM/YYYY h:mm A")
        : ""
      // moment(formik?.values?.date + " " + formik?.values?.time).format(
      //   "YYYY-MM-DD HH:mm"
      // )
    );
    // Append each file with the same key
    uploadedFiles.forEach((file) => {
      formData.append("files", file); // Note the use of "files[]" to indicate an array of files
    });

    try {
      const res = await dispatch(TaskAdd(formData));
      dispatch(
        updateProjectColumnList({
          operation: "add",
          task: res?.payload?.data?.data,
        })
      );

      dispatch(
        updateProjectTaskList({
          operation: "add",
          task: res?.payload?.data?.data,
        })
      );
      if (filterdata?.key > 0) {
        listData({});
      }

      setIsOpen(false);
      setElapsedTime(0);
      setDisable(false);
      formik.resetForm();
      handleReset();
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleUploadFile = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    //@ts-ignore
    document.getElementById("fileattachment").value = "";
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
    const formattedDate = moment(date).format("MM/DD/YYYY h:mm A");
    setSelectedDate(formattedDate);
    return formattedDate;
  };

  const handleDateChange = (newDate) => {
    setCustomDate(newDate);
    const formattedDate = moment(newDate).format("DD/MM/YYYY h:mm A");
    if (moment(formattedDate, "DD/MM/YYYY h:mm A").isAfter(moment())) {
      // Set the formatted date to the state variables
      setSelectedDate(formattedDate);
      setCalculatedDate(formattedDate);
      formik.setFieldValue("date", "");
      setSelectedTime(null);
    }
  };

  const open = Boolean(anchorEl);
  const today = new Date();

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

  const EditDetails = () => {
    dispatch(TaskDetails(ColumnId)).then((res: any) => {
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
      if (data?.screen_record_file && data?.screen_record_file != "") {
        setShowVideo(true);
      } else {
        setShowVideo(false);
      }
      if (data?.voice_record_file == "" || data?.voice_record_file == "null") {
        setSavedAudioURL("");
      } else {
        setAudioUrl(urlForImage + data.voice_record_file);
        setSavedAudioURL(urlForImage + data.voice_record_file);
      }
      formik.setFieldValue("title", data.title);
      formik.setFieldValue(
        "description",
        data.description ? data.description : ""
      );
      formik.setFieldValue("date", date);
      // formik.setFieldValue("time", time || "");
      setSelectedTime(time || "");
      setSavedAudioURL(
        data?.voice_record_file && urlForImage + data.voice_record_file
      );
      videoRef.current.src =
        data?.screen_record_file && urlForImage + data?.screen_record_file;
      setSelectedDate(
        !data?.due_date_time
          ? "Due Date & Time"
          : moment.utc(data?.due_date_time).format("DD/MMYYYY h:mm A")
      );
      setCalculatedDate(
        !data?.due_date_time
          ? ""
          : moment.utc(data?.due_date_time).format("DD/MM/YYYY h:mm A")
      );
      setSelectedlabel(!data?.labels ? "Labels" : data?.labels);
      setSelectedPriority(!data?.priority ? "Priority" : data?.priority);
      setSelectedStatusId(!data?.status ? "Status" : data?.status);
      setUploadedFilesNew(data.task_files);
      const userNames = data?.assigned_task_users?.map(
        (user) => user.first_name
      );
      const userId = data?.assigned_task_users?.map((user) => user.user_id);
      setSelectedAgent(userNames.join(", "));
      if (data?.assigned_task_users?.length == 0) {
        setSelectedAgent("Assign To");
      }
      setSelectedAgents(userId);

      const labelName = data?.task_selected_labels?.map((user) => user?.label);
      const LabelId = data?.task_selected_labels?.map((user) => user?.label_id);
      setSelectedLabel(labelName?.join(", "));
      if (data?.task_labels?.length == 0) {
        setSelectedLabel("Labels");
      }
      setSelectedLabels(LabelId);
    });
  };

  useEffect(() => {
    if (Edit) {
      EditDetails();
    }
  }, [isOpen]);

  const deleteAudio = () => {
    setSavedAudioURL(null);
  };

  const handleDeleteAttachment = async (id: number) => {
    if (type == 2) {
      videoRef.current.src = "";
      setShowVideo(false);
      setScreenRecorder(null);
      setIsOpenDeletedModal(false);
    } else if (type == 1) {
      setSavedAudioURL("");
      setAudioRecorder(null);
      setIsOpenDeletedModal(false);
    } else {
      const filteredFiles = uploadedFilesNew.filter((f) => f.id !== id);
      setUploadedFilesNew(filteredFiles);
      setIsOpenDeletedModal(false);
      setDeleteId([...deleteid, id]);
    }
  };

  const handleImageClick = (imageUrl) => {
    if (expandedImage === imageUrl) {
      setExpandedImage(null); // If already expanded, close it
    } else {
      setExpandedImage(imageUrl); // If not expanded, expand it
    }
  };

  const onSubmitEdit = async () => {
    formik.handleSubmit();
    if (formik?.values?.title.trim() == "") {
      // If there are validation errors, do not proceed further
      return;
    }
    setDisable(true);
    const screenRecordFile = videoRef?.current?.src || "";
    const formData = new FormData();
    formData.append("task_id", ColumnId);
    formData.append("title", formik.values.title);
    formData.append("description", formik.values.description);
    formData.append("time_zone", time_zone);
    formData.append("group_id", ColumnId ? ColumnId : TodoId);
    formData.append(
      "priority",
      selectedPriority == "Priority" ? "" : selectedPriority
    );
    formData.append("labels", selectedLabels as any);
    formData.append("status", selectedStatusId || "0");
    formData.append("agent_ids", selectedAgents as any);
    formData.append(
      "voice_record_file",
      audioRecorder ? audioRecorder : audioBlob
    );
    formData.append(
      "screen_record_file",
      screenRecorder ? screenRecorder : showVideo ? screenRecordFile : ""
    );
    formData.append(
      "due_date_time",
      calculatedDate
        ? formatDate(calculatedDate)
        : selectedDate == "Due Date & Time"
          ? ""
          : formatDate(selectedDate)
    );
    // formData.append("business_due_date", selectedDate);
    formData.append("business_due_date", businessDate);
    formData.append("delete_agent_ids", "");
    formData.append("delete_file_ids", deleteid as any);
    const getOnlyDate = moment(formik?.values?.date).format("YYYY-MM-DD");
    formData.append(
      "reminders",
      formik?.values?.date != "" && selectedTime != ""
        ? moment(getOnlyDate + " " + selectedTime).format("DD/MM/YYYY h:mm A")
        : formik?.values?.date != ""
          ? moment(getOnlyDate).format("DD/MM/YYYY h:mm A")
          : ""
    );

    // Append each file with the same key
    uploadedFiles.forEach((file) => {
      formData.append("files", file); // Note the use of "files[]" to indicate an array of files
    });
    try {
      const res = await dispatch(EditTaskAdd(formData));
      listData({});
      dispatch(
        updateProjectColumnList({
          operation: "edit",
          task: res?.payload?.data?.data,
        })
      );
      dispatch(
        updateProjectTaskList({
          operation: "edit",
          task: res?.payload?.data?.data,
        })
      );
      if (filterdata?.key > 0) {
        listData({});
      }
      setDisable(false);
      setIsOpen(false);
      formik.resetForm();
      handleReset();
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
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

  const handleSelectAllAgents = () => {
    if (selectedAgents?.length == agentMenuData?.length) {
      // If all agents are already selected, deselect all
      setSelectedAgents([]);
    } else {
      // Otherwise, select all agents
      setSelectedAgents(agentMenuData?.map((item) => item.id));
    }
  };

  const handleVideoPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  const handleLabelSave = () => {
    if (formik?.values?.newLabel) {
      setLoading(true); // Start loader
      dispatch(
        AddLabellList({
          project_id: project_id,
          label: formik?.values?.newLabel,
        })
      )
        .then((res) => {
          setLoading(false); // Stop loader
          setLabelsMenu(null);
          fetchLabel({ news: true });
          setSelectedlabel(formik?.values?.newLabel);
          formik.setFieldValue("newLabel", "");
          setShowLabelForm(false);
        })
        .catch(() => {
          setLoading(false); // Stop loader on error
        });
    }
  };

  const handleDelete = (id: number) => {
    dispatch(DeleteLabel(id)).then((res) => {
      setIsLabelLoading(false);
      // setLabelsMenu(null);
      if (selectedLabels.length > 0) {
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

  const handleMetadataLoad = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  function isDateTimeInRange(formikValues, selectedDate) {
    const currentDateTime = moment();
    const selectedDateTime = moment(selectedDate, "DD/MM/YYYY HH:mm");
    const inputDateTime = moment(
      `${formikValues?.date} ${formikValues?.time}`,
      "DD/MM/YYYY h:mm A"
    );

    if (!formikValues?.date || !formikValues?.time) {
      return false;
    }

    // Check if input date and time are within the valid range
    return inputDateTime.isBetween(
      currentDateTime,
      selectedDateTime,
      null,
      "[]"
    );
  }

  useEffect(() => {
    if (selectedDate && !Edit) {
      formik.setFieldValue("date", "");
      setSelectedTime(null);
    }
  }, [selectedDate]);

  useEffect(() => {
    setTimeError("");
  }, [formik.values.time]);

  const isValidReminder = isDateTimeInRange(formik.values, selectedDate);

  const showReminderLabel = (newdate: string | Date, time: string) => {
    let date = moment(newdate).format("DD/MM/YYYY");

    if (date && time) {
      return moment(date + " " + time, "DD/MM/YYYY h:mm A").format(
        "DD/MM/YYYY, h:mm A"
      );
    } else {
      return "Reminder";
    }
  };

  return (
    <CommonModal
      open={isOpen}
      disabled={disable}
      handleToggle={() => handleReset()}
      modalTitle={Edit ? "Edit Task" : "Add Task"}
      maxWidth="910"
      btnTitle={Edit ? "Save Edit" : "Save"}
      closeTitle="Close"
      onSubmit={Edit ? onSubmitEdit : onSubmit}
      btn={false}
    >
      {fetchStatusTask == "loading" && Edit ? (
        <div className="h-[80vh]">
          <ListLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-20 pb-20">
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
          <div className={`flex  pb-20 `}>
            <Button
              variant="contained"
              color="secondary"
              className={`${disable ? "btn-disable" : ""
                } w-[156px] h-[48px] text-[16px] font-400`}
              onClick={(e) => {
                e.stopPropagation();
                onSubmit();
              }}
              // disabled={!isValid || disable}
              disabled={disable}
            >
              {/* {disabled ? <CircularProgress size={24} sx={{ color: '#4F46E5' }} /> : btnTitle} */}
              {disable ? (
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
              )}
            </Button>
            <Button
              variant="outlined"
              disabled={disable}
              color="secondary"
              className={`${disable ? "btn-disable-light" : ""
                } w-[156px] h-[48px] text-[16px] font-400 ml-14`}
              onClick={(e) => {
                handleReset();
                formik.resetForm();
                e.stopPropagation();
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="flex gap-10 flex-col md:flex-row ">
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
                  className={`relative rounded-8 bg-[#F6F6F6]  cursor-pointer hover:bg-[#0000001f]
                  ${AgentMenu ? "border-1 border-solid border-[#9DA0A6] " : " "}
                    
      `}
                  onClick={(event) => setAgentMenu(event.currentTarget)}
                >
                  <CommonChip
                    // onClick={(event) => setAgentMenu(event.currentTarget)}
                    style={{
                      maxWidth: selectedAgents?.length > 0 ? "300px" : "auto",
                      paddingRight: "27px",
                      justifyContent: "left",
                      cursor: "pointer",
                    }}
                    sx={{
                      "& .MuiButtonBase-root-MuiChip-root": {
                        background: transparent,
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
                      },
                    }}
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
                  <div className="absolute top-[13px] right-[-0.7rem] pr-10">
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
              <div className="sm:w-[375px] p-20">
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
                        {/* <span>{item?.userName}</span> */}
                        {/* </label> */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DropdownMenu>

            <DropdownMenu
              anchorEl={priorityMenu}
              handleClose={() => setPriorityMenu(null)}
              button={
                <CommonChip
                  onClick={(event) => setPriorityMenu(event.currentTarget)}
                  label={selectedPriority}
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
                            .join(",  ")
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
                        formik?.values?.newLabel.trim() == "" || loading
                      }
                      onClick={() => handleLabelSave()}
                    >
                      {loading ? <ListLoading /> : "Save"}
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

            {!upperButton ? (
              <DropdownMenu
                anchorEl={statusMenu}
                handleClose={() => setStatusMenu(null)}
                button={
                  <CommonChip
                    onClick={handleStatusMenuClick}
                    // label={selectedStatus}
                    className={`${statusMenu
                      ? "border-1 border-solid border-[#9DA0A6] cursor-pointer"
                      : ""
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
            ) : (
              <CommonChip
                // onClick={handleStatusMenuClick}
                // label={selectedStatus}
                className={`${statusMenu ? "border-1 border-solid border-[#9DA0A6] " : ""
                  }`}
                label="To Do"
                icon={<StatusIcon />}
              />
            )}
          </div>

          <div className="flex gap-20">
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
                    disablePast
                    views={["year", "month", "day", "hours", "minutes"]}
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
              anchorEl={showReminder}
              handleClose={() => setShowReminder(null)}
              button={
                <CommonChip
                  onClick={(event) => setShowReminder(event.currentTarget)}
                  label={showReminderLabel(formik.values?.date, selectedTime)}
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
                <DatePicker
                  name="date"
                  label="Date"
                  disablePast
                  value={formik.values.date || "MM/DD/YYYY"}
                  onChange={(date) => {
                    formik.setFieldValue("date", date);
                    setCustomDate(null);
                  }}
                  // className="taskRemindeDateField"
                  shouldDisableDate={(date) => {
                    return customDate ? date > customDate : false;
                  }}
                  sx={{
                    width: "326px",
                    background: "#F6F6F6",
                    cursor: "cell !important",
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
                  selectedDate={moment(formik.values.date).format(
                    "DD/MM/YYYY h:mm A"
                  )}
                  lastDate={selectedDate}
                />


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
            {/* <CommonChip label="Reminder" icon={<ReminderIcon />} /> */}
          </div>

          <Grid container spacing={2}>
            <AudioRecorderComponent
              audioBlob={savedAudioURL}
              setAudioBlob={setAudioBlob}
              edit={false}
              handleEditTaskTitle={null}
              deleteAudio={deleteAudio}
            />

            <Grid item md={4} className="relative">
              <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5 border-solid border-[#4F46E5]">
                File
              </FormLabel>
              <label
                htmlFor="fileattachment"
                className="bg-[#EDEDFC] px-20  !border-[0.5px] !border-solid !border-[#4F46E5] rounded-6 min-h-[48px] 
              flex items-center gap-20
             justify-between cursor-pointer mb-10 hover:bg-[#0000001f]"
              // onClick={() => handleUploadFile()}
              >
                <label className="text-[16px] text-[#4F46E5] flex items-center cursor-pointer ">
                  Upload File
                  <input
                    type="file"
                    style={{ display: "none" }}
                    multiple={true}
                    id="fileattachment"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleUploadFile}
                  />
                </label>
                <span>
                  <img src={"../assets/images/logo/upload.png"} />
                </span>
              </label>
              <div className="flex flex-wrap gap-2 items-center justify-start md:absolute max-h-[120px] overflow-y-auto">
                {uploadedFiles?.map((file, index) => (
                  <div
                    key={index}
                    className="bg-[#F6F6F6] mb-10 px-10 rounded-6 min-h-[48px] gap-3 flex items-center justify-between cursor-pointer"
                  >
                    <div className="bg-F6F6F6 mb-10  rounded-6 min-h-48 flex items-center justify-between cursor-pointer w-full">
                      <span className="mr-4">
                        <PreviewIcon />
                      </span>
                      <span className="text-[16px] text-[#4F46E5] py-5 mr-8">
                        {file.name}
                      </span>
                      <span onClick={() => handleRemoveFile(file)}>
                        <CrossGreyIcon />
                      </span>
                    </div>
                  </div>
                ))}

                {uploadedFilesNew?.map((item: any) => (
                  <div className="relative cursor-pointer ">
                    {item.file.includes(".png") ||
                      item.file.includes(".jpg") ||
                      item.file.includes(".webp") ||
                      item.file.includes(".jfif") ||
                      item.file.includes(".jpeg") ||
                      item.file.startsWith("image/") ? (
                      <>
                        <img
                          src={urlForImage + item.file}
                          alt="Black Attachment"
                          className="w-[100px] rounded-md "
                        />
                        <div
                          className="absolute top-7 left-7"
                          onClick={() =>
                            handleImageClick(urlForImage + item.file)
                          }
                        >
                          <AttachmentIcon />
                        </div>
                        <div
                          className="absolute top-7 right-7"
                        // onClick={() => handleDeleteAttachment(item.id)}
                        >
                          <AttachmentDeleteIcon
                            onClick={() => {
                              setIsOpenDeletedModal(true);
                              setType(3);
                              setIsDeleteId(item.id);
                              // setDeleteId([...deleteid, item.id]);
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="w-[100px] rounded-md sm:h-[60px] flex items-center justify-center border-1 border-[#4F46E5]">
                        <a
                          href={urlForImage + item.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="../assets/images/logo/pdfIcon.png"
                            alt="Black Attachment"
                            className="h-[50px] w-[50px]"
                          />
                        </a>

                        {/* <a href="/">check</a> */}
                        <div
                          className="absolute top-7 left-7"
                          onClick={() =>
                            handleImageClick(urlForImage + item.file)
                          }
                        >
                          <AttachmentIcon />
                        </div>
                        <div
                          className="absolute top-7 right-7"
                        // onClick={() => handleDeleteAttachment(item.id)}
                        >
                          <AttachmentDeleteIcon
                            onClick={() => {
                              setIsOpenDeletedModal(true);
                              setType(3);
                              setIsDeleteId(item.id);
                              // setDeleteId([...deleteid, item.id]);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {expandedImage && (
                  <div
                    className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-80"
                    onClick={() => setExpandedImage(null)}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <img
                        src={expandedImage}
                        alt="Expanded Image"
                        className="max-w-full max-h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
                {showVideo ? "Record Your Screen Again" : "Screen Recording"}
              </FormLabel>
              {!isRecording && (
                <CommonChip
                  colorSecondary
                  className="w-full"
                  label={
                    showVideo
                      ? "Record Your Screen Again"
                      : "Record Your Screen"
                  }
                  onClick={() =>
                    showVideo
                      ? setIsScreenRecordingModal(true)
                      : handleRecordClick()
                  }
                  icon={
                    <ScreenRecordingIcon
                      className="record-btn"
                    // onClick={handleRecordClick}
                    />
                  }
                  style={{ border: "0.5px solid #4F46E5" }}
                />
              )}
              <>
                {/* {showVideo && !isRecording && ( */}
                <div
                  className={`rounded-[7px] border-1 border-solid border-[#9DA0A6] mt-10 relative  block ${showVideo && !isRecording ? "" : "hidden"
                    }`}
                >
                  <video
                    className="rounded-[7px] p-5 h-[120px] "
                    width="450px"
                    ref={videoRef}
                    controls
                    autoPlay={false}
                    onPlay={handleVideoPlay}
                    onLoadedMetadata={handleMetadataLoad}
                  />

                  {Edit ? (
                    <div
                      className="absolute top-7 right-7"
                    // onClick={() => handleDeleteAttachment(item.id)}
                    >
                      <AttachmentDeleteIcon
                        onClick={() => {
                          setIsOpenDeletedModal(true);
                          setType(2);
                          setIsDeleteId(ColumnId);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="border-1 border-solid rounded-full  absolute right-[-2px] top-[-2px] flex items-center justify-center border-[#E7E8E9]">
                      <CrossGreyIcon
                        className="h-20 w-20 p-4"
                        fill="#757982"
                        onClick={() => setShowVideo(false)}
                      />
                    </div>
                  )}
                </div>
                {/* )} */}
                {isRecording && (
                  <>
                    <div className="bg-[#FEECEB] border-[0.5px] border-[#F44336] my-10 rounded-[7px] flex items-center justify-between px-16 py-10">
                      <Typography className="text-[#F44336] text-[16px] ">
                        Stop Recording
                      </Typography>
                      <div className="flex items-center gap-10">
                        <span id="timer" className="text-[#F44336] text-[16px]">
                          {formatTime(elapsedTime)}
                        </span>
                        <img
                          src="../assets/images/logo/play.svg"
                          alt="play"
                          onClick={toggleRecording}
                        ></img>
                        {/* <img
                        src="../assets/images/logo/pause.svg"
                        alt="pause"
                        onClick={PlayRecording}
                      ></img> */}
                      </div>
                    </div>
                  </>
                )}
              </>
            </Grid>
          </Grid>
        </div>
      )}

      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => {
          handleDeleteAttachment(deleteId), handleDelete(isLabelList);
        }}
        heading={`Delete ${type == 3 ? "Attachment" : "Label"}`}
        description={`Are you sure you want to delete this ${type == 3 ? "Attachment" : "Label"
          }? `}
        isLoading={isLabelLoading}
      />
      <MicrophonePopup
        isOpen={isVideoModal}
        setIsOpen={setIsVideoModal}
        heading={`Whoops! Looks like you denied access`}
        media="micro"
      />

      <ActionModal
        modalTitle="Delete Screen Recording"
        modalSubTitle="There's an existing recording. Do you want to delete it and start a new one?"
        open={isScreenRecordingModal}
        handleToggle={() => setIsScreenRecordingModal((prev) => !prev)}
        type="delete"
        onDelete={() => {
          setIsScreenRecordingModal((prev) => !prev);
          handleRecordClick();
        }}
      />
    </CommonModal>
  );
}

export default AddTaskModal;
