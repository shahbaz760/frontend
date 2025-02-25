import { projectAdd, updateProjectList } from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import {
  Box,
  Checkbox,
  FormLabel,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  Chip,
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CommonModal from "src/app/components/CommonModal";
import InputField from "src/app/components/InputField";
import { Role, getClientId, getUserDetail } from "src/utils";
import * as Yup from "yup";
import { CancelIcon, DownFillArrow } from "public/assets/icons/common";
import DropdownMenu from "src/app/components/Dropdown";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import { debounce } from "lodash";
import { GetAssignAgentsInfo } from "app/store/Client";
import { check } from "prettier";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { DownArrowBlank } from "public/assets/icons/dashboardIcons";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function AddProjectModal({ isOpen, setIsOpen }: IProps) {
  const theme = useTheme();
  const [disable, setDisabled] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const userId = getUserDetail();
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const [checkedPrivate, setCheckedPrivate] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("Select");
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [focused, setFocused] = useState<boolean>(false);
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: userId.id,
    is_user: 1,
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
        setAgentMenuData(res?.payload?.data?.data?.list);
      });
    }
  }, [filterMenu.search, isOpen]);

  const { projectList } = useSelector(
    (store: ProjectRootState) => store.project
  );

  const clientId = getClientId();
  const fetchData = async (data: any) => {
    setDisabled(true);
    const payload = {
      name: data.name,
      is_private: checkedPrivate ? 1 : 0,
      assign_users: selectedAgents,
    };

    try {
      const res = await dispatch(projectAdd(payload));
      if (res?.payload?.data?.status === 1) {
        const newProject = res?.payload?.data;
        // Update local storage with userDetails.projects
        let localData = getUserDetail();
        const projectData: any = [...projectList];
        setDisabled(false);
        // if (projectData?.length > 0) {
        projectData?.push({
          ...newProject.data,
          project_id: newProject?.data?.id,
        });
        dispatch(updateProjectList(projectData));
        handleToggle();
        const path = clientId
          ? `projects/${newProject?.data?.id}/${newProject?.data?.name}?ci=${clientId}`
          : `projects/${newProject?.data?.id}/${newProject?.data?.name}`;

        navigation(path);
        // }

        let columnListLocal = localStorage.getItem("columnList");
        const activeUserColumnData = columnListLocal
          ? JSON.parse(columnListLocal)
          : null;
        const prevData = activeUserColumnData ? activeUserColumnData : null;
        let initialColumnList = localData.projects.map((project) => ({
          id: project.id,
          name: project.name,
          checked: true,
        }));
        initialColumnList = {
          ...prevData,
          [localData.uuid]: initialColumnList,
        };
        localStorage.setItem("columnList", JSON.stringify(initialColumnList));
      }
    } catch (error) {
      setDisabled(false);

      console.error("Error fetching data:", error);
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

  const handleSave = () => {
    if (!checkedPrivate && selectedAgents.length == 0) {
      formik.handleSubmit();
    } else if (checkedPrivate && selectedAgents?.length > 0) {
      formik.handleSubmit();
    } else if (checkedPrivate && selectedAgents.length == 0) {
      setFocused(true);
    } else if (!checkedPrivate && selectedAgents?.length > 0) {
      setSelectedAgents([]);
      formik.handleSubmit();
    }
  };

  const handleToggle = () => {
  
    setIsOpen(false);
    setSelectedAgents([]);
    setCheckedPrivate(false);
    formik.resetForm(); // Reset form values when closing the modal
    setFocused(false);
  };

  const handleChecked = (e) => {
    setCheckedPrivate(e.target.checked);
    setFocused(false);
  };

  const handleAgentSelect = (agentId) => {
    setSelectedAgents((prevSelectedAgents) => {
      if (prevSelectedAgents.includes(agentId)) {
        // Remove agent if already selected
        const updatedAgents = prevSelectedAgents.filter((id) => id !== agentId);

        // Check if the selection becomes empty after removal
        if (updatedAgents.length === 0) {
          setSelectedAgent("Select");
        }

        return updatedAgents;
      } else {
        // If not selected, add the agent to the list
        return [...prevSelectedAgents, agentId];
      }
    });
  };
  const handleDelete = (agentId) => {
    handleAgentSelect(agentId); // Modify your handleAgentSelect function to handle deselecting an agent
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
      setSelectedAgents(agentMenuData.map((item) => item.agent_id));
    }
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={handleToggle}
      modalTitle="Add Project"
      maxWidth="314"
      btnTitle="Save"
      closeTitle="Cancel"
      headerBgColor="white"
      bgColor="white"
      titleColor="black"
      onSubmit={handleSave}
      disabled={disable}
      border={true}
    >
      <InputField
        formik={formik}
        name="name"
        label="Project Name"
        value={formik.values.name}
        placeholder="Enter Project Name"
        className="input-color"
        onClick={(e) => e.stopPropagation()}
      />
      {userId.role_id == 2 && (
        <Box className="flex gap-5 ">
          <Checkbox
            onClick={(e) => {
              e.stopPropagation();
              handleChecked(e);
            }}
            className="h-30 w-30 hover:bg-transparent"
          />
          <Typography className="text-[#757982] text-14 ">
            Private project to you and selected agents and users
          </Typography>
        </Box>
      )}
      {checkedPrivate && userId.role_id == 2 && (
        <FormLabel className="block text-[16px] font-medium text-[#111827] ">
          Assigned To
          <DropdownMenu
            anchorEl={AgentMenu}
            handleClose={() => {
              setFilterMenu((prevFilters) => ({
                ...prevFilters,
                search: "",
              }));
              // setFocused(true);
              setAgentMenu(null);
            }}
            button={
              <div
                className="relative"
                onClick={(event) => {
                  setAgentMenu(event.currentTarget);
                }}
              >
                <div
                  className="flex gap-2 justify-between mt-4 bg-bgGrey px-8 rounded-8 h-[48px] "
                  style={{ alignItems: "center" }}
                >
                  <div className="flex gap-2 justify-left w-[95%] overflow-x-auto   ">
                    {selectedAgents?.length > 0 ? (
                      selectedAgents?.map((agentId) => {
                        const agent = agentMenuData?.find(
                          (item) => item?.agent_id == agentId
                        );
                        return (
                          <Chip
                            avatar={
                              agent?.user_image ? (
                                <img
                                  src={urlForImage + agent?.user_image}
                                  alt=""
                                  className="h-[30px] w-[30px] rounded-full"
                                />
                              ) : (
                                <img
                                  src="../assets/images/logo/images.jpeg"
                                  alt=""
                                />
                              )
                            }
                            key={agentId}
                            label={agent?.first_name || "Unknown"}
                            onDelete={() => handleDelete(agentId)}
                            sx={{
                              margin: "4px",
                              color: "#000",
                              background: "#00000014",
                              "& .MuiChip-deleteIcon": {
                                color: "grey", // Change icon color to grey
                                backgroundColor: "#f0f0f0", // Set background color for the delete icon
                                borderRadius: "50%", // Make the background circular
                              },
                              "& .MuiChip-deleteIcon:hover": {
                                color: "grey", // Change icon color to grey
                                backgroundColor: "#f0f0f0",
                              },
                            }}
                          />
                        );
                      })
                    ) : (
                      <p className="bg-bgGrey text-para_light text-[16px]">
                        Select
                      </p>
                    )}
                  </div>
                  {!AgentMenu ? <DownArrowBlank /> : <UpArrowBlank />}
                  {/* </Paper> */}
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
            <div className="p-20">
              {/* Only show the input field and agent list when dropdown is open */}
              {AgentMenu && (
                <>
                  <div className="relative w-full mt-10 mb-3 sm:mb-0">
                    <TextField
                      name={"agent"}
                      placeholder={"Search Assignee"}
                      sx={{
                        "& .MuiInputBase-root": {
                          background: "#f6f6f6",
                          paddingX: "10px !important",
                          color: "#000 !important",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleSearchChange}
                    />
                    <div className="max-h-[200px] w-full overflow-y-auto shadow-sm cursor-pointer">
                      {filterMenu?.search === "" && (
                        <label className="flex items-center gap-10 px-20 w-full">
                          <div>
                            <Checkbox
                              className="hover:bg-transparent"
                              checked={
                                selectedAgents?.length === agentMenuData?.length
                              }
                              onChange={handleSelectAllAgents}
                            />
                          </div>

                          <span>All</span>
                        </label>
                      )}
                      {agentMenuData?.map((item) => (
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
                              className="d-none hover:bg-transparent "
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
                </>
              )}
            </div>
          </DropdownMenu>
        </FormLabel>
      )}

      {(focused && selectedAgents.length == 0) ? (
        <p className="text-red-500">
          At least one agent or user must be selected.
        </p>
      ) : null}
    </CommonModal>
  );
}

export default AddProjectModal;
