import {
  Button,
  Checkbox,
  TableCell,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import {
  ArrowRightCircleIcon,
  DeleteIcon,
  EditIcon,
} from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import ImagesOverlap from "../../ImagesOverlap";
import CommonTable from "../../commonTable";

import { useTheme } from "@mui/styles";
import { DownArrowright, SortIcon } from "public/assets/icons/projectsIcon";
import { useState } from "react";
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
    assignedImg: [
      "female-01.jpg",
      "female-02.jpg",
      "female-03.jpg",
      "female-04.jpg",
      "female-05.jpg",
    ],
    priority: "Medium",
  },
  {
    title: "Brand logo design",
    defaultChecked: false,
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    priority: "Medium",
  },
];

const Review = () => {
  const theme: Theme = useTheme();

  const [showData, setShowData] = useState(false);
  const handleShowTable = () => {
    setShowData(!showData);
  };
  return (
    <div>
      <div className="block gap-20  pt-10  w-full  my-10 bg-white rounded-lg h-fit border-1 border-solid border-[#D1D7DB] mb-24  ">
        <div className="flex  flex-col  ">
          <div className="flex items-center justify-start gap-20 px-20 pb-10">
            {!showData ? (
              <DownArrowright onClick={handleShowTable} />
            ) : (
              <SortIcon
                onClick={handleShowTable}
                className="border-1 w-32 h-32 p-2 rounded-sm"
              />
            )}
            <Typography className="text-lg font-medium text-black">
              Review
            </Typography>
          </div>
          {showData && (
            <>
              <div>
                <CommonTable
                  headings={[
                    "Title",
                    "Assigned",
                    "Due Date",
                    "Priority",
                    "Action",
                  ]}
                  useBorderDesign={true}
                >
                  {rows.map((row: any, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
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
                          />{" "}
                          {row.title}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <ImagesOverlap images={row.assignedImg} />
                      </TableCell>
                      <TableCell align="center">Feb 12,2024</TableCell>
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
                </CommonTable>
                <div className=" border-1 border-solid border-[#D1D7DB]">
                  <Button
                    variant="text"
                    color="secondary"
                    className="h-[40px] sm:text-[16px] flex gap-2 sm:mb-[1rem] leading-none pt-10  pl-10"
                    aria-label="Manage Sections"
                    size="large"
                    startIcon={
                      <PlusIcon color={theme.palette.secondary.main} />
                    }
                  >
                    Add Task
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
