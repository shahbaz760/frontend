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
import { BaseSyntheticEvent, ReactNode, forwardRef } from "react";

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
  isCustomHeight?: boolean;
  scrollRef?: any;
  check?: boolean;
  id?: any;
  indexlength?: any;
  index?: any;
  maxHeight?: boolean;
}
const CommonDragTable = forwardRef<HTMLTableElement, IProps>(
  (
    {
      children,
      headings,
      headingRowProps,
      useBorderDesign,
      isSorting,
      sortColumn,
      sortOrder,
      onSort,
      id,
      index,
      handleSelectAll,
      isAllSelected,
      isCustomHeight,
      check = true,
      indexlength = 1,
      maxHeight = true,
    }: IProps,
    scrollRef
  ) => {
   
    return (
      <TableContainer
        style={{ maxHeight: maxHeight ? 220 : "100%" }}
        ref={scrollRef}
      >
        <Table size="small" aria-label="simple table" stickyHeader>
          <TableHead
            className={` whitespace-nowrap ${isSorting && "cursor-pointer"} ${
              useBorderDesign
                ? "bg-[#F7F9FB] text-sm border-solid border-[#EDF2F6]"
                : "bg-[#F7F9FB] text-sm border-b-2 border-solid border-[#EDF2F6]"
            } `}
          >
            <TableRow {...headingRowProps} className="">
              {headings.map((item, index) => (
                <TableCell
                  className={`th ${index === 0 ? "pl-36" : ""} w-[${
                    100 / headings?.length
                  }%] bg-[#F7F9FB] text-[#757982] text-[12px]`}
                  key={index}
                  align={
                    headings.length === index || index === 0 ? "left" : "center"
                  }
                >
                  {isSorting ? (
                    <div
                      className={`flex items-center ${index != 0 ? " justify-center" : ""}`}
                      onClick={() => {
                        if (typeof onSort == "function") {
                          onSort(item);
                        } else null;
                      }}
                    >
                      {index === 0 && check && (
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
                      {indexlength == 2
                        ? index != headings.length - indexlength &&
                          index < headings.length - 2 && (
                            <>
                              {sortColumn == item ? (
                                sortOrder != "asc" ? (
                                  <HeadIcon
                                    className="mr-10"
                                    onClick={() => {
                                      if (typeof onSort == "function") {
                                        onSort(item);
                                      } else null;
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={"../assets/images/Mask group.png"}
                                    className="mr-10"
                                    onClick={() => {
                                      if (typeof onSort == "function") {
                                        onSort(item);
                                      } else null;
                                    }}
                                  />
                                )
                              ) : (
                                <HeadIcon
                                  className="mr-10"
                                  onClick={() => {
                                    if (typeof onSort == "function") {
                                      onSort(item);
                                    } else null;
                                  }}
                                />
                              )}
                            </>
                          )
                        : index != headings.length - 1 && (
                            <>
                              {sortColumn == item ? (
                                sortOrder != "asc" ? (
                                  <HeadIcon
                                    className="mr-10"
                                    onClick={() => {
                                      if (typeof onSort == "function") {
                                        onSort(item);
                                      } else null;
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={"../assets/images/Mask group.png"}
                                    className="mr-10"
                                    onClick={() => {
                                      if (typeof onSort == "function") {
                                        onSort(item);
                                      } else null;
                                    }}
                                  />
                                )
                              ) : (
                                <HeadIcon
                                  className="mr-10"
                                  onClick={() => {
                                    if (typeof onSort == "function") {
                                      onSort(item);
                                    } else null;
                                  }}
                                />
                              )}
                            </>
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

          {/* <div className="max-h-[120px] overflow-auto" > */}
          <TableBody className="max-h-[120px] overflow-scroll">
            {children}
          </TableBody>
          {/* </div> */}
        </Table>
      </TableContainer>
    );
  }
);

export default CommonDragTable;
