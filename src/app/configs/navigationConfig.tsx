import { FuseNavItemType } from "@fuse/core/FuseNavigation/types/FuseNavItemType";
import i18next from "i18next";
import {
  AccountManagerIcon,
  AgentGroupIcon,
  AgentNavIcon,
  BillingIcon,
  ChatBoardIcon,
  ChurnNavIcon,
  ClientNavIcon,
  DashBoardIcon,
  DeleteIcon,
  EditIcon,
  FinancialNavIcon,
  KeywordIcon,
  ManageProductIcon,
  MyAgentIcon,
  PasswordManagerIcon,
  ProjectIcon,
  ReportIcon,
  RoleIcon,
  RetentionNavIcon,
  SettingIcon,
  SettingNavIcon,
  SharedFileIcon,
  SubProjectIcon,
  SupportIcon,
  UserIcon,
  CustomerNavIcon,
  MrrNavIcon,
  GrowthNavIcon,
  FinancialReportIcon,
  DepartmentIcon,
  SubscriptionIcon,
  TwoFAIcon,
  SubProjectIconActive,
  IntegrationIcon,
  AiToolsIcon,
} from "public/assets/icons/navabarIcon";
import { getClientId, getcolumnListDetails, getUserDetail } from "src/utils";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import FuseNavItem from "@fuse/core/FuseNavigation/FuseNavItem";
import DeleteProject from "../pages/projects/DeleteProject";
import EditProjectModal from "../pages/projects/EditProjectModal";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "app/store/store";
import {
  AccessAccountManagerList,
  deleteProject,
  projectList,
  projectMove,
  setCondition,
  setFilter,
  setFilterData,
  setMainOp,
  setSortFilter,
  updateProjectList,
} from "app/store/Projects";
import clsx from "clsx";
import {
  Button,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { ProjectNavIcon } from "public/assets/icons/projectsIcon";
import { useSelector } from "react-redux";
import { ProjectRootState } from "app/store/Projects/Interface";
import toast from "react-hot-toast";
import {
  navbarEditModelCloseMobile,
  navbarEditModelOpenMobile,
} from "app/theme-layouts/shared-components/navbar/store/navbarSlice";
import { ProjectLock } from "public/assets/icons/common";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

type ListItemButtonStyleProps = ListItemButtonProps & {
  itempadding: number;
};

const Root = styled(ListItemButton)<ListItemButtonStyleProps>(
  ({ theme, ...props }) => ({
    minHeight: 44,
    width: "100%",
    // borderRadius: "6px",
    margin: "0 0 4px 0",
    paddingRight: 16,
    paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
    paddingTop: 10,
    paddingBottom: 10,
    color: alpha(theme.palette.text.primary, 1),
    cursor: "pointer",
    textDecoration: "none!important",
    "&.inside": {
      opacity: 0.5,
      backgroundColor: "transparent !important",
    },
    "&:hover": {
      // color: "white",
      // opacity: 1,
    },
    "&.active": {
      color: "theme.palette.text.primary",
      // backgroundColor: "#393F4C",
      // pointerEvents: "none",
      transition: "border-radius .15s cubic-bezier(0.4,0.0,0.2,1)",
      "& > .fuse-list-item-text-primary": {
        color: "inherit",
      },
      opacity: 1,
      "& > .fuse-list-item-icon": {
        color: "inherit",
      },
    },
    "& >.fuse-list-item-icon": {
      marginRight: 16,
      color: "inherit",
    },
    "& > .fuse-list-item-text": {},
  })
);
const userDetails = getUserDetail();

const GetProjectNavItems = () => {
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [deleteid, setDeleteId] = useState<number | string>("");
  const userDetail = getUserDetail();
  const navigate = useNavigate();
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const clientId = getClientId();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const project = useSelector((store: ProjectRootState) => store.project);
  const [allProjectList, setAllProjectList] = useState<any>([]);
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    name: string;
    is_private: string;
    project_assignees: any[];
  }>({ id: "", name: "", is_private: "", project_assignees: [] });
  const location = useLocation(); // Get the location object
  const pathname = location.pathname; // Access the pathname
  const path = pathname.split("/");
  // handle click to open three dot pop-up
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    dispatch(navbarEditModelOpenMobile());
  };

  const handleClose = (event: any) => {
    dispatch(navbarEditModelCloseMobile());
    setAnchorEl(null);
  };
  const storedColumnList = getcolumnListDetails();
  const onDelete = async () => {
    setDisable(true);
    try {
      const res = await dispatch(
        deleteProject({ project_id: deleteid })
      ).unwrap();
      if (res?.data?.status === 1) {
        setDisable(false);
        const localData = getUserDetail();
        let projectsData = project.projectList;
        if (project.projectList?.length > 0) {
          // Filter out the deleted project from project.projects
          const updatedProjects = project.projectList.filter(
            (item) => item.id !== deleteid
          );
          dispatch(updateProjectList(updatedProjects));

          // Update localStorage with updated project\
        }
        let columnListLocal = localStorage.getItem("columnList");
        const activeUserColumnData = columnListLocal
          ? JSON.parse(columnListLocal)
          : null;
        const prevData = activeUserColumnData ? activeUserColumnData : null;
        // let initialColumnList = project?.projectList?.map((project) => ({
        //   id: project.id,
        //   name: project.name,
        //   checked: true, // Set all projects checked initially
        // }));
        const updatedProjectList = project?.projectList.map((project) => {
          const storedProject =
            storedColumnList.length > 0 &&
            storedColumnList?.find((stored) => stored.id == project.id);
          return {
            ...project,
            checked: storedProject ? storedProject.checked : true, // Set checked from storedList or default to true
          };
        });

        // Set initial column list based on updated project list
        let initialColumnList = updatedProjectList.map((project) => ({
          id: project.id,
          name: project.name,
          checked: project.checked,
        }));
        initialColumnList = {
          ...prevData,
          [localData.uuid]: initialColumnList,
        };
        localStorage.setItem("columnList", JSON.stringify(initialColumnList));
        setIsOpenDeletedModal(false);
        if (deleteid == path[2]) {
          // Navigate and reload window
          // navigate(clientId ? "/dashboard" + `?ci=${clientId}` : "/");
          //  --*** for all project delete----***
          navigate(clientId ? "/dashboard" + `?ci=${clientId}` : "/");
        }
      }
    } catch (error) {
      setDisable(false);
      // console.error("Error deleting project:", error);
    }
  };
  const component = NavLinkAdapter;

  useEffect(() => {
    try {
      dispatch(
        projectList({
          start: 0,
          limit: -1,
          search: "",
        })
      );
    } catch (error) {
      toast.error(error);
    }
  }, []);

  useEffect(() => {
    setAllProjectList([...project?.projectList]);
  }, [project.projectList, isOpenEditModal]);

  const moveProject = async (payload: { project_ids: any }) => {
    try {
      const res = await dispatch(projectMove(payload));
      // callListApi(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  AccountManagerIcon;
  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const newItems = allProjectList;
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);

    const allitems = newItems;
    let userDetail = JSON.parse(localStorage.getItem("userDetail"));

    // Extract id and name (title) and add user_id from userDetail
    let extractedProjects = newItems?.map((project) => ({
      id: project.id,
      name: project.title,
      user_id: userDetail.id,
      project_assignees: project?.project_assignees || [],
    }));
    let extractedProjectsids = newItems?.map((project) => project.id);
    userDetail.projects = extractedProjects;

    // Step 4: Convert the updated object back to a JSON string
    let updatedUserDetail = JSON.stringify(userDetail);

    // Step 5: Store the updated object back in localStorage
    localStorage.setItem("userDetail", updatedUserDetail);
    setAllProjectList(allitems);
    const payload = {
      project_ids: extractedProjectsids,
    };
    await moveProject(payload);
  };

  const checkIsActive = (id) => {
    return path.includes(`${id}`);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable-collapse">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className=""
            >
              {allProjectList &&
                allProjectList.length > 0 &&
                allProjectList?.map((_item, index) => (
                  <Draggable
                    key={_item.id}
                    draggableId={_item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Root
                          component={component}
                          className={clsx(
                            `fuse-list-item ${checkIsActive(_item?.id) ? "active text-white" : ""} text-[#9DA0A6]`
                          )}
                          itempadding={38 + 1 * 16}
                          //@ts-ignore
                          to={
                            clientId
                              ? `projects/${
                                  userDetail?.role_id == 2
                                    ? _item.id
                                    : _item.project_id
                                }/${_item.name}` + `/?ci=${clientId}`
                              : `projects/${
                                  userDetail?.role_id == 2
                                    ? _item.id
                                    : _item.project_id
                                }/${_item.name}` || ""
                          }
                          role={"button"}
                        >
                          <div>
                            <span
                              className={clsx(
                                "shrink-0 inline-block mr-16 mt-[8px] relative"
                              )}
                            >
                              {_item?.is_private ? (
                                <span className="absolute -left-[10px] -top-[10px]">
                                  <ProjectLock />
                                </span>
                              ) : null}
                              {checkIsActive(_item?.id) ? (
                                <SubProjectIconActive />
                              ) : (
                                <SubProjectIcon />
                              )}
                              {/* <SubProjectIcon />
                              <SubProjectIconActive /> */}
                            </span>
                          </div>

                          <ListItemText
                            className="fuse-list-item-text capitalize"
                            primary={_item?.name}
                            classes={{
                              primary:
                                "text-13 font-medium fuse-list-item-text-primary truncate capitalize",
                              secondary:
                                "text-11 font-medium fuse-list-item-text-secondary leading-normal truncate capitalize",
                            }}
                          />
                          {/*  */}

                          {(userDetail?.role_id == 2 ||
                            (userDetail?.role_id === 5 &&
                              !_item?.is_private)) && (
                            <Button
                              onClick={(e) => {
                                const editData = {
                                  id: _item?.id,
                                  name: _item?.name,
                                  is_private: _item?.is_private,
                                  project_assignees:
                                    _item?.project_assignees || [],
                                };
                                setSelectedProject(editData);
                                setDeleteId(_item?.id);
                                e.stopPropagation(); // Stop propagation to prevent route change
                                e.preventDefault(); // Prevent default navigation behavior
                                handleClick(e);
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
                              // onMouseLeave={(e) =>
                              //   (e.currentTarget.style.background = "tr")
                              // }
                              style={{
                                position: "relative",
                                zIndex: 11,
                                // background: "red",
                              }}
                            >
                              <ProjectNavIcon
                                className="threeDots-icon"
                                color="inherit"
                              />
                            </Button>
                          )}
                          <Popover
                            id={`${index + 1}`}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleClose(e);
                            }}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            sx={{
                              "& .MuiPopover-paper": {
                                boxShadow: "none !important",
                              },
                              "& .MuiPopover-paper ": {
                                background: "transparent !important",
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                p: 2,
                                py: 1,
                                backgroundColor: "white",
                                color: "black",
                                width: "164px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "#f0f0f0",
                                },
                              }}
                              className="text-[16px] font-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsOpenEditModal(true);
                                handleClose(e);
                              }}
                            >
                              Edit <EditIcon fill={"#757982"} />
                            </Typography>

                            <div
                              onClick={(e) => {
                                setIsOpenDeletedModal(true);
                                e.stopPropagation(); // Stop propagation to prevent route change
                                e.preventDefault(); // Prevent default navigation behavior
                                handleClose(e);
                              }}
                            >
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  backgroundColor: "white",
                                  color: "black",
                                  width: "164px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                  },
                                }}
                                className="text-[16px] font-500"
                              >
                                Delete <DeleteIcon />
                              </Typography>
                            </div>
                          </Popover>
                        </Root>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <DeleteProject
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={onDelete}
        disable={disable}
      />

      <EditProjectModal
        isOpen={isOpenEditModal}
        setIsOpen={setIsOpenEditModal}
        projectData={selectedProject}
      />
    </>
  );
};

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */

export const ClientNoNavigationConfig: FuseNavItemType[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "DASHBOARD",
    type: "item",
    icon: "dashboard",
    customIcon: <DashBoardIcon />,
    url: "dashboard",
  },
  {
    id: "billings",
    title: "Billings",
    translate: "BILLINGS",
    type: "item",
    icon: "heroicons-outline:cash",
    customIcon: <BillingIcon />,

    url: "billings",
  },
  {
    id: "support",
    title: "Support",
    translate: "SUPPORT",
    type: "item",
    icon: "heroicons-outline:question-mark-circle",
    customIcon: <SupportIcon />,

    url: "support",
  },
];

const navigationConfig: FuseNavItemType[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "DASHBOARD",
    type: "item",
    icon: "heroicons-outline:template",
    customIcon: <DashBoardIcon />,
    url: "dashboard",
  },
  {
    id: "projects",
    title: "Projects",
    translate: "Projects",
    type: "collapse",
    icon: "heroicons-outline:list",
    customIcon: <ProjectIcon />,
    // children: getProjectNavItems(),
    customChildren: userDetails.is_signed == 1 ? <GetProjectNavItems /> : [],
  },

  {
    id: "chatBoard",
    title: "Chat Board",
    translate: "CHAT_BOARD",
    type: "item",
    icon: "heroicons-outline:chat-alt-2",
    customIcon: <ChatBoardIcon />,
    url: "chat-board",
  },
  {
    id: "aitools",
    title: "Ai Tools",
    translate: `AI_Tools`,
    type: "item",
    icon: "heroicons-outline:user-group",
    customIcon: <AiToolsIcon />,
    url: "",
  },

  {
    id: "sharedFiles",
    title: "Shared Files",
    translate: "SHARED_FILES",
    type: "item",
    icon: "heroicons-outline:external-link",
    customIcon: <SharedFileIcon />,
    url: "shared-files",
  },
  {
    id: "passwordManager",
    title: "Password Manager",
    translate: "PASSWORD_MANAGER",
    type: "item",
    icon: "heroicons-outline:lock-closed",
    customIcon: <PasswordManagerIcon />,
    url: "password-manager",
  },
  {
    id: "myAgents",
    title: "My Agents",
    translate: "MY_AGENTS",
    type: "item",
    icon: "heroicons-outline:user-group",
    customIcon: <MyAgentIcon />,

    url: "my-agents",
  },

  {
    id: "users",
    title: "Users",
    translate: "USERS",
    type: "item",
    icon: "heroicons-outline:users",
    customIcon: <UserIcon />,
    url: "users",
  },

  {
    id: "integration",
    title: "Integration",
    translate: "Integration",
    type: "item",
    icon: "heroicons-outline:users",
    customIcon: <IntegrationIcon />,
    url: "integration",
  },
  {
    id: "settings",
    title: "Settings",
    type: "collapse",
    hideOption: true,
    icon: "Settings",
    customIcon: <SettingIcon />,
    children: [
      {
        id: "Roles_and_Permissions",
        title: "Roles and Permissions",
        type: "item",
        icon: "material-twotone:compress",
        url: "settings",
        customIcon: <RoleIcon />,
        end: true,
      },
      {
        id: "Reminder",
        title: "Reminder",
        type: "item",
        icon: "material-twotone:compress",
        url: "settings/reminder",
        customIcon: <ChurnNavIcon />,
        end: true,
      },
    ],
  },
  {
    id: "billings",
    title: "Billings",
    translate: "BILLINGS",
    type: "item",
    icon: "heroicons-outline:cash",
    customIcon: <BillingIcon />,
    url: "billings",
  },
  {
    id: "support",
    title: "Support",
    translate: "SUPPORT",
    type: "item",
    icon: "heroicons-outline:question-mark-circle",
    customIcon: <SupportIcon />,
    url: "support",
  },
];

export const agentNavigationConfig: FuseNavItemType[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "DASHBOARD",
    type: "item",
    icon: "heroicons-outline:template",
    customIcon: <DashBoardIcon />,
    url: "agent/dashboard",
  },
  {
    id: "projects",
    title: "Projects",
    translate: "Projects",
    type: "collapse",
    icon: "heroicons-outline:list",
    customIcon: <ProjectIcon />,
    // children: getProjectNavItems(),
    customChildren: <GetProjectNavItems />,
  },

  // {
  //   id: "task",
  //   title: "Task",
  //   translate: "TASK",
  //   type: "item",
  //   icon: "heroicons-outline:clipboard-check",
  //   customIcon: <TaskIcon />,
  //   url: "tasks",
  // },

  {
    id: "chatBoard",
    title: "Chat Board",
    translate: "CHAT_BOARD",
    type: "item",
    icon: "heroicons-outline:chat-alt-2",
    customIcon: <ChatBoardIcon />,
    url: "chat-board",
  },

  {
    id: "sharedFiles",
    title: "Shared Files",
    translate: "SHARED_FILES",
    type: "item",
    icon: "heroicons-outline:external-link",
    customIcon: <SharedFileIcon />,
    url: "shared-files",
  },
  {
    id: "integration",
    title: "Integration",
    translate: "Integration",
    type: "item",
    icon: "heroicons-outline:users",
    customIcon: <IntegrationIcon />,
    url: "integration",
  },
  {
    id: "passwordManager",
    title: "Password Manager",
    translate: "PASSWORD_MANAGER",
    type: "item",
    icon: "heroicons-outline:lock-closed",
    customIcon: <PasswordManagerIcon />,
    url: "password-manager",
  },
];

export const adminNavigationConfig: FuseNavItemType[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "DASHBOARD",
    type: "item",
    icon: "dashboard",
    customIcon: <DashBoardIcon />,
    url: "admin/dashboard",
  },
  {
    id: "Reports",
    title: "Reports",
    type: "collapse",
    hideOption: true,
    icon: "Reports",
    customIcon: <ReportIcon />,
    children: [
      {
        id: "financial_report",
        title: "Financial Report",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/financial-report",
        customIcon: <FinancialReportIcon />,
        end: true,
      },
      {
        id: "churn_overview",
        title: "Churn Overview",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/financial-report/churn-overview",
        customIcon: <ChurnNavIcon />,
        end: true,
      },
      {
        id: "retention_rate",
        title: "Retention Rate",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/financial-report/retention-rate",
        customIcon: <RetentionNavIcon />,
        end: true,
      },
      {
        id: "customer_overview",
        title: "Customer Overview",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/financial-report/customer_overview",
        customIcon: <CustomerNavIcon />,
        end: true,
      },
      {
        id: "growth_rate",
        title: "Growth Rate",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/financial-report/growth_rate",
        customIcon: <GrowthNavIcon />,
        end: true,
      },
      {
        id: "mrr_overview",
        title: "MRR Overview",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/financial-report/mrr_overview",
        customIcon: <MrrNavIcon />,
        end: true,
      },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    translate: "Clients",
    type: "item",
    icon: "dashboard",
    customIcon: <ClientNavIcon />,
    url: "admin/client",
  },
  {
    id: "products",
    title: "Manage Products",
    type: "item",
    icon: "dashboard",
    customIcon: <ManageProductIcon />,
    url: "admin/manage-products",
  },

  {
    id: "agents",
    title: "Agents",
    translate: "Agents",
    type: "collapse",
    hideOption: true,
    icon: "agents",
    customIcon: <AgentNavIcon />,
    children: [
      {
        id: "agents_list",
        title: "Agents",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/agents/list",
        customIcon: <AgentNavIcon />,
        end: true,
      },
      {
        id: "agentsGroup",
        title: "Agents Group",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/agents/groups",
        customIcon: <AgentGroupIcon />,
        end: true,
      },
    ],
  },
  {
    id: "accountManager",
    title: "Admin User",
    type: "item",
    icon: "billing",
    customIcon: <AccountManagerIcon />,
    url: "admin/acc-manager",
  },
  {
    id: "chatBoard",
    title: "Chat Board",
    type: "item",
    icon: "heroicons-outline:chat-alt-2",
    customIcon: <ChatBoardIcon />,
    url: "chat-board",
  },
  {
    id: "keywords",
    title: "Keywords",
    type: "item",
    icon: "heroicons-outline:chat-alt-2",
    customIcon: <KeywordIcon />,
    url: "keyword",
  },
  {
    id: "settings",
    title: "Settings",
    type: "collapse",
    hideOption: true,
    icon: "Settings",
    customIcon: <SettingIcon />,
    children: [
      {
        id: "Roles_and_Permissions",
        title: "Roles and Permissions",
        type: "item",
        icon: "material-twotone:compress",
        url: "admin/setting",
        customIcon: <RoleIcon />,
        end: true,
      },
      {
        id: "Subscriptions",
        title: "Subscriptions",
        type: "item",
        icon: "material-twotone:compress",
        url: "admin/setting/Subscription",
        customIcon: <SubscriptionIcon />,
        end: true,
      },
      {
        id: "Global Settings",
        title: "Global Settings",
        type: "item",
        icon: "material-twotone:compress",
        url: "admin/setting/2FA",
        customIcon: <TwoFAIcon />,
        end: true,
      },
    ],
  },

  {
    id: "department",
    title: "Departments",
    translate: "Departments",
    type: "item",
    icon: "heroicons-outline:question-mark-circle",
    customIcon: <DepartmentIcon />,
    url: "department",
  },
  {
    id: "faq",
    title: "faq",
    translate: "faq",
    type: "item",
    icon: "heroicons-outline:question-mark-circle",
    customIcon: <BillingIcon />,
    url: "faq",
  },
  {
    id: "support",
    title: "Support",
    translate: "SUPPORT",
    type: "item",
    icon: "heroicons-outline:question-mark-circle",
    customIcon: <SupportIcon />,
    url: "support",
  },
];

export const managerNavigationConfig: FuseNavItemType[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "DASHBOARD",
    type: "item",
    icon: "dashboard",
    customIcon: <DashBoardIcon />,
    url: "accountManager/dashboard",
  },
  {
    id: "Reports",
    title: "Reports",
    type: "collapse",
    hideOption: true,
    icon: "Reports",
    customIcon: <ReportIcon />,
    check: "is_report_access",
    children: [
      {
        id: "financial_report",
        title: "Financial Report",
        type: "item",
        icon: "material-twotone:compress",
        url: "/accountManager/financial-report",
        customIcon: <FinancialReportIcon />,
        end: true,
        check: "report_financial",
      },

      {
        id: "churn_overview",
        title: "Churn Overview",
        type: "item",
        icon: "material-twotone:compress",
        url: "/accountManager/financial-report/churn-overview",
        customIcon: <ChurnNavIcon />,
        end: true,
        check: "report_churn",
      },
      {
        id: "retention_rate",
        title: "Retention Rate",
        type: "item",
        icon: "material-twotone:compress",
        url: "/accountManager/financial-report/retention-rate",
        customIcon: <RetentionNavIcon />,
        end: true,
        check: "report_retantion",
      },
      {
        id: "customer_overview",
        title: "Customer Overview",
        type: "item",
        icon: "material-twotone:compress",
        url: "/accountManager/financial-report/customer_overview",
        customIcon: <CustomerNavIcon />,
        end: true,
        check: "report_customer",
      },
      {
        id: "growth_rate",
        title: "Growth Rate",
        type: "item",
        icon: "material-twotone:compress",
        url: "/accountManager/financial-report/growth_rate",
        customIcon: <GrowthNavIcon />,
        end: true,
        check: "report_growth",
      },
      {
        id: "mrr_overview",
        title: "MRR Overview",
        type: "item",
        icon: "material-twotone:compress",
        url: "/accountManager/financial-report/mrr_overview",
        customIcon: <MrrNavIcon />,
        end: true,
        check: "report_mmr",
      },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    translate: "Clients",
    type: "item",
    icon: "dashboard",
    customIcon: <ClientNavIcon />,
    url: "admin/client",
    check: "is_client_access",
  },
  {
    id: "products",
    title: "Manage Products",
    type: "item",
    icon: "dashboard",
    customIcon: <ManageProductIcon />,
    url: "admin/manage-products",
    check: "is_manage_products",
  },
  {
    id: "agents",
    title: "Agents",
    translate: "Agents",
    type: "collapse",
    hideOption: true,
    icon: "agents",
    customIcon: <AgentNavIcon />,
    check: "is_agents_list",

    children: [
      {
        id: "agents_list",
        title: "Agents",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/agents/list",
        customIcon: <AgentNavIcon />,
        end: true,
        check: "is_agent_access",
      },
      {
        id: "agentsGroup",
        title: "Agents Group",
        type: "item",
        icon: "material-twotone:compress",
        url: "/admin/agents/groups",
        customIcon: <AgentGroupIcon />,
        end: true,
        check: "is_agent_group_access",
      },
    ],
  },
  {
    id: "accountManager",
    title: "Admin User",
    type: "item",
    icon: "billing",
    customIcon: <AccountManagerIcon />,
    url: "admin/acc-manager",
    check: "is_admin_users",
  },
  {
    id: "chatBoard",
    title: "Chat Board",
    type: "item",
    icon: "heroicons-outline:chat-alt-2",
    customIcon: <ChatBoardIcon />,
    url: "chat-board",
    check: "is_chat",
  },
  {
    id: "keywords",
    title: "Keywords",
    type: "item",
    icon: "heroicons-outline:chat-alt-2",
    customIcon: <KeywordIcon />,
    url: "keyword",
    check: "is_keywords",
  },
  {
    id: "settings",
    title: "Settings",
    type: "collapse",
    hideOption: true,
    icon: "Settings",
    customIcon: <SettingIcon />,
    check: "is_settings",
    children: [
      {
        id: "Roles_and_Permissions",
        title: "Roles and Permissions",
        type: "item",
        icon: "material-twotone:compress",
        url: "admin/setting",
        customIcon: <RoleIcon />,
        end: true,
        check: "is_settings",
      },
      {
        id: "2FA",
        title: "Global Settings",
        type: "item",
        icon: "material-twotone:compress",
        url: "admin/setting/2FA",
        customIcon: <TwoFAIcon />,
        end: true,
        check: "is_settings",
      },
    ],
  },
  {
    id: "department",
    title: "Departments",
    translate: "Departments",
    type: "item",
    icon: "heroicons-outline:question-mark-circle",
    customIcon: <DepartmentIcon />,
    url: "department",
    check: "support_department",
  },
  {
    id: "support",
    title: "Support",
    translate: "SUPPORT",
    type: "item",
    icon: "heroicons-outline:question-mark-circle",
    customIcon: <SupportIcon />,
    url: "support",
    check: "is_supports",
  },
];

export const UserNavigationConfig: FuseNavItemType[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "DASHBOARD",
    type: "item",
    icon: "dashboard",
    customIcon: <DashBoardIcon />,
    url: "user/dashboard",
  },
  {
    id: "projects",
    title: "Projects",
    translate: "Projects",
    type: "collapse",
    icon: "heroicons-outline:list",
    customIcon: <ProjectIcon />,
    // children: getProjectNavItems(),
    customChildren: <GetProjectNavItems />,
  },
  {
    id: "chatBoard",
    title: "Chat Board",
    translate: "CHAT_BOARD",
    type: "item",
    icon: "heroicons-outline:chat-alt-2",
    customIcon: <ChatBoardIcon />,
    url: "chat-board",
    check: "is_chat",
  },
  {
    id: "sharedFiles",
    title: "Shared Files",
    translate: "SHARED_FILES",
    type: "item",
    icon: "heroicons-outline:external-link",
    customIcon: <SharedFileIcon />,
    url: "shared-files",
    check: "is_shared_files",
  },
  {
    id: "passwordManager",
    title: "Password Manager",
    translate: "PASSWORD_MANAGER",
    type: "item",
    icon: "heroicons-outline:lock-closed",
    customIcon: <PasswordManagerIcon />,
    url: "password-manager",
    check: "is_password_manager",
  },
  {
    id: "myAgents",
    title: "My Agents",
    translate: "MY_AGENTS",
    type: "item",
    icon: "heroicons-outline:user-group",
    customIcon: <MyAgentIcon />,
    url: "my-agents",
    check: "is_agent_access",
  },
  {
    id: "users",
    title: "Users",
    translate: "USERS",
    type: "item",
    icon: "heroicons-outline:users",
    customIcon: <UserIcon />,
    url: "users",
    check: "is_users_access",
  },
  {
    id: "settings",
    title: "Settings",
    type: "collapse",
    hideOption: true,
    icon: "Settings",
    customIcon: <SettingIcon />,
    children: [
      {
        id: "Roles_and_Permissions",
        title: "Roles and Permissions",
        type: "item",
        icon: "material-twotone:compress",
        url: "settings",
        customIcon: <RoleIcon />,
        end: true,
      },
      {
        id: "Reminder",
        title: "Reminder",
        type: "item",
        icon: "material-twotone:compress",
        url: "settings/reminder",
        customIcon: <ChurnNavIcon />,
        end: true,
      },
    ],
    check: "is_settings",
  },
  {
    id: "billings",
    title: "Billings",
    translate: "BILLINGS",
    type: "item",
    icon: "heroicons-outline:cash",
    customIcon: <BillingIcon />,
    url: "billings",
    check: "is_billing_access",
  },
  {
    id: "integration",
    title: "Integration",
    translate: "Integration",
    type: "item",
    icon: "heroicons-outline:users",
    customIcon: <IntegrationIcon />,
    url: "integration",
  },
  {
    id: "support",
    title: "Support",
    translate: "SUPPORT",
    type: "item",
    icon: "heroicons-outline:question-mark-circle",
    customIcon: <SupportIcon />,
    url: "support",
    check: "is_supports",
  },
];

export default navigationConfig;
