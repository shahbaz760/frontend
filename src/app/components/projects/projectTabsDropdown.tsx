import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export interface tabsDropdownType {
  title: string;
  icon: JSX.Element;
  type: "edit" | "delete" | "pin";
  uuid?: string;
}
export const projectTabsDropdown: tabsDropdownType[] = [
  {
    title: "Rename",
    icon: <EditOutlinedIcon color="disabled" fontSize="small" />,
    type: "edit",
  },
  {
    title: "Delete",
    icon: <DeleteOutlineIcon color="disabled" fontSize="small" />,
    type: "delete",
  },
  {
    title: "Pin",
    icon: <PushPinOutlinedIcon color="disabled" fontSize="small" />,
    type: "pin",
  },
];

export const hideDropDownItemsFor = [0, 1, 2, 3];
