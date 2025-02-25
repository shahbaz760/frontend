import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../../SearchInput";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import DropdownMenu from "../../Dropdown";
import {
  DownArrowBlank,
  DownArrowIcon,
  HoverEditIcon,
  UpArrowIcon,
} from "public/assets/icons/dashboardIcons";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { FilterIcon } from "public/assets/icons/user-icon";
import GroupAgentsList from "../../agents/GroupAgentList";
import AddGroupModel from "../../agents/AddGroupModel";
import {
  DeleteIcon,
  DeleteIconFilter,
  EditIcon,
  EditIconDoc,
} from "public/assets/icons/common";
import { DeleteIconBlack } from "public/assets/icons/projectsIcon";
import AddFilterModel from "./AddFilterModel";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useSelector } from "react-redux";
import {
  EditFilteredList,
  deleteFilteredList,
  projectFilteredList,
} from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import ListLoading from "@fuse/core/ListLoading";
import toast from "react-hot-toast";
import DeleteClient from "../../client/DeleteClient";

const SaveFilter = ({ handleApply, setIsSaveFilter, tab, projectId }) => {
  const [showProject, setShowProject] = useState<boolean>(false);
  const [onTitleHover, setOnTitleHover] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const dispatch = useAppDispatch();
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchQuery);
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const { saveFilterList, saveFilterListStatus } = useSelector(
    (store: ProjectRootState) => store?.project
  );

  const [editingItemId, setEditingItemId] = useState(null); // Track the currently editing item
  const [editedText, setEditedText] = useState(""); // Track the edited text for each item

  const handleEditClick = (id, name) => {
    setEditingItemId(id); // Enable edit mode for the clicked item
    setEditedText(name); // Initialize edited text for this item
  };
  const labelRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (labelRef.current) {
      const isTextTruncated =
        labelRef.current.scrollWidth > labelRef.current.clientWidth;
      setIsTruncated(isTextTruncated);
    }
  }, [editingItemId]);
  const handleContentChange = (id, event) => {
    setEditedText(event.target.innerText);
  };

  const handleSave = (id) => {
    setEditingItemId(null); // Exit edit mode for the item
    // handleSubmit(editedText[id], id); // Call the submit handler with the updated text
    handleFilterListEdit(id, editedText);
  };

  const handleKeyDown = (id, event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent new line
      handleSave(id); // Save on Enter key press
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const fetchList = async (search = "") => {
    const payload = {
      project_id: projectId,
      is_view: tab,
      search: search,
    };
    try {
      const res = await dispatch(projectFilteredList(payload));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
    setEditingItemId(null);
    setSearchQuery("");
  };

  const handleSubmit = (name, id = 0) => {
    handleApply({ save: true, name: name, ids: id });
    if (id) {
      setIsSaveFilter(true);
      setAnchorEl(null);
    }
    setIsOpenAddModal(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchQuery);
    }, 300); // 3 seconds delay

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or when the searchQuery changes
    };
  }, [searchQuery]);

  // Effect to fetch the list when the debounced search term changes
  useEffect(() => {
    // if (debouncedSearchTerm) {
    fetchList(debouncedSearchTerm); // Call the fetch function
    // }
  }, [debouncedSearchTerm]);

  const handleFilterListDelete = async (id) => {
    setIsLabelLoading(true);
    try {
      const res = await dispatch(deleteFilteredList(id));
      toast.success(res?.payload?.data?.message);
      fetchList();
      setIsLabelLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLabelLoading(false);
    }
    setIsOpenDeletedModal(false);
  };

  const handleFilterListEdit = async (id, name) => {
    const payload = {
      filter_id: id,
      name: name,
    };
    try {
      const res = await dispatch(EditFilteredList(payload));
      if (res?.payload?.data?.status == 1) {
        toast.success(res?.payload?.data?.message);
      } else {
        toast.error("Filter name cannot be empty");
      }
      fetchList();
      setEditingItemId(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEditingItemId(null);
    }
  };
  const textLengthThreshold = 20;

  return (
    <>
      <DropdownMenu
        button={
          <div className="relative flex items-center" onClick={handleClick}>
            <Button
              variant="text"
              color="secondary"
              className="h-[40px] sm:text-[14px] flex gap-8  leading-none bg-[#EDEDFC]  rounded-6"
              aria-label="Saved Filters"
              endIcon={
                anchorEl ? (
                  <UpArrowIcon />
                ) : (
                  <DownArrowIcon className="cursor-pointer" />
                )
              }
            >
              Saved Filters
            </Button>
          </div>
        }
        anchorEl={anchorEl}
        handleClose={handleClose}
      >
        {/* {saveFilterListStatus == "loading" ?
          <ListLoading /> :
          (<> */}
        <TextField
          hiddenLabel
          variant="standard"
          placeholder={`Search... `}
          select={false}
          onKeyDown={(e) => e.stopPropagation()}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value); // Update the search query
          }}
          // value={searchQuery}
          // onChange={handleSearchChange}
          sx={{
            height: "40px",
            paddingLeft: "3px",
            borderRadius: "8px",
            marginBottom: "10px",
            borderBottom: "1px solid #EDF2F6",
            "& .MuiInputBase-input": {
              border: "none",
              paddingLeft: "8px",
              paddingRight: "8px",
            },
            "& .MuiInputAdornment-root": {
              marginLeft: "8px",
            },
            "& .MuiInput-underline:before": {
              border: "none !important",
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none !important",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#757982",
              opacity: 1,
              fontSize: "15px",
              lineHeight: "14px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onClick={(e) => e.stopPropagation()}
        />
        {/* <MenuItem> */}
        <Typography className="text-[#B0B3B8] text-12 px-24 pb-3 cursor-default hover:bg-transparent">
          My Filters
        </Typography>
        {/* </MenuItem> */}
        <MenuItem
          onClick={() => {
            setIsOpenAddModal(true);
            setIsTruncated(true);
          }}
          className="bg-none "
        >
          <IconButton className="bg-none hover:bg-transparent">
            <FilterIcon color={"red"} fill="#4F46E5" />
          </IconButton>
          <label
            htmlFor="agents"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#4F46E5",
              fontSize: "14",
            }}
            onClick={() => setIsOpenAddModal(true)}
          >
            Save Active Filter
          </label>
        </MenuItem>
        <div className="max-h-[190px] overflow-y-auto">
          {saveFilterList?.length > 0 &&
            saveFilterList?.map((item, index) => (
              <MenuItem
                key={item.id} // Make sure to add a unique key prop
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "default",
                }}
                onMouseEnter={() => {
                  setOnTitleHover(item.id);

                  const isTextTruncated =
                    item.name.length > textLengthThreshold;
                  setIsTruncated(isTextTruncated);
                }}
                onMouseLeave={() => setOnTitleHover(null)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    overflowX: "auto",
                    position: "relative",
                  }}
                >
                  <Tooltip
                    title={
                      isTruncated || item.name.length > textLengthThreshold // Check if the text is truncated or too long
                        ? editedText[item.id] || item.name
                        : ""
                    } // Show full text in tooltip if truncated or too long
                    disableHoverListener={
                      !(isTruncated || item.name.length > textLengthThreshold)
                    }
                    placement="top"
                  >
                    <label
                      htmlFor="activity"
                      ref={(el) => {
                        if (editingItemId === item.id && el) {
                          // Focus on the element when editing
                          el.focus();

                          // Move cursor to the end of the content
                          const range = document.createRange();
                          const selection = window.getSelection();
                          range.selectNodeContents(el);
                          range.collapse(false); // Collapse the range to the end (false)
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        labelRef.current = el; // Maintain the ref for other purposes
                      }}
                      contentEditable={editingItemId === item.id}
                      suppressContentEditableWarning={true}
                      onBlur={() => handleSave(item.id)} // Save the updated content
                      onInput={(event) => handleContentChange(item.id, event)} // Handle input change
                      onKeyDown={(event) => handleKeyDown(item.id, event)} // Submit on Enter
                      autoFocus={true}
                      style={{
                        maxWidth: "115px", // Set the max width for truncation and scrolling
                        overflowX:
                          editingItemId === item.id ? "scroll" : "hidden", // Enable horizontal scroll when editing
                        overflowY: "hidden", // Disable vertical scroll
                        textOverflow:
                          editingItemId === item.id ? "clip" : "ellipsis", // Truncate text with ellipsis when not editing
                        whiteSpace: "nowrap", // Prevent text wrapping
                        borderBottom:
                          editingItemId === item.id
                            ? "1px solid #4F46E5"
                            : "none", // Show border when editing
                        outline: "none", // Remove outline when focused
                        cursor: editingItemId === item.id ? "text" : "pointer", // Text cursor when editing
                        color: editingItemId === item.id ? "#4F46E5" : "#333",
                      }}
                      onClick={() => {
                        if (editingItemId == null) {
                          handleSubmit(item.name, item.id); // Enable editing on click
                        }
                      }}
                    >
                      {editedText[item.id] || item.name}
                      {/* Show updated text or original text */}
                    </label>
                  </Tooltip>
                </div>
                <div
                  className="icon-container gap-10"
                  style={{
                    opacity: onTitleHover === item.id ? 1 : 0, // Show icons on hover
                    transition: "opacity 0.2s ease", // Optional smooth transition
                  }}
                >
                  <IconButton
                    className="icon-button bg-white rounded-6 mr-10 hover:bg-white"
                    onClick={() => {
                      setIsOpenDeletedModal(true), setIsLabelList(item.id);
                    }}
                  >
                    <DeleteIconFilter className="h-14 w-14" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleEditClick(item.id, item.name);
                    }}
                    className="icon-button bg-white rounded-6 hover:bg-white"
                  >
                    <HoverEditIcon fill="#393F4C" className="h-16 w-16" />
                  </IconButton>
                </div>
              </MenuItem>
            ))}
        </div>

        {/* </>)} */}
      </DropdownMenu>

      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => {
          handleFilterListDelete(isLabelList);
        }}
        heading={`Delete Filter`}
        description={`Are you sure you want to delete this filter? `}
        isLoading={isLabelLoading}
      />
      <AddFilterModel
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        isSaveFilter={true}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default SaveFilter;
