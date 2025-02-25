/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Uploadkyc, UploadkycRetry } from "app/store/Agent";
import { RefreshToken } from "app/store/Auth";
import { AuthRootState } from "app/store/Auth/Interface";
import { useAppDispatch } from "app/store/store";
import { Camera } from "public/assets/icons/common";
import { AttachmentDeleteIcon } from "public/assets/icons/supportIcons";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
} from "public/assets/icons/welcome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function UploadKyc() {
  // State to track loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams();
  const location = useLocation();
  const { jwtService } = useAuth();
  const [disable, setDisabled] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isRetry, setIsRetry] = useState(false);
  const [frontID, setFrontID] = useState(null);
  const [backID, setBackID] = useState(null);
  const [frontfile, setFrontFile] = useState(null);
  const [backfile, setBackFile] = useState(null);
  const [webcamCapture, setWebcamCapture] = useState(null);
  const webcamRef = React.useRef(null);

  const handleFrontIDChange = (event) => {
    setFrontFile(event.target.files[0]);

    setFrontID(URL.createObjectURL(event.target.files[0]));
  };
  const handleBackIDChange = (event) => {
    setBackFile(event.target.files[0]);
    setBackID(URL.createObjectURL(event.target.files[0]));
  };

  const handleWebcamFrontCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setWebcamCapture(imageSrc);
    setFrontID(imageSrc);
  }, [webcamRef]);

  const handleWebcamBackCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setWebcamCapture(imageSrc);
    setBackID(imageSrc);
  }, [webcamRef]);

  const store = useSelector((store: AuthRootState) => store.auth);
  const fileInputRef = useRef(null);
  const fileBackInputRef = useRef(null);
  //* initialise useformik hook

  const handleButtonClick = async () => {
    // Navigate to '/photo-id' route
    setDisabled(true);
    const payload = new FormData();
    try {
      if (isRetry) {
        if (frontfile !== null && backfile !== null) {
          payload.append("front_id", frontfile);
          payload.append("back_id", backfile);
          const res = await dispatch(UploadkycRetry({ payload, token }));
          if (res?.payload?.data?.status == 1) {
            navigate(`/photo-id/${token}?isRetry=true`);
            toast.success(res?.payload?.data?.message);
            setDisabled(false);
          }
        } else if (frontfile !== null) {
          payload.append("front_id", frontfile);
          const res = await dispatch(UploadkycRetry({ payload, token }));
          if (res?.payload?.data?.status == 1) {
            navigate(`/photo-id/${token}?isRetry=true`);
            toast.success(res?.payload?.data?.message);
            setDisabled(false);
          }
        } else if (backfile !== null) {
          payload.append("back_id", backfile);
          const res = await dispatch(UploadkycRetry({ payload, token }));
          if (res?.payload?.data?.status == 1) {
            navigate(`/photo-id/${token}?isRetry=true`);
            toast.success(res?.payload?.data?.message);
            setDisabled(false);
          }
        } else {
          navigate(`/photo-id/${token}?isRetry=true`);
          setDisabled(false);
        }
      } else {
        payload.append("front_id", frontfile);
        payload.append("back_id", backfile);
        const res = await dispatch(Uploadkyc({ payload, token }));
        if (res?.payload?.data?.status == 1) {
          navigate(`/photo-id/${token}`);
          toast.success(res?.payload?.data?.message);
          setDisabled(false);
        }
      }
    } catch (error) {
      toast.error(error?.message);
      setDisabled(false);
      console.error("Error fetching data:", error);
    }
  };

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
      const userInfo: any = res?.payload?.data?.data?.user ?? null;
      const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
      if (userInfo) {
        setFrontID(
          userInfo?.kyc_front_pic
            ? `${urlForImage}${userInfo?.kyc_front_pic}`
            : null
        );
        setBackID(
          userInfo?.kyc_back_pic
            ? `${urlForImage}${userInfo?.kyc_back_pic}`
            : null
        );
      }
      const queryParams = new URLSearchParams(location.search);

      if (queryParams.has("isRetry")) {
        queryParams.delete("isRetry");
        navigate({}, { replace: true });
        setIsRetry(true);
      } else {
        redirect();
      }
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickCamera = (e) => {
    e.stopPropagation();
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleClickBackCamera = (e) => {
    e.stopPropagation();
    fileBackInputRef.current.click(); // Trigger file input click
  };
  const handleBackButtonClick = () => {
    navigate(`/reject-kyc/${token}`);
  };
  return (
    <div className="flex items-center flex-col gap-32 py-60 ">
      <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
      <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
      <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />
      <img src="assets/icons/remote-icon.svg" alt="" />

      <div className="bg-[#fff] sm:min-w-[60%] h-auto sm:py-[8rem] py-20 px-20 sm:px-24 flex justify-center rounded-lg shadow-md mx-20 sm:mx-0">
        <div className="flex flex-col justify-center sm:gap-40 gap-0">
          <Typography className="sm:text-[48px] text-[34px] text-center font-700 leading-normal">
            Upload KYC
            <p className="text-[18px] font-400 text-[#757982] pt-20 sm:leading-4 leading-6">
              To initiate, kindly provide your KYC documents.
            </p>
          </Typography>
          <div className="flex items-center justify-center gap-20 sm:flex-row flex-col py-32 ">
            <div className="relative">
              {frontID ? (
                <div className="absolute top-7 right-10">
                  <AttachmentDeleteIcon
                    onClick={(event) => {
                      event.stopPropagation();
                      setFrontFile(null);
                      setFrontID(null);
                    }}
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                ""
              )}
              <label
                className={`bg-[#EDEDFC] border-1 border-dashed border-[#4F46E5] flex flex-col rounded-6 items-center  ${
                  !frontID ? "py-60" : "py-60"
                } gap-14 w-[236px] h-[192px] cursor-pointer`}
                onClick={handleFrontIDChange}
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFrontIDChange}
                  // ref={fileInputRef}
                />

                {frontID ? (
                  <img
                    src={frontID}
                    alt="Front ID"
                    className="w-[100px] max-w-xs h-[100px] "
                  />
                ) : (
                  <>
                    <button
                      onClick={handleClickCamera}
                      className="text-white px-4 py-2"
                    >
                      <Camera />
                    </button>
                    <div className="w-full max-w-xs h-40 flex justify-center items-center">
                      <span className="text-[16px] font-500 text-[#111827]">
                        Upload Front ID Pic
                      </span>
                    </div>
                  </>
                )}
              </label>
            </div>

            <div className="relative">
              {backID ? (
                <div className="absolute top-7 right-10">
                  <AttachmentDeleteIcon
                    onClick={(event) => {
                      event.stopPropagation();
                      setBackFile(null);
                      setBackID(null);
                    }}
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                ""
              )}
              <label
                className={`bg-[#EDEDFC] border-1 border-dashed border-[#4F46E5] flex flex-col rounded-6 items-center  ${
                  !backID ? "py-60" : "py-60"
                } gap-14 w-[236px] h-[192px] cursor-pointer`}
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleBackIDChange}
                  ref={fileBackInputRef}
                />
                {backID ? (
                  <img
                    src={backID}
                    alt="Back ID"
                    className=" w-[100px] max-w-xs h-[100px]"
                  />
                ) : (
                  <>
                    <button
                      onClick={handleClickBackCamera}
                      className="text-white px-4 py-2"
                    >
                      <Camera />
                    </button>
                    <div className="w-full max-w-xs h-40 flex justify-center items-center">
                      <Typography className="text-[16px] font-500 text-[#111827]">
                        Upload Back ID Pic
                      </Typography>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* <Link to="/photo-id"> */}
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
      <div className="flex gap-[10px] flex-wrap justify-center ">
        {isRetry ? (
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={handleBackButtonClick}
            className="text-[18px] font-500 min-w-[196px]"
          >
            Back
          </Button>
        ) : null}
        <Button
          variant="contained"
          color="secondary"
          size="large"
          className="text-[18px] font-700 min-w-[196px]"
          disabled={!frontID || !backID || disable}
          onClick={handleButtonClick}
        >
          Next
        </Button>
        {/* </Link> */}
      </div>
    </div>
  );
}
