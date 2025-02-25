import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { darken } from "@mui/material/styles";
import {
  DownArrow,
  DownArrowNew,
  UpArrow,
} from "public/assets/icons/topBarIcons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import { selectUser } from "src/app/auth/user/store/userSlice";
import {
  getClientId,
  getLocalStorage,
  getParamFromPathname,
  getUserDetail,
} from "src/utils";
import { logoutCometChat } from "app/configs/cometChatConfig";
import SignOutModal from "src/app/auth/SignOutModal";
import { restAll } from "app/store/Client";
import { RootState, useAppDispatch } from "app/store/store";
import { useLocation, useNavigate, useParams } from "react-router";
import { UpArrowIcon } from "public/assets/icons/dashboardIcons";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { GetProfile } from "app/store/Password";
import { logOut } from "app/store/Auth";

/**
 * The user menu.
 */
function UserMenu() {
  const location = useLocation();
  const param = getParamFromPathname(location.pathname);
  const { status, details } = useSelector((state: RootState) => state.password);
  const user = getUserDetail();
  const { signOut } = useAuth();
  const Navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  const clientId = getClientId();
  const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
    // fetchDetalis();
  };

  if (!user) {
    return null;
  }
  const handleLogout = async () => {
    await dispatch(logOut())
    await logoutCometChat();
    dispatch(restAll());
    signOut();
    localStorage.clear();
  };

  // const fetchDetalis = async () => {
  //   try {
  //     const res = await dispatch(GetProfile());
  //     // toast.success(res?.payload?.data?.message);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

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

  // useEffect(() => {
  //   fetchDetalis();
  // }, []);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const role = details?.user_image ? details?.user_image : user?.user_image;
  return (
    <>
      <Button
        className="flex gap-5 p-0 min-h-40 min-w-40  md:py-6  hover:bg-transparent"
        onClick={userMenuClick}
        color="inherit"
      >
        {/* {details?.user_image || ? (
          <Avatar
            sx={{
              background: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.text.primary,
            }}
            className="md:mx-4"
            alt="user photo"
            src={urlForImage + details.user_image}
          />


        ) : ( */}

        {details?.user_image || user?.user_image ? (
          <Avatar
            sx={{
              background: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.text.primary,
            }}
            className="md:mx-4"
            alt="user photo"
            //@ts-ignore
            src={urlForImage + role}
          />
        ) : (
          <Avatar
            sx={{
              background: (theme) =>
                darken(theme.palette.background.default, 0.05),
              color: (theme) => theme.palette.text.secondary,
            }}
            className="md:mx-4"
          >
            {user?.first_name?.[0]}
          </Avatar>
        )}
        <div className="flex-col items-start hidden mx-4 md:flex">
          <Typography component="span" className="flex font-semibold">
            {user?.first_name}
          </Typography>
          <Typography
            className="font-medium capitalize text-11"
            color="text.secondary"
          >
            {user.role == "account manager"
              ? "Admin User"
              : user.role?.toString()}
            {(!user.role ||
              (Array.isArray(user.role) && user.role.length === 0)) &&
              "Guest"}
          </Typography>
        </div>
        {userMenu ? <UpArrow /> : <DownArrowNew />}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/sign-in" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              component={Link}
              to={`/profile${clientId ? `?ci=${clientId}` : ``}`}
              onClick={userMenuClose}
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="My profile" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsSignOut(true);
                // signOut();
                // await logoutCometChat();
                // localStorage.clear();
              }}
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>
          </>
        )}
      </Popover>
      <SignOutModal
        isOpen={isSignOut}
        setIsOpen={setIsSignOut}
        onDelete={handleLogout}
      />
    </>
  );
}

export default UserMenu;
