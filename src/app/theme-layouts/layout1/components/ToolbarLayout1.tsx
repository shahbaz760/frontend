import {
  selectFuseCurrentLayoutConfig,
  selectToolbarTheme,
} from "@fuse/core/FuseSettings/store/fuseSettingsSlice";
import AppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import Toolbar from "@mui/material/Toolbar";
import { ThemeProvider } from "@mui/material/styles";
import { RootState } from "app/store/store";
import { Layout1ConfigDefaultsType } from "app/theme-layouts/layout1/Layout1Config";
import Notifications from "app/theme-layouts/shared-components/Notifications";
import NavbarToggleButton from "app/theme-layouts/shared-components/navbar/NavbarToggleButton";
import { selectFuseNavbar } from "app/theme-layouts/shared-components/navbar/store/navbarSlice";
import clsx from "clsx";
import { memo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import BreadcrumbsComponent from "src/app/components/BreadCrumb";
import UserMenu from "../../shared-components/UserMenu";
import { BackIcon } from "public/assets/icons/common";
import { Button } from "@mui/material";
import { getClientId, getUserDetail } from "src/utils";

type ToolbarLayout1Props = {
  className?: string;
};

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props: ToolbarLayout1Props) {
  const { className } = props;
  const config = useSelector(
    selectFuseCurrentLayoutConfig
  ) as Layout1ConfigDefaultsType;
  const navbar = useSelector(selectFuseNavbar);

  const toolbarTheme = useSelector(selectToolbarTheme);
  const { breadCrumbFor } = useSelector(
    (state: RootState) => state?.breadcrumb
  );

  const location = useLocation();
  const clientId = getClientId();
  const userDetails = getUserDetail();
  const navigate = useNavigate();
  const showBreadCrumbIf =
    location.pathname.includes(breadCrumbFor) && breadCrumbFor;
  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx("relative z-1 flex shadow", className)}
        color="default"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? toolbarTheme.palette.background.paper
              : toolbarTheme.palette.background.default,
        }}
        position="static"
        elevation={0}
      >
        <Toolbar className="p-0 min-h-48 md:min-h-64">
          <div className="flex flex-1 px-16 items-center">
            {config.navbar.display && config.navbar.position === "left" && (
              <>
                <Hidden lgDown>
                  {(config.navbar.style === "style-3" ||
                    config.navbar.style === "style-3-dense") && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}

                  {config.navbar.style === "style-1" && !navbar.open && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}
                </Hidden>

                <Hidden lgUp>
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                </Hidden>
                {showBreadCrumbIf && <BreadcrumbsComponent />}
                {location.pathname.includes("supportdetail") && (
                  <Button
                    variant="text"
                    startIcon={<BackIcon />}
                    onClick={() =>
                      navigate(`support${clientId ? `?ci=${clientId}` : ""}`)
                    }
                  >
                    {" "}
                    Back
                  </Button>
                )}
                {location.pathname.includes("add-role-permission") && (
                  <Button
                    variant="text"
                    startIcon={<BackIcon />}
                    onClick={() =>
                      navigate(
                        `admin/setting${clientId ? `?ci=${clientId}` : ""}`
                      )
                    }
                  >
                    {" "}
                    Back
                  </Button>
                )}
                {location.pathname.includes("edit-role-permission") && (
                  <Button
                    variant="text"
                    startIcon={<BackIcon />}
                    onClick={() =>
                      navigate(
                        `admin/setting${clientId ? `?ci=${clientId}` : ""}`
                      )
                    }
                  >
                    {" "}
                    Back
                  </Button>
                )}
              </>
            )}

            {/* <Hidden lgDown>
              <NavigationShortcuts />
            </Hidden> */}
          </div>

          <div className="flex items-center h-full px-8 overflow-x-auto">
            {userDetails?.role_id !== 1 && userDetails?.role_id !== 4 && (
              <Notifications />
            )}
            {/* <LanguageSwitcher /> */}
            {/* <AdjustFontSize /> */}
            {/* <FullScreenToggle /> */}
            {/* <NavigationSearch /> */}
            {/* <QuickPanelToggleButton /> */}
            <UserMenu />
          </div>

          {config.navbar.display && config.navbar.position === "right" && (
            <>
              <Hidden lgDown>
                {!navbar.open && (
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                )}
              </Hidden>

              <Hidden lgUp>
                <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
              </Hidden>
            </>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout1);
