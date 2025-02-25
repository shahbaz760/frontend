/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { RefreshToken, setPassword } from "app/store/Auth";
import { useAppDispatch } from "app/store/store";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
  RejectKYCIcon,
} from "public/assets/icons/welcome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function RejectKyc() {
  // State to track loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const { jwtService } = useAuth();
  const [disable, setDisable] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const navigate = useNavigate();

  async function onSubmit(formData: FormType) {
    const data = {
      password: formData.password,
      token,
    };
    setIsLoading(true);
    const { payload } = await dispatch(setPassword(data));
    setIsLoading(false);
    if (payload?.data?.status) {
      navigate("/sign-in");
    }
  }

  const redirect = async () => {
    await jwtService.agentSignIn();
  };

  const fetchData = async () => {
    setDisable(true);
    try {
      const payload = {
        token,
      };
      // @ts-ignore
      const res = await dispatch(RefreshToken(payload));
      setUserDetail(res?.payload?.data?.data ?? null);

      redirect();
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setDisable(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = async () => {
    navigate(`/kyc-doc/${token}?isRetry=true`);
    // onSuccess();
  };

  return (
    <div className="flex  items-center flex-col px-28 py-60  gap-32 ">
      <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
      <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
      <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />
      <div className="pb-32">
        <img src="assets/icons/remote-icon.svg" alt="" />
      </div>

      <div
        className="bg-[#fff] sm:min-w-[60%] h-auto sm:py-[8rem] py-32  sm:px-20 flex flex-col items-center
         justify-center rounded-lg shadow-md gap-32 mb-20 "
      >
        <div className="flex flex-col justify-center items-center gap-20 w-3/4 ">
          <div className="relative">
            <RejectKYCIcon />
          </div>
          <div>
            <Typography className="sm:text-[48px] text-[35px] text-center font-700 leading-normal pb-20">
              Your KYC has been rejected
            </Typography>
            <p className="text-[18px] font-400 text-[#757982] leading-normal text-center md:w-[70%] m-auto ">
              Please review the rejection reason below, update your KYC details
              accordingly, and resubmit your request. Thank you for your
              cooperation.
            </p>
          </div>
          <div className="pb-20">
            <h4 className="text-center font-600 text-[18px] ">Reason</h4>
            {disable ? (
              <Box
                id="spinner"
                sx={{
                  "& > div": {
                    backgroundColor: "palette.secondary.main",
                  },
                }}
              >
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </Box>
            ) : (
              <p className="text-[15px] font-400 text-[#757982] leading-normal text-center mt-[10px] m-auto">
                {userDetail?.user?.reject_reason ?? ""}
              </p>
            )}
          </div>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            disabled={disable}
            className="text-[18px] font-500 sm:min-w-[417px] w-[300px]"
            onClick={handleButtonClick}
          >
            Update KYC
          </Button>
        </div>
      </div>
    </div>
  );
}
