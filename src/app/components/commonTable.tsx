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
import { DownArrowBlack } from "public/assets/icons/projectsIcon";
import { BaseSyntheticEvent, ReactNode, forwardRef } from "react";
import {
  HeadIcon,
  UpArrowBlank,
  HeadIconDowns,
} from "public/assets/icons/clienIcon";
import { getUserDetail } from "src/utils";
import { useSelector } from "react-redux";
import { RootState } from "app/store/store";

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
  ref?: any;
  check?: boolean;
  indexlength?: any;
  noWrap?: boolean;
}

const CommonTable = forwardRef<HTMLTableElement, IProps>(
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
      handleSelectAll,
      isAllSelected,
      isCustomHeight,
      check = true,
      indexlength = 1,
      noWrap,
    }: IProps,
    ref
  ) => {
 
    const { Accesslist } = useSelector((state: RootState) => state.project);
    let userDetail = getUserDetail();

    return (
      <TableContainer
        style={{ maxHeight: isCustomHeight ? 200 : "100%" }}
        ref={ref}
      >
        <Table
          size="small"
          aria-label="simple table"
          className={`${useBorderDesign ? "border-design" : "common_table "}`}
        >
          <TableHead
            className={`${isSorting && "cursor-pointer"} ${
              useBorderDesign
                ? "bg-[#F7F9FB] text-sm border-solid border-[#EDF2F6] "
                : "bg-[#F7F9FB] text-sm border-b-2 border-solid border-[#EDF2F6]"
            } `}
          >
            <TableRow {...headingRowProps}>
              {headings.map((item, index) => (
                <TableCell
                  className={`th ${noWrap && index === 0 ? "pl-20 sm:!whitespace-pre-line sm:!min-w-[100px] sm:w-[30px] leading-[17px]   " : ""} w-[${
                    100 / headings?.length
                  }%]`}
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
                      {((index === 0 && check && userDetail?.role_id == 1) ||
                        (index === 0 &&
                          check &&
                          userDetail?.role_id == 4 &&
                          Accesslist?.client_view ==
                            Accesslist?.client_delete)) && (
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
                      {index === 0 &&
                        check &&
                        userDetail?.role_id == 4 &&
                        Accesslist.client_view != Accesslist.client_delete && (
                          <Checkbox
                            sx={{
                              padding: "4px",
                              color: "grey", // Grey color for disabled checkbox
                            }}
                            checked={true} // Always checked
                            disabled={true} // Always disabled
                            inputProps={{
                              "aria-labelledby": `table-checkbox-${index}`,
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
                                  <HeadIconDowns
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
                                  <HeadIconDowns
                                    className="mr-10 "
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
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
    );
  }
);

export default CommonTable;
