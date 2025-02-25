import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableRowProps,
} from "@mui/material";
import { HeadIcon } from "public/assets/icons/clienIcon";
import { BaseSyntheticEvent, ReactNode } from "react";

interface IProps {
  children: ReactNode;
  headings: string[];
  headingRowProps?: TableRowProps;
  useBorderDesign?: boolean;
  isSorting?: boolean;
  isAllSelected?: boolean;
  sortColumn?: string;
  sortOrder?: string;
  onSort?: (column: string) => void;
  handleSelectAll?: () => void;
  // customHeight?: boolean;
}
function CommonTableInfinit({
  children,
  headings,
  headingRowProps,
  useBorderDesign,
  isSorting,
  onSort,
  handleSelectAll,
  isAllSelected,
  // customHeight,
}: IProps) {
  return (
    <TableContainer
      style={{ maxHeight: 200, overflowY: "scroll" }}
      sx={{
        ".MuiTableContainer-root": {
          maxHeight: 600,
        },
      }}
      className="custom"
    >
      <Table
        size="small"
        aria-label="simple table"
        className={`${useBorderDesign ? "border-design" : "common_table "}`}
      >
        <TableHead
          className={`${isSorting && "cursor-pointer"} ${useBorderDesign
            ? "bg-[#F7F9FB] text-sm border-solid border-[#EDF2F6]"
            : "bg-[#F7F9FB] text-sm border-b-2 border-solid border-[#EDF2F6]"
            } `}
        >
          <TableRow {...headingRowProps}>
            {headings.map((item, index) => (
              <TableCell
                className={`th ${index === 0 ? "pl-20" : ""} w-[${100 / headings?.length
                  }%]`}
                key={index}
                align={
                  headings.length === index || index === 0 ? "left" : "center"
                }
              // align ={"center"}
              >
                {isSorting ? (
                  <div className="flex items-center">
                    {index === 0 && (
                      <Checkbox
                        checked={isAllSelected}
                        onClick={(e: BaseSyntheticEvent) => {
                          e.stopPropagation();
                          handleSelectAll();
                        }}
                        sx={{
                          paddingLeft: 0, // Set paddingLeft to 0
                          "&:hover": {
                            backgroundColor: "transparent", // No hover background globally
                          },
                        }}
                      />
                    )}
                    {index !== headings.length - 1 && (
                      <HeadIcon
                        className="mr-10"
                        onClick={() => {
                          if (typeof onSort == "function") {
                            onSort(item);
                          } else null;
                        }}
                      />
                    )}{" "}
                    {item}
                  </div>
                ) : (
                  item
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default CommonTableInfinit;
