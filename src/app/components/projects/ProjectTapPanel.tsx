import ListLoading from "@fuse/core/ListLoading";
import { useWindowWidth } from "@fuse/hooks/useWIndowWidth";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import {
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { Box } from "@mui/system";
import {
  DeleteDoc,
  DeleteWhiteBoard,
  EditDocBoardData,
  EditWhiteBoardData,
  addDocBoardData,
  addWhiteBoardData,
  deleteProjectBoardApi,
  getDocList,
  getWhiteBoardList,
  pinProjectBoardApi,
  projectGetMenu,
  projectMenu,
  projectMenuUpdate,
  projectUpdateMenu,
  setCondition,
  setFilter,
  setFilterData,
  setIsSubTask,
  setMainOp,
  setSortFilter,
  sortWhiteDocBoard,
  upadteMainBoardList,
  upadteMoreBoardList,
  updateProjectBoardList,
} from "app/store/Projects";
import { ProjectRootState, WhiteBoardData } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { debounce } from "lodash";
import { WhiteBoardIconNew } from "public/assets/icons/clienIcon";
import {
  CalenderIcon,
  CalenderIconActive,
  ChatIcon,
  ChatIconActive,
  DocIcon,
  DocIconActive,
  KanbanIcon,
  KanbanIconActive,
  ProjectPinIcon,
  TaskListIcon,
  TaskListIconActive,
  TaskTableIcon,
  TaskTableIconActive,
  ViewIcon,
  WhiteBoardIconActive,
} from "public/assets/icons/projectsIcon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Kanban from "src/app/components/projects/Kanban";
import { ROLES } from "src/app/constants/constants";
import { getClientId, getUserDetail } from "src/utils";
import { Android12Switch } from "../ToggleButton";
import CalenderPage from "./Calender/CalenderPage";
import ChatBoard from "./ChatBoard/ChatBoard";
import DocumentBoard from "./DocumentBoard/DocumentBoard";
import {
  hideDropDownItemsFor,
  projectTabsDropdown,
  tabsDropdownType,
} from "./projectTabsDropdown";
import ProjectTaskList from "./ProjectTaskList/ProjectTaskList";
import ProjectTaskTabel from "./ProjectTaskTabel";
import ViewBoard from "./ViewPopUp/WhiteBoard";
import DeleteModal from "./WhiteBoard/DeleteModal";
import WhiteBoard from "./WhiteBoard/WhiteBoard";
import DeleteClient from "../client/DeleteClient";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    className:
      "px-4 py-6 min-w-0 min-h-0 text-[1.8rem] font-400 text-[#757982]",
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const TruncateTextTab = ({
  text,
  maxWidth,
  font = "18px",
  isEditing,
  onSave,
  editableTab,
  setEditableTab,
}) => {
  const [inputValue, setInputValue] = useState(text);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);
  useEffect(() => {
    if (isEditing && editableTab && inputRef.current) {
      inputRef.current.focus(); // Manually focus the input
      setInputValue(text);
    }
  }, [isEditing, editableTab]);

  const handleInputChange = (e) => {
    e.stopPropagation();
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue != text) {
      setEditableTab(false);
      onSave(inputValue.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const handleFocus = (e) => {
    e.stopPropagation(); // Prevent tab change when focusing the input
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setEditableTab(false);
        handleBlur(); // Save changes when clicking outside
      }
    };

    if (isEditing && editableTab) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editableTab]);

  return (
    <>
      <input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => handleBlur()}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        autoFocus
        style={{
          width: `${maxWidth}px`,
          fontSize: font,
          display: isEditing && editableTab ? "inline-block" : "none",
        }}
      />

      <Tooltip
        title={text}
        enterDelay={500}
        disableHoverListener={!isTruncated}
      >
        <Typography
          ref={textRef}
          noWrap
          style={{
            maxWidth: `${maxWidth}px`,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: font,
            display: !(isEditing && editableTab) ? "inline-block" : "none",
          }}
        >
          {text}
        </Typography>
      </Tooltip>
    </>
  );
};

export const TruncateText = ({ text, maxWidth, font = "14px" }) => {
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
          fontSize: font,
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

export default function ProjectTabPanel() {
  const { clientId } = useParams();
  const [showViewWindow, setShowViewWindow] = useState<boolean>(false);
  const theme: Theme = useTheme();
  const client_id = getUserDetail();
  const userDetails = getUserDetail();
  const [isDisableList, setIsDisableList] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [tabId, setTabId] = useState(null);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const {
    projectInfo,
    projectBoardList,
    whiteBoardList,
    DocList,
    DocStatus,
    fetchMenuTask,
    isBoardListLoading,
    projectBoardAddMoreList,
    projectBoardMainList,
  } = useSelector((store: ProjectRootState) => store?.project);
  const windowWidth = useWindowWidth();
  const [DocumentList, setDocumentList] = useState([]);
  const [whiteBoardNewList, setWhiteBoardNewList] = useState([]);
  const [dataBoardList, setDataBoardList] = useState({
    whiteBoard: false,
    doc: false,
    chat: false,
  });
  const { id, uuid, name } = useParams<{
    id: string;
    uuid?: string;
    name: string;
  }>();
  const dispatch = useAppDispatch();
  const tabsRef = useRef(null);
  const [anchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [whiteBoardId, setWhiteBoardId] = useState(null);
  const [disableDelete, setDisableDelete] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removeid, setRemoveId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previousmenu, setPreviousMenu] = useState([]);
  const [editedName, setEditedName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editableTab, setEditableTab] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isPinChecked, setIsPinChecked] = useState<boolean>(false);
  const [deleteProjectBoard, setDeleteProjectBoard] = useState<null | string>(
    null
  );
  const [selecteddropDownData, setSelecteddropDownData] = useState<any>({});
  const DocRef = useRef(null);
  useEffect(() => {
    setDocumentList(DocList);
    setWhiteBoardNewList(whiteBoardList);
  }, [DocList, whiteBoardList]);

  const handleNewItemChange = (event) => {
    event.stopPropagation();
    setNewItem(event.target.value);
  };

  const saveDocData = async (name) => {
    try {
      const payload: any = {
        project_id: id,
        doc_file: "",
        name: name,
      };
      const res = await dispatch(addDocBoardData(payload));
      handleMenuItemClick(res?.payload?.data?.data);
      if (res?.payload?.data && res?.payload?.data.status) {
        toast.success(res?.payload?.data?.message);
      } else {
        toast.error(res?.payload?.data?.message);
      }
      setIsEditing(false);
      fetchDocList();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Unable to save Whiteboard");
    }
  };

  const saveData = async (name) => {
    try {
      const payload: WhiteBoardData = {
        project_id: id as string,
        xml_data: "",
        xml_img: "",
        name: name,
      };
      const res = await dispatch(addWhiteBoardData(payload));
      handleMenuItemClick(res?.payload?.data?.data);
      if (res?.payload?.data && res?.payload?.data.status) {
        toast.success(res?.payload?.data?.message);
      } else {
        toast.error(res?.payload?.data?.message);
      }
      fetchWiteBoardList();
      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Unable to save Whiteboard");
    }
  };

  const handleAddNewItem = () => {
    if (newItem.trim()) {
      setNewItem("");
      setIsAdding(false);
    }
    if (selectedTab == 4) {
      saveData(newItem.trim());
    } else {
      saveDocData(newItem.trim());
    }
  };

  const handleRemoveItem = (item) => {
    setRemoveId(item?.id);
    setIsOpenDeletedModal(true);
  };

  const handleClick = (event) => {
    event.currentTarget;
  };

  const handleClose = () => {
    setNewItem("");
    null;
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleAddMore = (e) => {
    setAnchorElAdd(e.currentTarget);
  };

  const handleCloseAdd = () => {
    setNewItem("");
    setAnchorElAdd(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleCloseDoc = () => {
    setNewItem("");
    setAnchorEl1(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleMenuItemClick = (item) => {
    if (item.id !== whiteBoardId) {
      setIsEditing(false);
    }
    // Perform the action based on the menu item clicked
    setWhiteBoardId(item?.id);
    if (!isEditing) {
      null;
      setAnchorEl1(null);
    }
    setNewItem("");
  };

  const navigate = useNavigate();
  const handleChange = (
    event: React.SyntheticEvent,
    newValue?: number,
    uuidNew?: any
  ) => {
    dispatch(setIsSubTask(true));
    dispatch(setFilter(0));
    // const newType = getTypeFromTabIndex(newValue);
    const newType =
      projectBoardList?.find((menu) => menu.menu == newValue)?.uuid || uuidNew;
    const newSelected = projectBoardList?.find(
      (menu) => menu.menu == newValue
    )?.menu;
    const clientId = getClientId();
    if (newValue == 1) {
      localStorage.removeItem("completeColumn");
      dispatch(setFilter(0));
      dispatch(setIsSubTask(true));

      if (newType) {
        navigate(
          `/projects/${id}/${name}/${newType}/${projectInfo?.list[0]?.id}${clientId ? `?ci=${clientId}` : ""
          }`
        );
      } else {
        // navigate(window.location.pathname);
      }
    } else {
      if (newType) {
        navigate(
          `/projects/${id}/${name}/${newType}${clientId ? `?ci=${clientId}` : ""}`
        );
      } else {
        // navigate(window.location.pathname);
      }
    }
    setSelectedTab(newSelected);

    if (newValue >= 4 && innerWidth > 768) {
      const flexContainer = document.querySelector(".MuiTabs-flexContainer");
      if (flexContainer) {
        flexContainer.scrollLeft = flexContainer.scrollWidth + 200;
      }
    }
    // dispatch(setFilter(0));
    const payload = {
      key: null,
      order: 0,
    };
    // Trigger actions when route changes
    dispatch(setFilter(0));
    dispatch(setCondition([]));
    dispatch(setMainOp(""));
    dispatch(setSortFilter([]));
    dispatch(setFilterData(payload));
  };

  const moveTab = (newValue?: number, uuid?: any) => {
    const clientId = getClientId();
    navigate(
      `/projects/${id}/${name}/${uuid}${clientId ? `?ci=${clientId}` : ""}`
    );
    setSelectedTab(newValue);

    if (newValue >= 4) {
      const flexContainer = document.querySelector(".MuiTabs-flexContainer");
      if (flexContainer) {
        flexContainer.scrollLeft = flexContainer.scrollWidth + 200;
      }
    }
  };
  var lastIndexId;
  const updateBoardList = async (data) => {
    // const payload = [0, 1, 2, 3]
    const datamenu = projectBoardList?.map((menuData) => menuData.menu);
    const payload = [];
    if (data.whiteBoard) {
      payload.push(4);
    }
    if (data.doc) {
      payload.push(5);
    }

    if (data.chat) {
      payload.push(6);
    }
    setDataBoardList({ ...data });
    const countTrue = Object.values(data).filter(
      (value) => value == true
    ).length;
    try {
      const res = await dispatch(
        projectUpdateMenu({ project_id: id, menu: payload })
      );
      const loader = false;
      const boardListData = [...res?.payload?.data?.data];

      await dispatch(updateProjectBoardList(boardListData));
      const lastItem =
        res?.payload.data.data[res?.payload.data.data.length - 1];
      lastIndexId =
        res?.payload.data.data[res?.payload.data.data.length - 1]?.uuid;
      if (data.whiteBoard) {
        const filteredMenus = res?.payload?.data.data?.filter((item: any) =>
          String(item.menu).startsWith("4")
        );
        const lastMenuItem = filteredMenus[filteredMenus.length - 1];
        moveTab(lastMenuItem?.menu, lastMenuItem?.uuid);
      }
      if (data.doc) {
        moveTab(5, res?.payload.data.data.find((menu) => menu.menu == 5)?.uuid);
      }
      if (data.chat) {
        moveTab(6, res?.payload.data.data.find((menu) => menu.menu == 6)?.uuid);
      }
      if (!data.whiteBoard && !data.doc && !data.chat) {
        handleChange(null, 3);
      }
      const lastTwoObjects = boardListData.slice(-countTrue);
      // handleChangeTabs(lastTwoObjects);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getTabIndexFromType = (type) => {
    const data =
      projectBoardList && projectBoardList?.length > 0
        ? projectBoardList?.find((data) => data?.uuid == type)
        : 0;
    return data && data.menu ? data.menu : 0;
  };

  useEffect(() => {
    const tabIndex = getTabIndexFromType(lastIndexId || uuid);
    const clientId = getClientId();
    if (
      tabIndex === 0 &&
      projectBoardList &&
      projectBoardList?.length > 0 &&
      uuid !== projectBoardList[0]?.uuid
    ) {
      navigate(
        `/projects/${id}/${name}/${projectBoardList[0]?.uuid}${clientId ? `?ci=${clientId}` : ""
        }`
      );
    }
  }, [uuid, projectBoardList, id, name]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const clientId = getClientId();
    if (!clientId && searchParams.toString()) {
      navigate(
        `/projects/${id}/${name}/${projectBoardList[0]?.uuid}${clientId ? `?ci=${clientId}` : ""
        }`,
        {
          replace: true,
        }
      );
    }
  }, [navigate, id, name, projectBoardList]);

  const type =
    uuid || projectBoardList?.length ? projectBoardList[0]?.uuid : uuid;
  const [selectedTab, setSelectedTab] = useState(
    getTabIndexFromType(`${type} ${clientId ? `?ci=${clientId}` : ""}`)
  );

  useEffect(() => {
    if (selectedTab >= 4 && innerWidth > 768) {
      const tabsContainer = tabsRef.current?.querySelector(
        ".MuiTabs-flexContainer"
      );
      if (tabsContainer) {
        tabsContainer.scrollLeft = tabsContainer.scrollWidth;
      }
    }
  }, [selectedTab]);

  useEffect(() => {
    const type = uuid || projectBoardList[0]?.uuid;
    if (type) {
      setSelectedTab(getTabIndexFromType(type));
    }
  }, [uuid, id, projectBoardList]);

  const fetchMenuData = () => {
    try {
      const res = dispatch(projectGetMenu({ id, loader: true }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const showWhiteBoard = () => {
    setShowViewWindow(!showViewWindow);
  };

  useMemo(() => {
    fetchMenuData();
  }, [id]);

  useEffect(() => {
    if (projectBoardList?.length > 0) {
      dispatch(updateProjectBoardList([...projectBoardList]));
    }
  }, []);

  const handlePinProjectBoard = async () => {
    const deleteRes = await dispatch(
      pinProjectBoardApi({ uuid: deleteProjectBoard })
    );
    if (deleteRes.payload) {
      dispatch(updateProjectBoardList(deleteRes?.payload?.data?.data));
      // toast.success(deleteRes?.payload?.data?.message);
      setSelecteddropDownData({});
      setEditingIndex(null);
      setEditValue(null);
      setDeleteProjectBoard(null);
    }
  };

  let timeoutId = null;

  const handleDeleteProjectBoard = async () => {
    setIsDisableList(true);
    setLoading(true);
    const deleteRes = await dispatch(
      deleteProjectBoardApi({ uuid: deleteProjectBoard })
    );
    if (deleteRes.payload) {
      dispatch(updateProjectBoardList(deleteRes?.payload?.data?.data));
      setEditingIndex(null);
      setEditValue(null);
      setIsDelete(false);
      setDeleteProjectBoard(null);
    }
    setIsDisableList(false);
    setLoading(false);
  };

  const debounceDeleteProjectBoard = useCallback(
    debounce(() => {
      handleDeleteProjectBoard();
    }, 100),
    [deleteProjectBoard] // Dependency array, include dependencies if needed
  );

  const handleIsEditAble = (type: "edit" | "delete" | "pin") => {
    if (type === "edit") {
      setEditableTab(true);
    } else if (type === "delete") {
      setIsDelete(true);
      // debounceDeleteProjectBoard();
    } else if (type === "pin") {
      handlePinProjectBoard();
    }
    setAnchorEl1(null);
    // setSelecteddropDownData({});
  };

  const UpdateMenuData = async (name, uuids) => {
    if (name != "") {
      try {
        const payload = {
          uuid: uuids ? uuids : projectBoardMainList[0]?.uuid,
          name: name,
        };
        const res = await dispatch(projectMenuUpdate(payload));
        // toast.success(res?.payload?.data?.message)
        const getBroadList = [...projectBoardMainList];
        if (getBroadList?.length > 0) {
          const getIndexToBeUpdate = getBroadList?.findIndex(
            (item) => item?.uuid == uuids
          );

          getBroadList[getIndexToBeUpdate] = res?.payload?.data?.data;
          const allList = [...getBroadList, ...projectBoardAddMoreList];
          dispatch(updateProjectBoardList(allList));
          setEditingIndex(null);
          setEditableTab(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const debouncedUpdateMenuData = useCallback(
    debounce((name, uuids) => {
      UpdateMenuData(name, uuids);
      setEditableTab(false);
    }, 1000),
    [projectBoardMainList]
  );

  const handleEditChange = (e: any, uuids: any) => {
    let value = e.target.value;
    if (value.startsWith(" ")) {
      value = value.trimStart();
    }
    const itemToUpdate = projectBoardMainList.find(
      (item) => item.uuid == uuids
    );
    if (value != "") {
      if (itemToUpdate && value != "") {
        // Create a new updated item with the new name
        const updatedItem = { ...itemToUpdate, name: value };

        // Update the list with the new item
        const updatedList = projectBoardMainList.map((item) =>
          item.uuid == uuids ? updatedItem : item
        );

        // Dispatch the updated list to Redux
        dispatch(upadteMainBoardList(updatedList));
      }
      setEditValue(value);
      debouncedUpdateMenuData(value, uuids);
    }
    // else {
    //   setEditableTab(false)
    // }
  };

  const handleBlur = () => {
    if (editingIndex !== null) {
      const newList = [...projectBoardList];
      newList[editingIndex].name = editValue;
      dispatch(updateProjectBoardList(newList));
      setEditingIndex(null);
    }
  };

  const fetchWiteBoardList = async () => {
    try {
      const res = await dispatch(getWhiteBoardList(id));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDocList = async () => {
    try {
      const res = await dispatch(getDocList(id));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateLists = () => {
    const parentDiv: any = document.querySelector(".tabs-box");
    const parentDivWidth = parentDiv?.offsetWidth;
    let currentWidth = 0;
    const visibleItems = [];
    const hiddenItems = [];
    projectBoardList &&
      projectBoardList?.length > 0 &&
      projectBoardList?.forEach((item) => {
        const itemWidth = 170;
        if (currentWidth + itemWidth <= parentDivWidth) {
          visibleItems.push(item);
          currentWidth += itemWidth;
        } else {
          hiddenItems.push(item);
        }
      });
    dispatch(upadteMainBoardList(visibleItems));
    dispatch(upadteMoreBoardList(hiddenItems));
  };

  useEffect(() => {
    if (windowWidth < 1800) {
      handleChange(null, 0);
    }
  }, []);

  useEffect(() => {
    updateLists(); // Call this whenever screenWidth changes
  }, [windowWidth]);

  useEffect(() => {
    updateLists();
  }, [projectBoardList]);

  useEffect(() => {
    setWhiteBoardId(null);
    if (selectedTab == 4) {
      fetchWiteBoardList();
    } else if (selectedTab == 5) {
      fetchDocList();
    }
  }, [selectedTab]);

  const DeleteWhiteBoarditem = async () => {
    try {
      const res = await dispatch(DeleteWhiteBoard(removeid));
      fetchWiteBoardList();
      setDisableDelete(false);
      setRemoveId(null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DeleteDocitem = async () => {
    try {
      const res = await dispatch(DeleteDoc(removeid));
      fetchDocList();
      setDisableDelete(false);
      setRemoveId(null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const onDelete = () => {
    setDisableDelete(true);
    if (selectedTab == 4) {
      DeleteWhiteBoarditem();
    } else {
      DeleteDocitem();
    }
    setRemoveId(null);
    setIsOpenDeletedModal(false);

    setDisableDelete(false);
  };

  const handleDoubleClickMenuItem = (item) => {
    setEditedName(item.name);
    setIsEditing(true);
    setWhiteBoardId(item.id);
  };

  const handleMenuChange = (e, item) => {
    setEditedName(e.target.innerText);
    if (selectedTab == 4) {
      debouncedSave(e.target.innerText, item);
    } else {
      debouncedUpdateData(e.target.innerText, item);
    }
  };
  const isEditingItem = (item) => item && item.id == whiteBoardId;
  const debouncedSave = useRef(
    debounce(async (newValue, item) => {
      try {
        const payload: any = {
          white_board_id: item?.id,
          xml_data: item.xml_data,
          xml_img: "",
          name: newValue,
        };
        const res = await dispatch(EditWhiteBoardData(payload));
        if (res?.payload?.data && res?.payload?.data.status) {
          toast.success(res?.payload?.data?.message);
        } else {
          toast.error(res?.payload?.data?.message);
        }
        fetchWiteBoardList();
        isEditingItem(null);
        setIsEditing(false);
        setWhiteBoardId(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Unable to save Whiteboard");
      }
    }, 1000)
  ).current;

  const debouncedUpdateData = useRef(
    debounce(async (newValue, item) => {
      try {
        const payload: any = {
          document_id: item?.id,
          doc_file: item?.doc_file,
          name: newValue,
        };
        const res = await dispatch(EditDocBoardData(payload));
        if (res?.payload?.data && res?.payload?.data.status) {
          toast.success(res?.payload?.data?.message);
        } else {
          toast.error(res?.payload?.data?.message);
        }
        fetchDocList();
        isEditingItem(null);
        setIsEditing(false);
        // setWhiteBoardId(null)
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Unable to save Document");
      }
    }, 1000)
  ).current;

  const fetchIcon = (icon, selectedTab, index) => {
    switch (removeDecimal(icon)) {
      case 0:
        return selectedTab == icon ? <KanbanIconActive /> : <KanbanIcon />;
      case 1:
        return selectedTab == icon ? (
          <TaskTableIconActive />
        ) : (
          <TaskTableIcon />
        );
      case 2:
        return selectedTab == icon ? <TaskListIconActive /> : <TaskListIcon />;
      case 3:
        return selectedTab == icon ? <CalenderIconActive /> : <CalenderIcon />;
      case 4:
        return selectedTab == icon ? (
          <WhiteBoardIconActive />
        ) : (
          <WhiteBoardIconNew />
        );
      case 5:
        return selectedTab == icon ? <DocIconActive /> : <DocIcon />;
      case 6:
        return selectedTab == icon ? <ChatIconActive /> : <ChatIcon />;
      default:
        return null; // Return null or a default icon if needed
    }
  };

  const handleChangeTabs = (itemsArray) => {
    const numberOfItemsToReplace = itemsArray.length;

    // Ensure there are enough items in both lists
    if (projectBoardAddMoreList.length === 0) {
      console.error("No items in addMore to replace with");
      return;
    }

    // Only swap one item at a time, so assume length is 1
    const mainListCopy = [...projectBoardMainList];
    const addMoreCopy = [...projectBoardAddMoreList];

    // Get the last item from the main list
    const lastMainItem = mainListCopy.pop();

    // Get the first item from the array (the one clicked)
    const clickedItem = itemsArray[0];

    // Add the clicked item to the main list
    mainListCopy.push(clickedItem);

    // Replace the clicked item in the addMore list with the last main item
    const newAddMoreList = addMoreCopy.map((item) =>
      item.id === clickedItem.id ? lastMainItem : item
    );

    // Dispatch updated lists
    dispatch(upadteMainBoardList(mainListCopy));
    dispatch(upadteMoreBoardList(newAddMoreList));

    // Call handleChange with the clicked item
    handleChange(null, clickedItem.menu, clickedItem.uuid);

    // Close the AddMore popup
    handleCloseAdd();
  };

  const handleSave = (newValue, index) => {
    setEditingIndex(null); // Close the edit mode once the change is saved
    // Update the tab name (you can use debounced or regular update)
    handleEditChange(
      { target: { value: newValue } },
      projectBoardMainList[index]?.uuid
    );
  };

  const moveProject = async (payload) => {
    try {
      const res = await dispatch(projectMenu(payload));
      // callListApi(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If there's no destination, cancel the drop.
    if (!destination) return;

    // Get the item at the destination
    const destItem = projectBoardMainList[destination.index];

    // Check if the destination is a valid position (pinned item)
    if (destItem?.pin !== 1) {
      // Cancel the drop if the destination is non-draggable
      return;
    }

    // If valid, proceed with reorder logic
    const reorderedList = Array.from(projectBoardMainList);
    const [movedItem] = reorderedList.splice(source.index, 1);
    reorderedList.splice(destination.index, 0, movedItem);

    let extractedProjectsids = reorderedList.map((project) => project.id);

    const payload = {
      project_id: id,
      menu_ids: extractedProjectsids,
    };
    moveProject(payload);

    // Dispatch the updated list to your state management (Redux)
    dispatch(upadteMainBoardList(reorderedList));
    dispatch;
  };

  const removeDecimal = (selected) => {
    // If the input is already a number, use it directly
    if (typeof selected === "number") {
      return Math.floor(selected);
    }

    // If the input is a string, attempt to convert it to a number
    if (typeof selected === "string") {
      const number = parseFloat(selected);
      if (!isNaN(number)) {
        return Math.floor(number);
      }
    }

    // Handle cases where input is neither a number nor a valid string
    return "Invalid input";
  };

  useEffect(() => {
    if (id) {
      const tabId =
        projectBoardList &&
        projectBoardList?.length > 0 &&
        projectBoardList?.filter((item) => item?.uuid == uuid);
      if (tabId) {
        const getWhiteBoardObj = tabId[0];
        setSelectedTab(getWhiteBoardObj?.menu);
        if (
          getWhiteBoardObj?.menu[0] == "4" ||
          getWhiteBoardObj?.menu[0] == "5"
        ) {
          setTabId(getWhiteBoardObj?.id);
        }
      }
    }
  }, [uuid, projectBoardList]);

  useEffect(() => {
    if (clientId) {
      const localStorageKeys = Object.keys(localStorage);
      const clientIdInStorage = localStorageKeys.some((key) =>
        key.includes(clientId)
      );

      if (!clientIdInStorage) {
        window.close();
      }
    }
  }, [clientId]);

  if (isBoardListLoading) {
    return <ListLoading />;
  }
  return (
    <>
      <div className="px-[15px]  flex gap-20 sm:flex-wrap lg:flex-nowrap mb-20  w-full">
        <div className="basis-full lg:basis-auto lg:grow  w-full">
          {isBoardListLoading ? null : ( // <ListLoading />
            <div className="shadow-md bg-white rounded-lg flex items-center gap-[5px] sm:gap-[30px] w-full flex-wrap sm:flex-nowrap">
              <div className="tabs-box flex justify-between items-center basis-[83%]">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId="droppable-tabs"
                    direction="horizontal"
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ width: "100%", height: "70px" }}
                      >
                        <Tabs
                          value={selectedTab}
                          onChange={handleChange}
                          aria-label="basic tabs example"
                          className="min-h-0 pb-14 pt-14 px-20 gap-[30px] overflow-y-auto"
                          sx={{
                            "& .MuiTabs-flexContainer": {
                              gap: "20px",
                              overflowY: "auto",
                              width: "100%",
                            },
                            "& .MuiTab-root.Mui-selected": {
                              color: theme.palette.secondary.main,
                              borderBottomWidth: "2px",
                              borderBottomColor: theme.palette.secondary.main,
                              borderBottom: "solid",
                              fontSize: "12px",
                            },
                            "& .MuiTabs-indicator": {
                              visibility: "hidden",
                              display: "none",
                              backgroundColor: theme.palette.secondary.main,
                            },
                            "& .MuiButtonBase-root.MuiTab-root": {
                              borderBottom: "2px solid transparent",
                            },
                          }}
                        >
                          {projectBoardMainList?.map((item, index) => (
                            <Draggable
                              key={item?.uuid}
                              draggableId={`${item?.id}`}
                              index={index}
                              isDragDisabled={item?.pin !== 1} // Disable dragging for non-pinned items
                            >
                              {(provided: any) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    display: "inline-flex",
                                  }}
                                >
                                  <div
                                    {...(item.pin === 1
                                      ? provided.dragHandleProps
                                      : {})} // Drag handle only for draggable items
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      width: "100%",
                                    }}
                                    onContextMenu={(e) => {
                                      if (isDisableList) return;
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setAnchorEl1(e.currentTarget);
                                      setEditingIndex(index);
                                      setEditValue(item?.name);
                                      setDeleteProjectBoard(item?.uuid);
                                      setSelecteddropDownData(item);
                                      setIsPinChecked(
                                        item?.pin == 1 ? true : false
                                      );
                                    }}
                                  >
                                    {/* <Tab
                                        label={
                                          <TruncateTextTab
                                            maxWidth={150}
                                            text={item?.name}
                                            isEditing={editingIndex === index}
                                            editableTab={editableTab}
                                            onSave={(newValue) =>
                                              handleSave(newValue, index)
                                            }
                                            setEditableTab={setEditableTab}
                                          />
                                        }
                                        icon={
                                          <div
                                            style={{
                                              position: "relative",
                                              display: "inline-flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {fetchIcon(
                                              item.menu,
                                              selectedTab,
                                              index
                                            )}
                                            {item.pin === 1 && (
                                              <span
                                                style={{
                                                  position: "absolute",
                                                  top: -7,
                                                  left: -11,
                                                }}
                                              >
                                                <ProjectPinIcon />
                                              </span>
                                            )}
                                          </div>
                                        }
                                        iconPosition="start"
                                        value={item.menu}
                                        onChange={() => {
                                          handleChange(null, item.menu);
                                          setSelectedTab(item.menu);
                                        }}
                                        sx={{
                                          "& .MuiTypography-root": {
                                            fontSize: "14px !important",
                                          },
                                          "& .MuiButtonBase-root.MuiTab-root": {
                                            borderBottom:
                                              item?.menu === selectedTab
                                                ? "2px solid #4F46E5 !important"
                                                : 0,
                                          },
                                        }}
                                        className={`!opacity-100 !py-6 !px-4 ${item.pin == 1
                                          ? "!pl-[20px]"
                                          : "!pl-[4px]"
                                          } !min-h-[36px] ${item?.menu === selectedTab
                                            ? "text-[#4F46E5] !border-b-2 !border-[#4F46E5]"
                                            : "text-[#757982]"
                                          }`}
                                      /> */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "18px !important",
                                        gap: 1,
                                        borderBottom:
                                          item?.menu === selectedTab
                                            ? "2px solid #4F46E5 !important"
                                            : 0,
                                      }}
                                      className={`!opacity-100 !py-6 !px-4 cursor-pointer ${item.pin == 1
                                        ? "!pl-[20px]"
                                        : "!pl-[4px]"
                                        } !min-h-[36px] ${item?.menu === selectedTab
                                          ? "text-[#4F46E5] !border-b-2 !border-[#4F46E5]"
                                          : "text-[#333333]"
                                        }`}
                                      onClick={() => {
                                        handleChange(null, item.menu);
                                        setSelectedTab(item.menu);
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: "relative",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {fetchIcon(
                                          item.menu,
                                          selectedTab,
                                          index
                                        )}
                                        {item.pin === 1 && (
                                          <span
                                            style={{
                                              position: "absolute",
                                              top: -7,
                                              left: -11,
                                            }}
                                          >
                                            <ProjectPinIcon />
                                          </span>
                                        )}
                                      </div>
                                      <TruncateTextTab
                                        maxWidth={150}
                                        text={item?.name}
                                        isEditing={editingIndex === index}
                                        editableTab={editableTab}
                                        onSave={(newValue) =>
                                          handleSave(newValue, index)
                                        }
                                        setEditableTab={setEditableTab}
                                      />
                                    </Box>
                                  </div>
                                  {provided.placeholder}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </Tabs>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              <div
                className={`${projectBoardAddMoreList?.length > 0 ? "opacity-100" : "opacity-0"} basis-[8%]`}
              >
                <Button
                  onClick={handleAddMore}
                  className="pl-10 sm:pl-10 text-[18px] mt-10 text-[#333333] rounded-none whitespace-nowrap  "
                >
                  +{projectBoardAddMoreList?.length} more
                </Button>
              </div>

              <div
                className={`border-l-1 mt-10 pr-20 ${client_id?.role_id !== ROLES.AGENT ? "" : "hidden"
                  }`}
              >
                <Button
                  onClick={showWhiteBoard}
                  startIcon={<ViewIcon />}
                  className="pl-10 text-[18px] text-[#333333] rounded-none  "
                >
                  View
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* -------AddMore----------- */}
      {projectBoardAddMoreList?.length > 0 && (
        <Menu
          id="custom-menu"
          anchorEl={anchorElAdd}
          keepMounted
          open={Boolean(anchorElAdd)}
          onClose={handleCloseAdd}
          sx={{
            "& .MuiPaper-root": {
              maxWidth: 210,
              Width: 210,
              minWidth: 210,
              maxHeight: 400,
              overflowY: "auto",
              overflowX: "hidden",
            },
          }}
        >
          {projectBoardAddMoreList?.map((item: any, index) => {
            return (
              <MenuItem
                key={index}
                sx={{
                  "&.MuiListItemText-root.muiltr-tlelie-MuiListItemText-root:hover":
                  {
                    backgroundColor: "red", // Light grey background on hover
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#f0f0f0", // Grey background for selected items
                  },
                }}
                onClick={() => handleMenuItemClick(item)}
              >
                {/* <ListItemText primary={item?.name} /> */}
                <ListItemText
                  key={item.id} // Ensure each item has a unique `id`
                  primary={
                    <TruncateText text={item.name} maxWidth={170} font="14px" />
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeTabs([item]);
                  }}
                />
              </MenuItem>
            );
          })}
        </Menu>
      )}

      {/* -----------doc---------- */}

      {userDetails?.role_id != 3 && (
        <Menu
          id="custom-menu"
          anchorEl={anchorEl1}
          keepMounted
          open={Boolean(anchorEl1)}
          onClose={handleCloseDoc}
          sx={{
            "& .MuiPaper-root": {
              maxWidth: 190,
              Width: 190,
              minWidth: 190,
              maxHeight: 400,
              overflowY: "auto",
              overflowX: "hidden",
            },
          }}
        >
          {projectTabsDropdown?.map((item: tabsDropdownType, index: number) => {
            // Check if the item should be hidden
            const shouldHideItem =
              //@ts-ignore
              hideDropDownItemsFor.includes(
                //@ts-ignore
                removeDecimal(selecteddropDownData?.menu)
              ) && item.type === "delete";

            if (shouldHideItem) {
              return null; // Skip rendering if the item should be hidden
            }

            return (
              <ListItemText
                sx={{
                  "& :hover": {
                    background: "#F6F6F6",
                  },
                }}
                disableTypography={isDisableList}
                key={index + 1}
                primary={
                  <Typography
                    onClick={() => {
                      if (item?.type != "pin") {
                        handleIsEditAble(item.type);
                      }
                      // if (item?.type === "delete") {
                      //   // setIsDelete(true);
                      // }
                    }}
                    sx={{
                      p: "5px 10px",
                      cursor: "pointer",
                      color: "#757982",
                    }}
                    className="space-x-8"
                  >
                    {/* {item?.icon} {item?.title}{" "} */}
                    {/* {item?.type == "pin" && ( */}
                    <div className=" flex justify-between items-center">
                      <div>
                        {item?.icon} {item?.title}{" "}
                      </div>
                      {item?.type == "pin" && (
                        <Android12Switch
                          design={true}
                          checked={isPinChecked}
                          onChange={() => handleIsEditAble(item.type)}
                        />
                      )}
                    </div>
                    {/* )} */}
                  </Typography>
                }
                ref={DocRef}
                contentEditable={isEditing && isEditingItem(item)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  handleMenuChange(e, item);
                }}
                style={{
                  borderBottom:
                    isEditing && isEditingItem(item)
                      ? "2px solid #4f46e5"
                      : "none",
                  color:
                    isEditing && isEditingItem(item) ? "#4f46e5" : "inherit",
                  // width: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />
            );
          })}
        </Menu>
      )}

      <CustomTabPanel value={removeDecimal(selectedTab) == 0 && 0} index={0}>
        <Kanban />
      </CustomTabPanel>
      <CustomTabPanel value={removeDecimal(selectedTab) == 1 && 1} index={1}>
        <ProjectTaskTabel customSelectedTab={selectedTab} />
      </CustomTabPanel>
      <CustomTabPanel value={removeDecimal(selectedTab) == 2 && 2} index={2}>
        <ProjectTaskList customSelectedTab={selectedTab} />
      </CustomTabPanel>
      <CustomTabPanel value={removeDecimal(selectedTab) == 3 && 3} index={3}>
        <CalenderPage />
      </CustomTabPanel>
      {removeDecimal(selectedTab) == 4 && (
        <CustomTabPanel value={removeDecimal(selectedTab) == 4 && 4} index={4}>
          <WhiteBoard
            tabId={tabId}
            whiteBoardId={whiteBoardId}
            setWhiteBoardId={setWhiteBoardId}
            fetchWiteBoardList={fetchWiteBoardList}
          />
        </CustomTabPanel>
      )}
      {removeDecimal(selectedTab) == 6 && (
        <CustomTabPanel value={removeDecimal(selectedTab) == 6 && 6} index={6}>
          <ChatBoard />
        </CustomTabPanel>
      )}
      {removeDecimal(selectedTab) == 5 && (
        <CustomTabPanel value={removeDecimal(selectedTab) == 5 && 5} index={5}>
          <DocumentBoard
            tabId={tabId}
            DocId={whiteBoardId}
            setDocId={setWhiteBoardId}
            fetchWiteBoardList={fetchDocList}
            length={DocList.length}
          />
        </CustomTabPanel>
      )}

      {showViewWindow && (
        <ViewBoard
          isOpen={showViewWindow}
          setIsOpen={setShowViewWindow}
          boardList={dataBoardList}
          setBoardList={updateBoardList}
          id={id}
        />
      )}
      {isOpenDeletedModal && (
        <DeleteModal
          isOpen={isOpenDeletedModal}
          setIsOpen={setIsOpenDeletedModal}
          title={`Delete ${selectedTab == 4 ? "WhiteBoard" : "Document"}`}
          onDelete={onDelete}
          description={`Are you sure you want to delete this ${selectedTab == 4 ? "WhiteBoard" : "Document"
            }? `}
          disable={disableDelete}
        />
      )}
      <DeleteClient
        isOpen={isDelete}
        setIsOpen={setIsDelete}
        onDelete={handleDeleteProjectBoard}
        heading={"Delete View"}
        description={"Are you sure you want to delete this view? "}
        isLoading={loading}
      />
    </>
  );
}
