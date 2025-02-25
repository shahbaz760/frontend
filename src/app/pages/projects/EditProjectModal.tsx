import {
  Box,
  Checkbox,
  Chip,
  FormLabel,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { GetAssignAgentsInfo } from "app/store/Client";
import {
  projectDetail,
  projectUpdate,
  updateProjectList,
} from "app/store/Projects";
import { ProjectRootState, ProjectUpdate } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { DownFillArrow } from "public/assets/icons/common";
import { DownArrowBlank } from "public/assets/icons/dashboardIcons";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CommonModal from "src/app/components/CommonModal";
import DropdownMenu from "src/app/components/Dropdown";
import InputField from "src/app/components/InputField";
import { Role, getClientId, getUserDetail } from "src/utils";
import * as Yup from "yup";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  projectData: {
    project_assignees?: any[];
    is_private?: any;
    name: string;
    id: string | number;
  };
}

function EditProjectModal({ isOpen, setIsOpen, projectData }: IProps) {
  const [disable, setDisable] = useState(false);
  const dispatch = useAppDispatch();
  const userId = getUserDetail();
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const [checkedPrivate, setCheckedPrivate] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("Select");
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const { projectList } = useSelector(
    (store: ProjectRootState) => store.project
  );
  const is_private = projectList?.find(
    (item) => item.id == projectData.id
  )?.is_private;
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: userId.id,
    is_user: 1,
    project_id: is_private == 1 ? projectData.id : 0,
  });
  useEffect(() => {
    if (isOpen) {
      dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
        setAgentMenuData(res?.payload?.data?.data?.list);
      });
    }
  }, [filterMenu.search, isOpen]);

  const fetchData = async (data: any) => {
    setDisable(true);
    const id = projectData.id;
    const payload = {
      name: data?.data?.name,
      is_private: checkedPrivate ? 1 : 0,
      assign_users: selectedAgents,
    };
    try {
      const res = await dispatch(projectUpdate({ payload, id }));
      setDisable(false);
      if (res?.payload?.data.status === 1) {
        const newProject = res?.payload?.data;
        let localData = getUserDetail();
        let projectDataList: any = [...projectList];

        if (projectDataList?.length > 0) {
          const updateProjectIndex = projectDataList?.findIndex(
            (item) => item.id === data.project_id
          );
          projectDataList[updateProjectIndex] = {
            ...newProject.data,
            project_id: newProject.data.id,
          };
          dispatch(updateProjectList(projectDataList));
          handleToggle();
        }

        if (localData) {
          // Update localData with the new project data
          const updateProjectIndex = localData.projects.findIndex(
            (item) => item.id === data.project_id
          );
          localData.projects[updateProjectIndex] = newProject.data;

          // Update localStorage with updated localData
          const clientId = getClientId();
          const dataKey = clientId ? `${clientId}userDetail` : "userDetail";
          localStorage.setItem(dataKey, JSON.stringify(localData));

          // Update columnList in localStorage with updated userDetails.projects
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
          // Reset form, reload window, and close modal
          formik.resetForm();

          setIsOpen(false);
        }
      }
    } catch (error) {
      setDisable(false);
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
      fetchData({ project_id: projectData.id, data: values });
    },
  });

  const handleSave = () => {
    if (!checkedPrivate && selectedAgents?.length == 0) {
      formik.handleSubmit();
    } else if (checkedPrivate && selectedAgents?.length > 0) {
      formik.handleSubmit();
    } else if (checkedPrivate && selectedAgents?.length == 0) {
      setFocused(true);
    } else if (!checkedPrivate && selectedAgents?.length > 0) {
      setSelectedAgents([]);
      formik.handleSubmit();
    }
  };

  useEffect(() => {
    formik.setFieldValue("name", projectData?.name);
    setCheckedPrivate(projectData?.is_private ? true : false);
    setSelectedAgents(
      (projectData?.project_assignees?.length > 0 &&
        projectData?.project_assignees?.map((item) => item.user_id)) ||
      []
    );
  }, [projectData]);

  const handleToggle = () => {
    formik.setFieldValue("name", projectData?.name);
    setIsOpen((prev) => !prev);
    setFocused(false);
  };

  const handleChecked = (e) => {
    setCheckedPrivate(e.target.checked);
    setFocused(false);
  };

  const handleAgentSelect = (agentId) => {
    setFocused(false);
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

  const details = async () => {
    await dispatch(projectDetail(projectData.id));
  };

  useEffect(() => {
    if (isOpen) {
      details();
    }
  }, [projectData.id, isOpen]);

  return (
    <CommonModal
      open={isOpen}
      handleToggle={handleToggle}
      modalTitle="Edit Project"
      maxWidth="314"
      btnTitle="Save"
      closeTitle="Cancel"
      headerBgColor="#ffff"
      bgColor="#ffff  "
      titleColor="black"
      onSubmit={handleSave}
      disabled={disable}
    >
      <InputField
        formik={formik}
        name="name"
        label="Project Name"
        value={formik.values.name}
        placeholder="Enter Project Name"
        className="input-color"
        onChange={(e) => formik.setFieldValue("name", e.target.value)}
      />
      {userId.role_id == 2 && (
        <Box className="flex gap-5 ">
          <Checkbox
            onClick={(e) => {
              e.stopPropagation();
              handleChecked(e);
            }}
            checked={checkedPrivate}
            className="h-30 w-30 hover:!bg-transparent"
          />
          <Typography className="text-[#757982] text-14">
            Private project to you and selected agents and users
          </Typography>
        </Box>
      )}
      {checkedPrivate && userId.role_id == 2 && (
        <div>
          <FormLabel className="block text-[16px] font-medium text-[#111827] ">
            Assigned To
          </FormLabel>
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
                className="relative"
                onClick={(event) => setAgentMenu(event.currentTarget)}
              >
                <div
                  className="flex gap-2 justify-between mt-4 bg-bgGrey px-8 rounded-8 h-[48px] "
                  style={{ alignItems: "center" }}
                >
                  <div className="flex gap-2 justify-left w-[95%] overflow-x-auto   ">
                    {selectedAgents.length > 0 ? (
                      selectedAgents?.map((agentId) => {
                        const agent = agentMenuData.find(
                          (item) => item.agent_id == agentId
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
                          width: "100%",
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
                        <label className="flex items-center gap-10 px-20 w-full ">
                          <Checkbox
                            className=""
                            checked={
                              selectedAgents?.length === agentMenuData?.length
                            }
                            onChange={handleSelectAllAgents}
                            sx={{
                              "&:hover": {
                                backgroundColor: "transparent", // No hover background globally
                              },
                            }}
                          />

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
                              className="d-none"
                              checked={selectedAgents?.includes(item.agent_id)}
                              onChange={() => handleAgentSelect(item.agent_id)}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "transparent", // No hover background globally
                                },
                              }}
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
        </div>
      )}
      {(focused && selectedAgents.length == 0) ? (
        <p className="text-red-500">
          At least one agent or user must be selected.
        </p>
      ) : null}
    </CommonModal>
  );
}

export default EditProjectModal;
