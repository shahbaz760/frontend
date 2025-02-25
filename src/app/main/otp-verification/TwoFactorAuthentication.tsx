import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  RefreshToken,
  ResendPassword,
  verify2faOtp
} from "app/store/Auth";
import { AuthRootState } from "app/store/Auth/Interface";
import { useAppDispatch } from "app/store/store";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useSelector } from "react-redux";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import AuthBox from "src/app/components/AuthBox";
import { useCountdownTimer } from "./UseCountdownTimer";

export default function TwoFactorAuthentication() {
  // const initialTime = 60;
  const [otp, setOtp] = useState<string>("");
  // State to track loading
  const { jwtService } = useAuth();
  const dispatch = useAppDispatch();
  const store = useSelector((store: AuthRootState) => store);
  const navigate: NavigateFunction = useNavigate();
  const email = JSON.parse(localStorage.getItem("email"));
  const initialTime = 120; // Initial countdown time in seconds
  const { timer, startTimer, resetTimer } = useCountdownTimer(initialTime);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams();

  const redirect = async () => {
    await jwtService.agentSignIn();
  };

  const fetchData = async () => {
    try {
      const payload = {
        token,
      };
      //@ts-ignore
      const res = await dispatch(RefreshToken(payload));
      redirect();
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function onSubmit() {
    let data = {
      email: email,
      otp,
      type: 1,
    };
    setIsLoading(true);
    let { payload } = await dispatch(verify2faOtp({ data, token: token }));
    if (payload?.data?.status) {
      setIsLoading(false);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }
  const handleCancel = () => {
    navigate("/signin");
  };
  useEffect(() => {
    startTimer(); // Start the countdown timer
  }, []);

  const resendOtp = async () => {
    if (timer !== 0) return null;
    await dispatch(ResendPassword({ email: email, type: 1 }));
    resetTimer(); // Reset the countdown timer
    startTimer(); // Start the countdown timer
  };

  return (
    <div className="flex flex-col items-center flex-1 min-w-0 sm:flex-row sm:justify-center md:items-start md:justify-start">
      <Paper className="flex justify-center w-full h-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:rounded-none md:p-64 md:shadow-none">
        <CardContent className="mx-auto max-w-420 sm:mx-0 sm:w-420">
          <div className="flex items-center">
            <img src="assets/icons/remote-icon.svg" alt="" />
          </div>

          <Typography className="mt-96 text-[48px] font-bold leading-tight tracking-tight">
            Two- Factor<br></br> Authentication
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography className="text-[18px] text-[#757982] mt-8 max-w-[480px]">
              Please enter the verification code that is sent to
              <span className="font-semibold"> {email}</span>
            </Typography>
          </div>

          <div className="w-full mt-40 max-w-[417px] flex gap-16 flex-col">
            <OTPInput
              inputType="tel"
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderSeparator={<span className="w-[20px]" />}
              inputStyle="h-[55px] !w-[62px] bg-[#F6F6F6] rounded-[7px] text-[16px] border focus:border-[#4F46E5]"
              renderInput={(props) => <input {...props} />}
            />
            <Button
              variant="contained"
              color="secondary"
              className="mt-40 w-full h-[50px] text-[18px] font-bold"
              aria-label="Log In"
              size="large"
              onClick={onSubmit}
              disabled={otp.length !== 4 || isLoading}
            >
              Verify
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              className={`${
                isLoading ? "btn-disable-light" : ""
              } h-[48px] text-[18px]`}
              aria-label="Log In"
              size="large"
              disabled={isLoading}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <div className="flex items-center justify-center cursor-pointer mt-28">
              <Typography
                color={timer == 0 ? "secondary.main" : "text.secondary"}
                className="font-medium"
                onClick={resendOtp}
              >
                Resend OTP {timer !== 0 && "in"}
              </Typography>

              {timer !== 0 && (
                <Typography color="secondary.main" className="ml-5 font-bold">
                  {Math.floor(timer / 60)}:
                  {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                </Typography>
              )}
            </div>
          </div>
        </CardContent>
      </Paper>
      <AuthBox />
    </div>
  );
}
