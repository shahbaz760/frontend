import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import {
  Button,
  ListItemButton,
  ListItemButtonProps,
  Popover,
  Typography,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import { deleteProject } from "app/store/Projects";
import { AppDispatch } from "app/store/store";
import {
  navbarEditModelCloseMobile,
  navbarEditModelOpenMobile,
} from "app/theme-layouts/shared-components/navbar/store/navbarSlice";
import clsx from "clsx";
import { DeleteIcon, EditIcon } from "public/assets/icons/navabarIcon";
import { ProjectNavIcon } from "public/assets/icons/projectsIcon";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import DeleteProject from "src/app/pages/projects/DeleteProject";
import EditProjectModal from "src/app/pages/projects/EditProjectModal";
import { getClientId, getLocalStorage, getUserDetail } from "src/utils";
import FuseNavBadge from "../../FuseNavBadge";
import { FuseNavItemComponentProps } from "../../FuseNavItem";

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
    color: "white",
    cursor: "pointer",
    opacity: 1,
    textDecoration: "none!important",
    "&.inside": {
      opacity: 0.5,
      backgroundColor: "transparent !important",
    },
    "&:hover": {
      color: "white",
      opacity: 1,
    },
    "&.active": {
      color: "white",
      backgroundColor: "#393F4C", //for heighlight active navbar list item
      // pointerEvents: "none",
      transition: "border-radius .15s cubic-bezier(0.4,0.0,0.2,1)",
      "& > .fuse-list-item-text-primary": {
        color: "inherit",
      },
      opacity: 1,
    },
    // "& >.fuse-list-item-icon": {
    //   marginRight: 16,
    //   color: "#9da0a6",

    // },
    "& > .fuse-list-item-text": {},
  })
);

/**
 * FuseNavVerticalItem is a React component used to render FuseNavItem as part of the Fuse navigational component.
 */
function FuseNavVerticalItem(props: FuseNavItemComponentProps) {
  const [disable, setDisable] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [deleteid, setDeleteId] = useState<number | string>("");
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [activeIcon, setActiveIcon] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // event.preventDefault(); // Prevent the default action
    // event.stopPropagation(); // Stop event from propagating
    setAnchorEl(anchorEl ? null : event.currentTarget);
    dispatch(navbarEditModelOpenMobile());
  };
  const location = useLocation(); // Get the location object
  const pathname = location.pathname; // Access the pathname
  const clientId = getClientId();

  const path = pathname.split("/");
  const [isActive, setIsActive] = useState(false);
  const handleClose = (event: any) => {
    // event.preventDefault(); // Prevent the default action
    // event.stopPropagation();
    dispatch(navbarEditModelCloseMobile());
    setAnchorEl(null);
    // Stop event from propagating
  };

  // const { project_id } = useParams();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { item, nestedLevel = 0, onItemClick, checkPermission } = props;
  const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;
  const component = item.url ? NavLinkAdapter : "li";

  let itemProps = {};

  if (typeof component !== "string") {
    itemProps = {
      disabled: item.disabled,
      to: clientId ? item.url + `/?ci=${clientId}` : item.url || "",
      end: item.end,
      role: "button",
    };
  }

  if (checkPermission && !item?.hasPermission) {
    return null;
  }

  const onDelete = async () => {
    setDisable(true);
    try {
      const res = await dispatch(
        deleteProject({ project_id: deleteid })
      ).unwrap();
      if (res?.data?.status === 1) {
        setDisable(false);
        const clientId = getClientId();
        let localData = getUserDetail();
        if (localData) {
          // Filter out the deleted project from localData.projects
          const updatedProjects = localData.projects.filter(
            (item) => item.id !== deleteid
          );
          localData.projects = updatedProjects;
          // Update localStorage with updated localData\
          const dataKey = clientId ? `${clientId}userDetail` : "userDetail";
          localStorage.setItem(dataKey, JSON.stringify(localData));
        }
        let columnListLocal = localStorage.getItem("columnList");
        const activeUserColumnData = columnListLocal
          ? JSON.parse(columnListLocal)
          : null;
        const prevData = activeUserColumnData ? activeUserColumnData : null;
        let initialColumnList = localData?.projects?.map((project) => ({
          id: project.id,
          name: project.name,
          checked: true, // Set all projects checked initially
        }));
        initialColumnList = {
          ...prevData,
          [localData.uuid]: initialColumnList,
        };
        localStorage.setItem("columnList", JSON.stringify(initialColumnList));
        setIsOpenDeletedModal(false);
        // Navigate and reload window
        navigate(clientId ? "/dashboard" + `?ci=${clientId}` : "/");
        window.location.reload();
      }
    } catch (error) {
      setDisable(false);
      // console.error("Error deleting project:", error);
    }
  };
  const userDetails = getUserDetail();

  useEffect(() => {
    if (userDetails.role_id != 4) {
      setIsActive(path.includes(`${item.id}`));
    }
  }, [path]);
  const handleredirect = () => {
    const tokenKey = clientId
      ? `${clientId}jwt_access_token`
      : "jwt_access_token";
    const token = localStorage.getItem(tokenKey);

    if (!token) {
      console.error("Token not found!");
      return;
    }

    const url = `https://magicai.financialcalculatorindia.in/login/sso/${token}`;
    window.location.href = url;
  };

  return useMemo(
    () => (
      <Root
        component={component}
        className={clsx(
          `fuse-list-item ${item.end ? "inside" : ""} ${isActive ? "bg-[#393F4C]" : ""}`
        )}
        onClick={() => {
          onItemClick && onItemClick(item);
          setActiveIcon(true);
        }}
        itempadding={itempadding}
        sx={item.sx}
        {...itemProps}
      >
        {item.icon && (
          <div>
            <span
              className={clsx(
                "shrink-0 inline-block mr-16 mt-[8px]",
                item.iconClass
              )}
            >
              {/* {!isActive ? item.customIcon : item.activeIcon} */}
              {item.customIcon}
            </span>
          </div>
        )}

        <ListItemText
          className="fuse-list-item-text capitalize pt-[4px] "
          primary={item.title}
          secondary={item.subtitle}
          onClick={item.id == "aitools" ? handleredirect : null}
          classes={{
            primary:
              "text-13 font-medium fuse-list-item-text-primary capitalize",
            secondary:
              "text-11 font-medium fuse-list-item-text-secondary leading-normal truncate capitalize",
          }}
        />
        {/*  */}

        {item?.isProject && userDetails?.role_id != 3 && (
          <>
            <Button
              aria-describedby={id}
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation to prevent route change
                e.preventDefault(); // Prevent default navigation behavior
                handleClick(e);
              }}
              style={{ position: "relative", zIndex: 11 }}
            >
              <ProjectNavIcon className="threeDots-icon" color="inherit" />
            </Button>
            <Popover
              id={id}
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
                "& .MuiPopover-root .MuiPopover-paper": {
                  boxShadow: "none",
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
                  // alert("hello");
                  // e.stopPropagation();
                  // e.preventDefault();
                  setIsOpenEditModal(true);
                  handleClose(e);
                }}
              >
                Edit <EditIcon fill={"#757982"} />
              </Typography>

              <div
                onClick={(e) => {
                  setIsOpenDeletedModal(true);
                  setDeleteId(item?.id);
                  handleClose(e);
                  // e.stopPropagation();
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
            <DeleteProject
              isOpen={isOpenDeletedModal}
              setIsOpen={setIsOpenDeletedModal}
              onDelete={onDelete}
              disable={disable}
            />
            <EditProjectModal
              isOpen={isOpenEditModal}
              setIsOpen={setIsOpenEditModal}
              projectData={{
                id: item?.id,
                name: item?.title,
                is_private: item?.is_private,
                project_assignees: item?.project_assignees,
              }}
            />
          </>
        )}
        {item.badge && <FuseNavBadge badge={item.badge} />}
      </Root>
    ),
    [
      item,
      itempadding,
      onItemClick,
      anchorEl,
      isOpenDeletedModal,
      isOpenEditModal,
      disable,
      isActive,
      item.customChildren,
    ]
  );
}

const NavVerticalItem = FuseNavVerticalItem;

export default NavVerticalItem;
