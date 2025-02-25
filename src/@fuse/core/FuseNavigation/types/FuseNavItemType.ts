import { SxProps } from "@mui/system";
import { ReactNode } from "react";
import { FuseNavBadgeType } from "./FuseNavBadgeType";

/**
 * FuseNavItemType
 * A type for Fuse navigation item and its properties.
 */
export type FuseNavItemType = {
  is_private?: any;
  project_assignees?: any[];
  id: string;
  title?: string;
  translate?: string;
  auth?: string[] | string;
  hideOption?: boolean;
  subtitle?: string;
  icon?: string | ReactNode;
  iconClass?: string;
  url?: string | any;
  target?: string;
  type?: string;
  sx?: SxProps;
  disabled?: boolean;
  active?: boolean;
  exact?: boolean;
  end?: boolean;
  badge?: FuseNavBadgeType;
  // children?: FuseNavItemType[];
  children?: any;
  hasPermission?: boolean;
  customIcon?: any;
  isProject?: boolean;
  customChildren?: any;
  activeIcon?: any;
  check?: any;
};

export type FuseFlatNavItemType = Omit<FuseNavItemType, "children" | "sx"> & {
  children?: any[];
  order: string;
};
