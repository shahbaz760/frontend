import { Box, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { RootState } from "app/store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BreadcrumbsComponent = () => {
  const { breadcrumbs } = useSelector((state: RootState) => state.breadcrumb);
  const navigate = useNavigate();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string
  ) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <Box
      sx={{
        padding: "0px 30px",
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-ol": {
            overflow: "auto",
            flexWrap: "nowrap",
            width: { xs: 150, sm: "100%" },
          },
          "& .MuiBreadcrumbs-li": {
            textWrap: "nowrap",

          },
          "& .MuiBreadcrumbs-separator": {
            margin: '0px 2px',

          }
        }}
      >
        {breadcrumbs.map((crumb, index: number) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography
              key={index}
              color="blue"
              sx={{
                fontWeight: 500,
                fontSize: 15,
                cursor: "text",
              }}
              aria-current="page"
            >
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={index}
              color="GrayText"
              underline="hover"
              onClick={(event) => handleClick(event, crumb.path)}
              sx={{
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                color: "gray !important",
                textDecoration: "none !important",
              }}
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsComponent;
