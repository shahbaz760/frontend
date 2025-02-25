import FuseLoading from "@fuse/core/FuseLoading";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import AuthBox from "src/app/components/AuthBox";
import JwtLoginTab from "./tabs/JwtSignInTab";

/**
 * The sign in page.
 */
function SignInPage() {
  const { jwtService } = useAuth();

  if (jwtService?.isLoading) {
    return <FuseLoading />;
  }

  return (
    <div className="flex flex-col items-center flex-1 min-w-0 sm:flex-row sm:justify-center md:items-start md:justify-start">
      <Paper className="flex justify-center w-full h-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:rounded-none md:p-64 md:shadow-none">
        <CardContent className="mx-auto max-w-420 sm:mx-0 sm:w-420">
          <div className="flex items-center">
            <img src="assets/icons/remote-icon.svg" alt="" />
          </div>

          <Typography className="mt-32 text-[48px] font-bold leading-tight tracking-tight">
            Log In
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography className="text-[18px] text-[#757982] mt-8">
              To proceed, kindly provide the required details below.
            </Typography>
          </div>

          <JwtLoginTab />
        </CardContent>
      </Paper>
      <AuthBox />
    </div>
  );
}

export default SignInPage;
