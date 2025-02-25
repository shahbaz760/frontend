import { Button, Checkbox, TableCell, TableRow, Theme } from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  ArrowRightCircleIcon,
  DeleteIcon,
  EditIcon,
} from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { DownArrowBlack } from "public/assets/icons/projectsIcon";
import ImagesOverlap from "../../ImagesOverlap";
import CommonTable from "../../commonTable";
const rows = [
  {
    title: "Brand logo design",
    defaultChecked: true,
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    priority: "Medium",
  },
  {
    title: "Brand logo design",
    defaultChecked: true,
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    priority: "Medium",
  },
  {
    title: "No Due date",
    defaultChecked: false,
    assignedImg: [],
    priority: "",
  },
];
const TaskListDueData = () => {
  const theme: Theme = useTheme();

  return (
    <div>
      <CommonTable
        headings={["Title", "Assigned", "Due Date", "Priority", "Action"]}
        useBorderDesign={true}
      >
        <TableRow>
          {" "}
          <TableCell colSpan={5} scope="row" className=" px-20 bg-[#E7E8E9]">
            <div className="flex items-center gap-10">
              <span>
                <DownArrowBlack />
              </span>
              No Due Date (4)
            </div>
          </TableCell>
        </TableRow>
        <>
          {rows.map((row: any, index: number) => (
            <TableRow
              key={index}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
                "& td": {
                  borderBottom: "1px solid #EDF2F6",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  color: theme.palette.primary.main,
                },
              }}
            >
              <TableCell scope="row">
                <span className="flex items-center gap-10">
                  <Checkbox
                    className="hover:!bg-transparent"
                    sx={{ padding: "4px" }}
                    color="primary"
                    defaultChecked={row?.defaultChecked}
                    inputProps={{
                      "aria-labelledby": `table-checkbox-${index}`,
                    }}
                  />
                  {row.title}
                </span>
              </TableCell>
              <TableCell align="center">
                <ImagesOverlap images={row.assignedImg} />
              </TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">
                <span
                  className={`inline-flex items-center justify-center rounded-full w-[70px] min-h-[25px] text-sm font-500
               ${row.priority === "Low" ? "text-[#4CAF50] bg-[#4CAF502E]" : row.priority === "Medium" ? "text-[#FF5F15] bg-[#FF5F152E]" : "text-[#F44336] bg-[#F443362E]"}`}
                >
                  {row.priority}
                </span>
              </TableCell>
              <TableCell align="left" className="w-[1%] ">
                <div className="flex gap-20 px-10">
                  <span className="p-2 cursor-pointer">
                    <DeleteIcon />
                  </span>
                  <span className="p-2 cursor-pointer">
                    <EditIcon />
                  </span>
                  <span className="p-2 cursor-pointer">
                    <ArrowRightCircleIcon />
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </>
      </CommonTable>

      <div className=" border-1 border-solid border-[#D1D7DB]">
        <Button
          variant="text"
          color="secondary"
          className="h-[40px] sm:text-[16px] flex gap-2 sm:mb-[1rem] leading-none pt-10  pl-10"
          aria-label="Manage Sections"
          size="large"
          startIcon={<PlusIcon color={theme.palette.secondary.main} />}
        >
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default TaskListDueData;
