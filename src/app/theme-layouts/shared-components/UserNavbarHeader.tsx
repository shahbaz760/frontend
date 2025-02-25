import { darken, styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { EmailIcon } from "public/assets/icons/common";
import { Button } from "@mui/material";

const Root = styled("div")(({ theme }) => ({
  "& .username, & .email": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },

  "& .avatar": {
    background: darken(theme.palette.background.default, 0.05),
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    bottom: 0,
    "& > img": {
      borderRadius: "50%",
    },
  },
}));

/**
 * The user navbar header.
 */
function UserNavbarHeader() {
  const user = useSelector(selectUser);

  return (
    <div className="flex justify-center pb-20">
      <Root className="user relative flex flex-col items-center justify-center p-20 shadow-0 bg-[#393F4C] rounded-[10px]">
        <div className="mb-12 flex items-center justify-center">
          <Avatar
            sx={{
              backgroundColor: "background.paper",
              color: "text.secondary",
            }}
            className="avatar uppercase h-[60px] w-[60px] text-32 font-bold"
            src={user.data.photoURL}
            alt={user.data.displayName}
          >
            {user?.data?.displayName?.charAt(0)}
          </Avatar>
        </div>
        <Typography className="username whitespace-nowrap text-[16px] font-semibold">
          {user?.data?.displayName}
        </Typography>
        <Typography className="username whitespace-nowrap text-[12px] font-medium text-[#E7E8E9] py-2">
          Admin User
        </Typography>
        <Typography className="email whitespace-nowrap text-13 font-medium flex text-[#E7E8E9] items-center gap-5">
          <EmailIcon className="text-white" />
          {user.data.email}
        </Typography>
        <Button
          variant="outlined"
          color="info"
          className="mt-28 w-full h-[30px] text-[12px] font-medium leading-normal"
          aria-label="Log In"
          size="large"
        >
          Send a Message
        </Button>{" "}
        <Button
          variant="contained"
          color="secondary"
          className="mt-10 w-full h-[30px] text-[12px] font-medium leading-normal"
          aria-label="Log In"
          size="large"
        >
          Submit
        </Button>
      </Root>
    </div>
  );
}

export default UserNavbarHeader;
