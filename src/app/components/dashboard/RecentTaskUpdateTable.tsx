import { Checkbox, TableCell, TableRow, Theme } from "@mui/material";
import { useTheme } from "@mui/styles";
import ImagesOverlap from "src/app/components/ImagesOverlap";
import CommonTable from "src/app/components/commonTable";

const rows = [
  {
    title: "Web App Design",
    defaultChecked: false,
    priority: "Low",
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    status: "In Review",
  },
  {
    title: "Web App Design",
    defaultChecked: false,
    priority: "Low",
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    status: "In Review",
  },
  {
    title: "Web App Design",
    defaultChecked: false,
    priority: "Low",
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    status: "In Review",
  },
];
interface RecentTaskUpdateTableProps {
  hideTable: () => void;
}
function RecentTaskUpdateTable(props: RecentTaskUpdateTableProps) {
  const { hideTable } = props;
  const theme: Theme = useTheme();
  return (
    <div
      className="absolute bg-white left-[4rem] top-[7rem] rounded-md test  max-w-full overflow-x-auto sm:w-full"
      onClick={hideTable}
    >
      <CommonTable
        headings={[
          "Sub Tasks",
          "Chat",
          "Date",
          "Priority",
          "Assigned Agents",
          "Status",
        ]}
      >
        <>
          {rows.map((row, index) => (
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
              <TableCell align="center">
                <span className="flex items-center gap-10">
                  <Checkbox
                    sx={{ padding: "4px" }}
                    color="primary"
                    defaultChecked={row?.defaultChecked}
                    inputProps={{
                      "aria-labelledby": `table-checkbox-${index}`,
                    }}
                    className="hover:!bg-transparent"
                  />{" "}
                  {row.title}
                </span>
              </TableCell>
              <TableCell align="center">No Chat</TableCell>
              <TableCell align="center">Feb 12,2024</TableCell>

              <TableCell align="center">
                <span
                  className={`inline-flex items-center justify-center rounded-full w-[70px] min-h-[25px] text-sm font-500
               ${row.priority === "Low" ? "text-[#4CAF50] bg-[#4CAF502E]" : row.priority === "Medium" ? "text-[#FF5F15] bg-[#FF5F152E]" : "text-[#F44336] bg-[#F443362E]"}`}
                >
                  {row.priority}
                </span>
              </TableCell>
              <TableCell align="center">
                <ImagesOverlap images={row.assignedImg} />
              </TableCell>
              <TableCell align="center">
                <span
                  className={`inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px] text-sm font-500
                      ${row.status === "Completed" ? "text-[#4CAF50] bg-[#4CAF502E]" : row.status === "In Progress" ? "text-[#F44336] bg-[#F443362E]" : "text-[#F0B402] bg-[#FFEEBB]"}`}
                >
                  {row.status}
                </span>
              </TableCell>

              {/* <TableCell scope="row">
                <span
                  className={`inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px] text-sm font-500
                      ${row.status === "Completed" ? "text-[#4CAF50] bg-[#4CAF502E]" : row.status === "In Progress" ? "text-[#F44336] bg-[#F443362E]" : "text-[#F0B402] bg-[#FFEEBB]"}`}
                >
                  {row.status}
                </span>
              </TableCell> */}
            </TableRow>
          ))}
        </>
      </CommonTable>
    </div>
  );
}

export default RecentTaskUpdateTable;
