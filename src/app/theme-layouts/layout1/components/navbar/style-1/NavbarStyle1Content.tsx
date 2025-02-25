import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { memo } from "react";
import Navigation from "app/theme-layouts/shared-components/navigation/Navigation";
import NavbarToggleButton from "app/theme-layouts/shared-components/navbar/NavbarToggleButton";
import Logo from "../../../../shared-components/Logo";
import UserNavbarHeader from "../../../../shared-components/UserNavbarHeader";

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  "& ::-webkit-scrollbar-thumb": {
    boxShadow: `inset 0 0 0 20px ${theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.24)"
      : "rgba(255, 255, 255, 0.24)"
      }`,
  },
  "& ::-webkit-scrollbar-thumb:active": {
    boxShadow: `inset 0 0 0 20px ${theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.37)"
      : "rgba(255, 255, 255, 0.37)"
      }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(() => ({
  overscrollBehavior: "contain",
  overflowX: "hidden",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 40px, 100% 10px",
  backgroundAttachment: "local, scroll",
}));

type NavbarStyle1ContentProps = {
  className?: string;
};

/**
 * The navbar style 1 content.
 */
function NavbarStyle1Content(props: NavbarStyle1ContentProps) {
  const { className = "" } = props;

  return (
    <Root
      className={clsx(
        "flex h-full flex-auto flex-col overflow-hidden",
        className
      )}
    >
      <div className="flex flex-row items-center h-48 px-20 shrink-0 md:h-72">
        <div className="flex flex-1 mx-4">
          <Logo />
        </div>

        <NavbarToggleButton className="w-40 h-40 p-0" />
      </div>

      <StyledContent
        className="flex flex-col flex-1 min-h-0"
        option={{ suppressScrollX: true, wheelPropagation: false }}
        id="verticalLayout"
      >
        <Navigation layout="vertical" />
        {/* <UserNavbarHeader /> */}
      </StyledContent>
    </Root>
  );
}

export default memo(NavbarStyle1Content);
