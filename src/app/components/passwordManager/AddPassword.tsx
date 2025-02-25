import ListLoading from "@fuse/core/ListLoading";
import {
  Checkbox,
  Chip,
  FormLabel,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import { GetAssignAgentsInfo } from "app/store/Client";
import {
  UpdatePassword,
  addPassword,
  getEditPasswordDetail,
} from "app/store/Password";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import {
  DownArrowBlank,
  UpArrowBlank,
} from "public/assets/icons/dashboardIcons";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PasswordValidation } from "src/formSchema";
import { Role, getUserDetail } from "src/utils";
import CommonModal from "../CommonModal";
import DropdownMenu from "../Dropdown";
import InputField from "../InputField";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchPasswordList: any;
  id: any;
  isEditing?: boolean;
  setId: any;
}

interface IPropsAssignedTo {
  name: string;
  image: string;
}

function AddPassword({
  isOpen,
  setIsOpen,
  fetchPasswordList,
  id,
  setId,
  isEditing,
}: IProps) {
  const theme = useTheme();
  const [allSelected, setAllSelected] = useState(false);
  const userId = getUserDetail();
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("Select");
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: userId.id,
    is_user: 1,
  });
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    formik.resetForm();
    setSelectedAgent("Select");
    setSelectedAgents([]);
    setId("");
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: PasswordValidation,
    onSubmit: (values) => {
      if (id) {
        handleEditSave(values);
        handleCancel();
      } else {
        handleSave(values);
        handleCancel();
      }
    },
  });

  const handleAssignedToAll = () => {
    if (allSelected) {
      formik.setFieldValue("assigned_to", []);
    } else {
      formik.setFieldValue(
        "assigned_to",
        agentMenuData.map((value) => value.name)
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
        setAgentMenuData(res?.payload?.data?.data?.list);
      });
    }
  }, [filterMenu.search, isOpen]);

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

  const handleSave = async (data) => {
    setDisable(true);

    const payload = {
      site_name: data.name,
      user_name: data.email,
      password: data.password,
      agent_ids: selectedAgents,
    };
    const res = await dispatch(addPassword(payload));
    if (res?.payload?.data?.status) {
      toast.success(res?.payload?.data?.message);
      fetchPasswordList();
      setDisable(false);
      setIsOpen(false);
    } else {
      setDisable(false);

      setIsOpen(false);
    }
  };

  const fetchDetails = async (id) => {
    const res = await dispatch(getEditPasswordDetail(id));
    const data = res?.payload?.data?.data;
    formik.setFieldValue("name", data?.site_name);
    formik.setFieldValue("email", data?.user_name);
    formik.setFieldValue("password", data?.password);
    const userNames = data?.password_assigned_agent?.map(
      (user) => user.first_name
    );
    const userId = data?.password_assigned_agent.map((user) => user.agent_id);
    // setSelectedAgent(userNames.join(", "));
    if (data?.password_assigned_agent?.length == 0) {
      setSelectedAgent("Select");
    }
    setSelectedAgents(userId);
  };

  const handleEditSave = async (data) => {
    setLoading(true);
    const payload = {
      password_manager_id: id,
      site_name: data.name,
      user_name: data.email,
      password: data.password,
      agent_ids: selectedAgents,
    };
    const res = await dispatch(UpdatePassword(payload));

    if (res?.payload?.data?.status) {
      toast.success(res?.payload?.data?.message);
      fetchPasswordList();
      setLoading(false);
      setIsOpen(false);
    } else {
      setLoading(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [isOpen]);

  const handleDelete = (agentId) => {
    handleAgentSelect(agentId); // Modify your handleAgentSelect function to handle deselecting an agent
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        handleCancel();
        setIsOpen((prev) => !prev);
      }}
      modalTitle={id ? "Edit Password" : "Add Password"}
      maxWidth="733"
      btnTitle="Save"
      closeTitle="Cancel"
      onSubmit={formik.handleSubmit}
      disabled={disable || loading}
    >
      {disable ? (
        <ListLoading />
      ) : (
        <div className="flex flex-col gap-20 mb-20">
          <InputField
            formik={formik}
            name="name"
            label="Site Name"
            placeholder="Enter Site Name"
          />
          <InputField
            formik={formik}
            name="email"
            label="User Name"
            placeholder="Enter User Name"
          />
          <InputField
            formik={formik}
            name="password"
            label="Password"
            placeholder="Enter Password"
            sx={{
              ".MuiInputBase-input": {
                paddingRight: "34px",
              },
            }}
          />

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
                              sx={{ margin: "4px" }}
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
                            <Checkbox
                              checked={
                                selectedAgents?.length === agentMenuData?.length
                              }
                              onChange={handleSelectAllAgents}
                              className="hover:!bg-transparent"
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
                                className="d-none hover:bg-transparent"
                                checked={selectedAgents?.includes(
                                  item.agent_id
                                )}
                                onChange={() =>
                                  handleAgentSelect(item.agent_id)
                                }
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
        </div>
      )}
    </CommonModal>
  );
}

export default AddPassword;
