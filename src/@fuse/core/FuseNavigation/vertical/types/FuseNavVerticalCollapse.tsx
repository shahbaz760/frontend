import isUrlInChildren from "@fuse/core/FuseNavigation/isUrlInChildren";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { ListItemButton } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List, { ListProps } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import { AccessAccountManagerList, projectMove } from "app/store/Projects";
import { RootState, useAppDispatch } from "app/store/store";
import clsx from "clsx";
import type { Location } from "history";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import {
  ProjectNavIconArrow,
  ProjectPlusIcon,
} from "public/assets/icons/projectsIcon";
import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { useLocation, useNavigate } from "react-router-dom";
import AddProjectModal from "src/app/pages/projects/AddProjectModal";
import { getUserDetail } from "src/utils";
import FuseNavBadge from "../../FuseNavBadge";
import FuseNavItem, { FuseNavItemComponentProps } from "../../FuseNavItem";
import { FuseNavItemType } from "../../types/FuseNavItemType";
import { useSelector } from "react-redux";
import ListLoading from "@fuse/core/ListLoading";
import { ProjectRootState } from "app/store/Projects/Interface";
type ListComponentProps = ListProps & {
  itempadding: number;
};
const Root = styled(List)<ListComponentProps>(({ theme, ...props }) => ({
  padding: 0,
  "&.open": {},
  "& > .fuse-list-item": {
    minHeight: 44,
    width: "100%",
    borderRadius: "6px",
    margin: "0 0 4px 0",
    backgroundColor: "red",
    paddingRight: 16,
    paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
    paddingTop: 10,
    paddingBottom: 10,
    color: alpha(theme.palette.text.primary, 0.7),
    "&:hover": {
      color: theme.palette.text.primary,
    },
    "& > .fuse-list-item-icon": {
      marginRight: 30,
      color: "inherit",
    },
  },
}));
function needsToBeOpened(location: Location, item: FuseNavItemType) {
  return location && isUrlInChildren(item, location.pathname);
}
/**
 * FuseNavVerticalCollapse component used for vertical navigation items with collapsible children.
 */
function FuseNavVerticalCollapse(props: FuseNavItemComponentProps) {
  const project = useSelector((store: ProjectRootState) => store.project);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const location = useLocation();
  const { item, nestedLevel = 0, onItemClick, checkPermission } = props;
  const [items, setItems] = useState<any>(item);
  const navigate = useNavigate();
  const { Accesslist, AccessStatus, projectList } = useSelector(
    (state: RootState) => state.project
  );
  const userDetails = getUserDetail();

  const [open, setOpen] = useState(
    item.id.includes("settings")
      ? location.pathname.includes("setting")
      : item?.id.includes("projects")
        ? true
        : false
  );
  const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;
  const dispatch = useAppDispatch();

  useEffect(() => {}, [isOpenAddModal]);
  useEffect(() => {
    if (location.pathname.includes("/projects")) return;
    if (!location.pathname.includes("/agents"))
      if (!location.pathname.includes("/tasks/detail"))
        if (
          location.pathname !== "/admin/agents/groups" &&
          location.pathname !== "/admin/agents/list"
        ) {
          // setOpen(false);
        }
  }, [location]);
  const component = item.url ? NavLinkAdapter : "li";
  let itemProps = {};
  if (typeof component !== "string") {
    itemProps = {
      disabled: item.disabled,
      to: "item.url",
      end: item.end,
      role: "button",
    };
  }
  if (checkPermission && !item?.hasPermission) {
    return null;
  }
  const moveProject = async (payload: { project_ids: any }) => {
    try {
      const res = await dispatch(projectMove(payload));
      // callListApi(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
    const newItems = [...items.children];
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);
    const allitems = { ...items, children: newItems };
    let userDetail = JSON.parse(localStorage.getItem("userDetail"));
    // Extract id and name (title) and add user_id from userDetail
    let extractedProjects = newItems.map((project) => ({
      id: project.id,
      name: project.title,
      user_id: userDetail.id,
    }));
    let extractedProjectsids = newItems.map((project) => project.id);
    userDetail.projects = extractedProjects;
    // Step 4: Convert the updated object back to a JSON string
    let updatedUserDetail = JSON.stringify(userDetail);
    // Step 5: Store the updated object back in localStorage
    localStorage.setItem("userDetail", updatedUserDetail);
    setItems(allitems);
    const payload = {
      project_ids: extractedProjectsids,
    };
    await moveProject(payload);
  };
  const handleProjectModel = () => {
    setIsOpenAddModal(true);
  };
  useEffect(() => {
    if (item.id.includes("projects")) {
      setOpen(true);
    }
  }, []); //projectList in dependency array

  useEffect(() => {
    if (!(userDetails && userDetails !== "{}")) {
      window.location.href = "/sign-in";
    } else {
      if (!open) {
        if (
          item.id.includes("projects") &&
          location.pathname.includes("projects")
        ) {
          setOpen(true);
        }
      } else if (item.id.includes("projects")) {
        setOpen(true);
      } else if (
        location.pathname.includes("financial-report") &&
        item.id.includes("Reports")
      ) {
        setOpen(true);
      } else if (
        location.pathname.includes("agents") &&
        item.id.includes("agents")
      ) {
        setOpen(true);
      } else if (
        location.pathname.includes("setting") &&
        item.id.includes("settings")
      ) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [location]);

  useEffect(() => {
    if (!(userDetails && userDetails !== "{}")) {
      window.location.href = "/sign-in";
    } else {
      if (item.id.includes("projects")) {
        setOpen(true);
      } else if (
        location.pathname.includes("financial-report") &&
        item.id.includes("Reports")
      ) {
        setOpen(true);
      } else if (
        location.pathname.includes("agents") &&
        item.id.includes("agents")
      ) {
        setOpen(true);
      } else if (
        location.pathname.includes("setting") &&
        item.id.includes("settings")
      ) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, []);

  const fetchList = async () => {
    try {
      const res = await dispatch(AccessAccountManagerList());
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (userDetails?.role_id == 4 || userDetails?.role_id == 5) {
      fetchList();
    }
  }, []);
  return useMemo(
    () => (
      <Root className={clsx(open && "")} itempadding={itempadding} sx={item.sx}>
        <div>
          <div>
            <ListItemButton
              component={component}
              className={clsx(
                "fuse-list-item min-h-[48px] hover:opacity-100 py-0 !cursor-default hover:!bg-[#1F2634]",
                item?.id === "projects" &&
                  project.projectList?.length > 0 &&
                  open
                  ? "opacity-100 bg-[#393F4C]"
                  : open && item?.id !== "projects"
                    ? "opacity-100 bg-[#393F4C]"
                    : "opacity-100 bg-[#393f4c00]"
              )}
              {...itemProps}
            >
              <div className="flex items-center justify-between w-full  ">
                <div
                  className="flex items-center "
                  onClick={(ev) => {
                    setOpen(!open);
                  }}
                >
                  {item.icon && (
                    <span
                      className={clsx(
                        "shrink-0 inline-block mr-16",
                        item.iconClass
                      )}
                    >
                      {item.customIcon}
                    </span>
                  )}
                  <ListItemText
                    className="fuse-list-item-text cursor-pointer "
                    primary={item.title}
                    secondary={item.subtitle}
                    classes={{
                      primary:
                        "text-13 font-medium fuse-list-item-text-primary truncate",
                      secondary:
                        "text-11 font-medium fuse-list-item-text-secondary leading-normal truncate",
                    }}
                  />
                  {items.badge && (
                    <FuseNavBadge className="mx-4" badge={item.badge} />
                  )}

                  <IconButton disableRipple size="large">
                    {item?.id == "projects" ? (
                      project.projectList?.length > 0 &&
                      (!open ? (
                        <ProjectNavIconArrow
                          className="arrow-icon"
                          color=""
                        ></ProjectNavIconArrow>
                      ) : (
                        <UpArrowBlank
                          className="cursor-pointer"
                          fill="#757982"
                        />
                      ))
                    ) : !open ? (
                      <ProjectNavIconArrow
                        className="arrow-icon"
                        color=""
                      ></ProjectNavIconArrow>
                    ) : (
                      <UpArrowBlank className="cursor-pointer" fill="#757982" />
                    )}
                  </IconButton>
                </div>
                {!items?.hideOption && userDetails?.role_id != 3 && (
                  <div className="flex items-center gap-10 custom cursor-pointer w-[10%]">
                    <div onClick={handleProjectModel}>
                      <ProjectPlusIcon />
                    </div>
                  </div>
                )}
              </div>
            </ListItemButton>
          </div>
          {items?.children && (
            <Collapse
              in={open}
              className={`collapse-children ${items.id != "projects" && "bg-[] text-[#9DA0A6]"} !bg-[#393F4C] `}
            >
              {" "}
              {/* hover:bg-[#111827] */}
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="droppable-collapse">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`${items.id != "" && " !bg-[#111827]  w-[90%] m-auto rounded-6"}`}
                    >
                      {item?.id === "projects"
                        ? items?.customChildren
                        : items?.children.map((_item, index) => {
                            const accessKey = _item.check;
                            const shouldHide =
                              Accesslist && Accesslist[accessKey] == 0;
                            // If shouldHide is true, do not render the item
                            if (shouldHide) {
                              if (location.pathname === _item.url) {
                                // window.location.href = "accountManager/dashboard";
                                navigate("/401");
                              }
                              return null; // Don't render this FuseNavItem
                            }
                            return (
                              <Draggable
                                key={_item.id}
                                draggableId={_item.id.toString()}
                                index={index}
                                isDragDisabled={item?.id != "projects"}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="text-[#9DA0A6]   "
                                  >
                                    <FuseNavItem
                                      key={_item.id}
                                      type={`vertical-${_item.type}`}
                                      item={_item}
                                      nestedLevel={nestedLevel + 1}
                                      onItemClick={onItemClick}
                                      checkPermission={true}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Collapse>
          )}
          <AddProjectModal
            isOpen={isOpenAddModal}
            setIsOpen={setIsOpenAddModal}
          />
        </div>
      </Root>
    ),
    [
      item.badge,
      item.children,
      item.icon,
      item.iconClass,
      item.title,
      item.url,
      itempadding,
      nestedLevel,
      onItemClick,
      open,
      items,
      isOpenAddModal,
    ]
  );
}
const NavVerticalCollapse = FuseNavVerticalCollapse;
export default NavVerticalCollapse;
