import {
  MenuItem,
  Pagination,
  PaginationProps,
  TextField,
  styled,
} from "@mui/material";
// import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import React from "react";

interface IProps extends PaginationProps {
  onPageChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
  currentPage?: number;
  count?: number;
  onChange?: any;
  total?: any;
  title?: any;
  setLimit?: any;
  limit?: number;
  responsive?: boolean;
}

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& ul": {
    alignItems: "initial",
  },
  "& li": {
    margin: "0 4px",
  },
  "& .MuiPaginationItem-root": {
    border: "1px solid #E7E8E9",
    borderRadius: 4,
    margin: 0,
    height: 32,
    width: 32,
    backgroundColor: "transparent",
    "& .MuiSvgIcon-root": {
      width: "1.3em",
      height: "auto",
      color: "#9DA0A6",
    },
    "&.Mui-selected": {
      color: theme.palette.secondary.main,
      borderColor: "currentColor",
      backgroundColor: "transparent",
    },
    "&.Mui-disabled": {
      opacity: 0.5,
      backgroundColor: "#E7E8E9",
      borderColor: "#9DA0A6",
    },
  },
}));

function CommonPagination({
  onPageChange,
  currentPage,
  count,
  setLimit,
  total,
  limit,
  responsive,
  ...rest
}: IProps) {
  const handleChangeCount = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setLimit(value);
  };

  return (
    <Stack
      spacing={2}
      flexDirection={"row"}
      gap={3}
      alignItems={"center"}
      sx={
        responsive && {
          "@media (max-width: 600px)": {
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }
      }
    >
      {count > 1 && (
        <Pagination
          count={count}
          siblingCount={1}
          boundaryCount={1}
          page={currentPage}
          onChange={onPageChange}
          sx={{
            "& .Mui-selected": {
              borderColor: "#4f46e5",
              background: "#fff",
            },
            "& .MuiPagination-ul": {
              flexWrap: "nowrap",
            },
          }}
          {...rest}
          variant="outlined"
          shape="rounded"
        />
      )}
      {total > 20 && (
        <div
          style={{
            marginTop: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span className="font-500 text-15">Show Entries</span>
          <TextField
            select
            defaultValue="20"
            size="small"
            value={limit}
            onChange={handleChangeCount}
            sx={{
              "&.MuiTextField-root": {
                minHeight: "32px !important",
                minWidth: "70px !important",
              },
            }}
          >
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={500}>500</MenuItem>
          </TextField>
        </div>
      )}
    </Stack>
  );
}

export default CommonPagination;
