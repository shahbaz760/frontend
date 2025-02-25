/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { RefreshToken, UpdateSuccess, setPassword } from "app/store/Auth";
import { AuthRootState } from "app/store/Auth/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
  PendingVerification,
  UploadDocIcon,
  UploadDocRightIcon,
} from "public/assets/icons/welcome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import { resetPassSchemaWeek } from "src/formSchema";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function UploadPage() {
  // State to track loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const { jwtService } = useAuth();
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();

  const store = useSelector((store: AuthRootState) => store.auth);

  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      cnfPassword: "",
      password: "",
    },
    validationSchema: resetPassSchemaWeek,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

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
    try {
      const payload = {
        token,
      };
      // @ts-ignore
      const res = await dispatch(RefreshToken(payload));

      redirect();
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onSuccess = async () => {
    setDisable(true);
    try {
      const payload = {
        token,
      };
      // @ts-ignore
      const res = await dispatch(UpdateSuccess(payload));
      fetchData();
      setDisable(false);
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDisable(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = async () => {
    // Navigate to '/photo-id' route
    onSuccess();
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
            <PendingVerification />
          </div>
          <div>
            <Typography className="sm:text-[48px] text-[34px] text-center font-700 leading-normal pb-20">
              KYC details are being verified.
            </Typography>
            <p className="text-[18px] font-400 text-[#757982] leading-normal text-center pb-60 md:w-[70%] m-auto ">
              Your account will be verified within 24 hours. Once approved, a
              confirmation email will be sent to your registered email address.
            </p>
          </div>
          {disable && (
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
          )}
          {/* <Button
            variant="contained"
            color="secondary"
            size="large"
            disabled={disable}
            className="text-[18px] font-500 sm:min-w-[417px] w-[300px]"
            onClick={handleButtonClick}
          >
            Ok
          </Button> */}
        </div>
      </div>
    </div>
  );
}
