import ListLoading from "@fuse/core/ListLoading";
import { Button, Dialog, Menu, MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { getStatusList } from "app/store/Agent";
import {
  TaskAdd,
  TaskListColumn,
  deleteTask,
  projectColumnAdd,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import moment from "moment-timezone";
import { StatusIcon } from "public/assets/icons/task-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getUserDetail } from "src/utils";
import * as Yup from "yup";
import ActionModal from "../../ActionModal";
import DropdownMenu from "../../Dropdown";
import InputField from "../../InputField";
import CommonChip from "../../chip";
import AddTaskModal from "../../tasks/AddTask";
import FilterPage from "../FilterPage";
import CustomToolbar from "./CustomToolBar";
import EventCustomize from "./EventCustomize";
import AddTaskInline from "../../tasks/AddTaskInline";

function FormatsWeekdayFormat({ demoEvents, localizer }) {
  const { defaultDate, formats } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 1),
      formats: {
        weekdayFormat: (date, culture, localizer) =>
          localizer.format(date, "dddd", culture),
      },
    }),
    []
  );

  return (
    <div className="height600">
      <Calendar
        defaultDate={defaultDate}
        events={demoEvents}
        formats={formats}
        localizer={localizer}
      />
    </div>
  );
}

const localizer = momentLocalizer(moment);
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "8px 20px",
  minWidth: "250px",
}));

const CalenderDesign = ({ events }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [statusMenuData, setStatusMenuData] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [statusMenu, setStatusMenu] = useState<HTMLElement | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [disable, setDisabled] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [disabled, setDisable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [views, setViews] = useState("month");

  const [calendarState, setCalendarState] = useState({
    events: events,
    title: "",
    desc: "",
    start: null,
    status: "",
    end: null,
    openSlot: false,
    openEvent: false,
    clickedEvent: null,
  });

  useEffect(() => {
    dispatch(getStatusList({ id: id })).then((res) => {
      setStatusMenuData(res?.payload?.data?.data?.list);
      setSelectedStatusId(res?.payload?.data?.data?.list?.[0]?.id);
    });
  }, [dispatch]);

  const convertToDateObject = (dateString, timezone) => {
    return moment.tz(dateString, "YYYY-MM-DD HH:mm", timezone).toDate();
  };
  const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const mapEvents = (events) => {
    return events.map((event) => ({
      title: event.title,
      start: convertToDateObject(event.due_date_time, systemTimezone), // Adjust the date fields as needed
      end: convertToDateObject(event.due_date_time, systemTimezone),
      desc: event.description,
      status: event.id,

      // Add other event fields as needed
    }));
  };
  const {
    fetchStatusNew,
    filterdata,
    filtered,
    conditions,
    MainOp,
    ProjectTask,
    fetchTask,
    calenderData,
  } = useSelector((store: ProjectRootState) => store?.project);

  const getAllEvents = async ({
    task_start = 0,
    is_filter_save = 0,
    columnid = 0,
    loader = true,
    search = null,
    applyopMain = "",
    filter = null,
    groupkey = null,
    order = 0,
    sort = [],
    condition = [],
  }) => {
    const transformArray = (inputArray) => {
      return inputArray.map((item) => ({
        applyOp: applyopMain != "" ? applyopMain : MainOp,
        condition: item.filterConditions.map((cond) => ({
          applyOp:
            item.filterConditions.length > 1
              ? cond.applyOp == "AND"
                ? "AND"
                : "OR"
              : "",
          key: cond.key, // Assuming you want to keep the key as is
          op: cond.op, // Assuming you want to keep the op as is
          value: cond.op == 2 || cond.op == 3 ? [] : cond.value,
        })),
      }));
    };

    if (search != null) {
      setLoader(true);
    }
    const payload = {
      project_id: id,
      start: 0,
      limit: -1,
      search: search,
      type: 1,
      is_view: 3,
      filter: transformArray(condition),
      is_filter_save: is_filter_save,
      // Sort: []
    };
    await dispatch(TaskListColumn({ payload, loading: loader })).then((res) => {
      // setStatusMenuData(res?.payload?.data?.data?.list);
      const mappedEvents = mapEvents(res?.payload?.data?.data?.list);
      setLoader(false);
      setCalendarState((prevState) => ({
        ...prevState,
        events: mappedEvents,
      }));
    });
  };
  useEffect(() => {
    getAllEvents({ loader: true, search: "" });
  }, [dispatch]);

  useEffect(() => {
    const mappedEvents = mapEvents(calenderData);
    setLoader(false);
    setCalendarState((prevState) => ({
      ...prevState,
      events: mappedEvents,
    }));
  }, [calenderData]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    formik.resetForm();
    setCalendarState({
      ...calendarState,
      openSlot: false,
      openEvent: false,
    });
    setAnchorEl(null);
  };

  const handleViewChange = (view) => {
    localStorage.setItem("calendarView", view); // Store selected view
    setViews(view);
  };
  const formats = {
    weekdayFormat: (date: Date, culture: string, localizer: any) =>
      localizer.format(date, "dddd", culture),
  };

  const [today] = React.useState(new Date());

  const customDayPropGetter = (date) => {
    if (views == "month") {
      const isToday = moment(date).isSame(today, "day");

      const isSlotOpen =
        calendarState.openSlot &&
        moment(date).isSame(calendarState.start, "day");
      return {
        className: isToday ? "today-cell" : isSlotOpen ? "active-slot" : "",
      };
    } else if (views == "week") {
      const isToday = moment(date).isSame(today, "day");

      const isSlotOpen =
        calendarState.openSlot &&
        moment(date).isSame(calendarState.start, "day");
      return {
        className: isToday ? "today-cell" : isSlotOpen ? "" : "",
      };
    }
  };

  const eventComponent = ({ event }) => {
    // setSelectedId(event.status);
    return (
      <EventCustomize
        event={event}
        onClickButton={(clickedEvent) => {
          //@ts-ignore
          setAnchorEl(1);
        }}
        setSelectedId={setSelectedId}
        setIsOpenAddModal={setIsOpenAddModal}
      />
    );
  };

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      setCalendarState({
        ...calendarState,
        start,
        end,
        openSlot: true,
        openEvent: false,
      });
    },
    [calendarState]
  );

  const handleSelectEvent = (event, e) => {
    setCalendarState({
      ...calendarState,
      openEvent: true,
      clickedEvent: event,
      start: event.start,
      end: event.end,
      title: event.title,
      status: event.status,
      desc: event.desc,
    });
    setAnchorEl(e.currentTarget);
    setSelectedId(event.status)
  };

  const setNewAppointment = async () => {
    setDisabled(true);
    const { title, start, end, desc, events, status } = calendarState;
    const newEvent = { title, start, end, desc, status };
    const formData = new FormData();
    formData.append("project_id", id);
    formData.append("project_column_id", status || statusMenuData?.[2]?.id);
    formData.append("title", title);
    formData.append("description", "");
    formData.append("priority", "");
    formData.append("labels", "");
    formData.append("status", status || statusMenuData?.[2]?.id);
    formData.append("agent_ids", "");
    formData.append("voice_record_file", "");
    formData.append("screen_record_file", "");
    formData.append("due_date_time", moment(start).format("DD/MM/YYYY h:mm A"));
    formData.append(
      "business_due_date",
      moment(start).format("DD/MM/YYYY h:mm A")
    );
    formData.append("reminders", "");
    formData.append("files", "");

    try {
      const res = await dispatch(TaskAdd(formData));
      if (res?.payload?.data?.status == 1) {
        setDisabled(false);
        setCalendarState({
          ...calendarState,
          openSlot: false,
        });
        getAllEvents({ loader: false, search: "" });
        toast.success(res?.payload?.data?.message);
      } else {
        setDisabled(false);
        toast.error(res?.payload?.data?.message);
        setCalendarState({
          ...calendarState,
          openSlot: false,
        });
      }
    } catch (error) {
      setDisabled(false);
      console.error("Error fetching data:", error);
    }
  };

  const updateEvent = () => {
    const { title, desc, start, end, events, clickedEvent } = calendarState;
    const updatedEvents = events.map((event) =>
      event === clickedEvent ? { ...event, title, desc, start, end } : event
    );
    setCalendarState({
      ...calendarState,
      events: updatedEvents,
      openEvent: false,
    });
    handleClose();
  };

  const deleteEvent = () => {
    const { events, clickedEvent } = calendarState;
    const updatedEvents = events.filter((event) => event !== clickedEvent);
    setCalendarState({
      ...calendarState,
      events: updatedEvents,
      openEvent: false,
    });
    handleClose();
  };

  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);

  const handleStatusMenuClick = (event) => {
    setStatusMenu(event.currentTarget);
  };

  const handleStatusMenuItemClick = (status) => {
    setSelectedStatusId(status.id);
    setCalendarState({ ...calendarState, status: status.id });

    setStatusMenu(null);
  };

  useEffect(() => {
    setCalendarState({
      ...calendarState,

      title: "",
      status: "",
    });
    setSelectedStatusId(null);
  }, [calendarState?.openSlot]);

  const toggleEditModal = () => {
    setIsOpenAddModal(true);
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (id) {
      setDisabled(true);
      dispatch(deleteTask(calendarState?.status))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            setOpenDeleteModal(false);
            deleteEvent();
            // callListApi(2);
            getAllEvents({});
            toast.success(res?.data?.message, {
              duration: 4000,
            });
            setDisabled(false);
          }
        });
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Name is required.")
      .min(1, "Name is required."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      fetchData(values);
    },
  });

  const fetchData = async (payload: any) => {
    setDisable(true);
    const data: any = {
      project_id: id as string,
      name: payload.name,
    };
    try {
      const res = await dispatch(projectColumnAdd(data));
      if (res?.payload?.data?.status == 1) {
        toast.success(res?.payload?.data?.message);
        formik.setFieldValue("name", "");
        formik.resetForm();

        setDisable(false);
        dispatch(getStatusList({ id: id })).then((res) => {
          setStatusMenuData(res?.payload?.data?.data?.list);
          setSelectedStatusId(res?.payload?.data?.data?.list?.[0]?.id);
        });
      } else {
        setDisable(false);
      }
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };
  const handleSave = () => {
    formik.handleSubmit();
  };
  useEffect(() => {
    const storedView = localStorage.getItem("calendarView");
    if (storedView) {
      setViews(storedView);
    }
  }, []);
  const userDetails = getUserDetail();
  if (fetchTask == "loading") {
    return <ListLoading />;
  }
  return (
    <>
      <div className="shadow-md bg-white rounded-lg mb-20">
        <FilterPage
          group={false}
          sort={false}
          tableTask={true}
          apicall={true}
          tab={3}
        />
      </div>

      {fetchTask == "loading" ? (
        <ListLoading />
      ) : (
        <div className={` ${userDetails?.role_id != 3 ? "client " : ""}`}>
          <Calendar
            localizer={localizer}
            events={calendarState.events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onView={handleViewChange}
            defaultView={views}
            dayPropGetter={customDayPropGetter}
            showMultiDayTimes
            dayLayoutAlgorithm={"no-overlap"}
            components={{
              event: eventComponent,
              toolbar: CustomToolbar,
            }}
            formats={formats}
            popup
            step={60}
            timeslots={1}
            overlapping={false}
          />

          <Dialog
            open={calendarState.openSlot}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            PaperProps={{
              style: {
                minWidth: "20vw",
                paddingTop: "2rem",
                paddingBottom: "2rem",
              },
            }}
          >
            <>
              <div className="flex items-center justify-between mb-20 border-b-1 border-b-solid border-b-[#EDF2F6] px-20 pb-10">
                <Typography className="text-[16px] font-500">
                  Create Task
                </Typography>
                {calendarState.start && (
                  <Typography
                    variant="subtitle1"
                    className="text-[14px] text-[#757982]"
                  >
                    {moment(calendarState.start).format("MMMM DD, YYYY")}
                  </Typography>
                )}
              </div>
              <div className="mb-20 px-20">
                <InputField
                  name="title"
                  label="Title"
                  placeholder="Enter Task Name"
                  value={calendarState.title}
                  onChange={(e) =>
                    setCalendarState({
                      ...calendarState,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-20 px-20">
                {statusMenuData?.length != 0 ? (
                  <>
                    <Typography className="block text-[16px] font-medium text-[#111827] mb-5">
                      Column List
                    </Typography>
                    <DropdownMenu
                      anchorEl={statusMenu}
                      handleClose={() => setStatusMenu(null)}
                      button={
                        <CommonChip
                          onClick={handleStatusMenuClick}
                          // label={selectedStatus}
                          style={{ width: "100%" }}
                          label={
                            selectedStatusId
                              ? statusMenuData?.find(
                                (item) => item.id == selectedStatusId
                              )?.name
                              : statusMenuData?.[2]?.name
                          }
                          icon={<StatusIcon />}
                        />
                      }
                      popoverProps={{
                        open: !!statusMenu,
                        classes: {
                          paper: "pt-10 pb-20 ",
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
                  </>
                ) : (
                  <>
                    <div
                      className="flex gap-4 "
                      style={{ alignItems: "center" }}
                    >
                      <InputField
                        className="!w-[200px]"
                        formik={formik}
                        name="name"
                        label="Column Name"
                        placeholder="Enter Column Name"
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        className="w-[95px] h-[30px] text-[16px] rounded-[28px] mt-[12px]"
                        onClick={handleSave}
                      // disabled={
                      //   calendarState.title == "" ||
                      //   statusMenuData?.length == 0 ||
                      //   disable
                      // }
                      >
                        Add
                      </Button>
                    </div>
                    <span className=" text-red   block ">
                      You don't have column please add column first
                    </span>
                  </>
                )}
              </div>
              <div className="flex px-20">
                <Button
                  variant="contained"
                  color="secondary"
                  className="w-[95px] h-[30px] text-[16px] rounded-[28px]"
                  onClick={setNewAppointment}
                  disabled={
                    calendarState.title == "" ||
                    statusMenuData?.length == 0 ||
                    disable
                  }
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  className="w-[95px] h-[30px] text-[16px] ml-14 rounded-[28px]"
                  onClick={handleClose}
                  disabled={disable}
                >
                  Cancel
                </Button>
              </div>
            </>
          </Dialog>

          <div style={{ position: "absolute", right: 20, top: 19 }}>
            <span
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
              }}
            >
              {/* <ThreeDotsIcon className="cursor-pointer" /> */}
            </span>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClosePopup}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={(e) => {
                  handleClosePopup();
                  toggleEditModal();
                }}
              >
                Edit Task
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  handleClosePopup();
                  toggleDeleteModal();
                  e.stopPropagation();
                }}
              >
                Delete Task
              </MenuItem>
            </Menu>
          </div>
        </div>
      )}

      <ActionModal
        modalTitle="Delete Task"
        modalSubTitle="Are you sure you want to delete this task?"
        open={openDeleteModal}
        handleToggle={toggleDeleteModal}
        type="delete"
        onDelete={handleDelete}
        disabled={disable}
      />
      {isOpenAddModal && (
        // <AddTaskModal
        <AddTaskInline
          isOpen={isOpenAddModal}
          project_id={id}
          setIsOpen={setIsOpenAddModal}
          ColumnId={selectedId}
          // callListApi={getAllEvents}
          Edit
          tableTask={true}
          tab={3}
        />
      )}
    </>
  );
};

export default CalenderDesign;
