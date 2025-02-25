import FuseMessage from "@fuse/core/FuseMessage";
import { selectFuseCurrentLayoutConfig } from "@fuse/core/FuseSettings/store/fuseSettingsSlice";
import FuseSuspense from "@fuse/core/FuseSuspense";
import { styled } from "@mui/material/styles";
import AppContext from "app/AppContext";
import { Layout1ConfigDefaultsType } from "app/theme-layouts/layout1/Layout1Config";
import {
  memo,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import LeftSideLayout1 from "./components/LeftSideLayout1";
import NavbarWrapperLayout1 from "./components/NavbarWrapperLayout1";
import RightSideLayout1 from "./components/RightSideLayout1";
import ToolbarLayout1 from "./components/ToolbarLayout1";
import FuseDialog from "@fuse/core/FuseDialog";
import ListLoading from "@fuse/core/ListLoading";
import { getUserDetail } from "src/utils";

const Root = styled("div")(
  ({ config }: { config: Layout1ConfigDefaultsType }) => ({
    ...(config.mode === "boxed" && {
      clipPath: "inset(0)",
      maxWidth: `${config.containerWidth}px`,
      margin: "0 auto",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
    ...(config.mode === "container" && {
      "& .container": {
        maxWidth: `${config.containerWidth}px`,
        width: "100%",
        margin: "0 auto",
      },
    }),
  })
);

type Layout1Props = {
  children?: ReactNode;
};

/**
 * The layout 1.
 */
function Layout1(props: Layout1Props) {
  const { children } = props;
  const details = getUserDetail();
  const config = useSelector(
    selectFuseCurrentLayoutConfig
  ) as Layout1ConfigDefaultsType;
  const appContext = useContext(AppContext);
  const { routes } = appContext;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <Root id="fuse-layout" config={config} className="flex w-full">
      {config.leftSidePanel.display && <LeftSideLayout1 />}

      <div className="flex flex-auto min-w-0">
        {config.navbar.display && config.navbar.position === "left" && (
          <NavbarWrapperLayout1 />
        )}

        <main
          id="fuse-main"
          className="relative z-10 flex flex-col flex-auto min-w-0 min-h-full"
        >
          {config.toolbar.display && (
            <ToolbarLayout1
              className={config.toolbar.style === "fixed" ? "sticky top-0" : ""}
            />
          )}

          {/* <div className="sticky top-0 z-99">
            <Configurator />
          </div> */}
          {isLoading && (details.role_id == 4 || details.role_id == 5) ? (
            <ListLoading />
          ) : (
            <>
              <div className="relative z-9 flex flex-col flex-auto min-h-0">
                <FuseSuspense>{useRoutes(routes)}</FuseSuspense>

                <Suspense>
                  <FuseDialog />
                </Suspense>
                {children}
              </div>
            </>
          )}
        </main>

        {config.navbar.display && config.navbar.position === "right" && (
          <NavbarWrapperLayout1 />
        )}
      </div>

      {config.rightSidePanel.display && <RightSideLayout1 />}
      <FuseMessage />
    </Root>
  );
}

export default memo(Layout1);
