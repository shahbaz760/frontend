import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { UploadImage, UploadkycRetry } from "app/store/Agent";
import { RefreshToken } from "app/store/Auth";
import { useAppDispatch } from "app/store/store";
import { RetakeIcon } from "public/assets/icons/common";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
} from "public/assets/icons/welcome";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import MicrophonePopup from "src/app/components/client/MicrophonePopup";

export default function PhotoId() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [frontID, setFrontID] = useState<string | null>(null);
  const { jwtService } = useAuth();
  const location = useLocation();
  const [isRetry, setIsRetry] = useState(false);
  const [frontfile, setFrontFile] = useState<File | null>(null);
  const [snowCamera, setShowCamera] = useState<string>("");
  const [webcamCapture, setWebcamCapture] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState<boolean>(true);
  const [disable, setDisabled] = useState(false);
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const [isMediaModal, setIsMediaModal] = useState(false);
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam | null>(null);
  const [permissions, setPermissions] = useState("");
  const store = useSelector((store: any) => store.auth);

  const handleWebcamFrontCapture = useCallback(() => {
    if (webcamRef.current) {
      setShowWebcam(true);
      const imageSrc = webcamRef.current.getScreenshot();
      setWebcamCapture(imageSrc);

      setFrontID(imageSrc);
      if (imageSrc) {
        const byteString = atob(imageSrc.split(",")[1]);
        const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], "capture.jpg", { type: mimeString });
        setFrontFile(file);
      }
      setShowWebcam(false); // Hide webcam after capturing the photo
    }
  }, [webcamRef, permissions]);

  const redirect = async () => {
    await jwtService.agentSignIn();
  };

  const fetchData = async () => {
    try {
      const payload = { token };
      const res = await dispatch(RefreshToken(payload));
      const userInfo: any = res?.payload?.data?.data?.user ?? null;
      const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

      if (userInfo) {
        setFrontID(
          userInfo?.captured_pic
            ? `${urlForImage}${userInfo?.captured_pic}`
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBackButtonClick = () => {
    navigate(`/kyc-doc/${token}?isRetry=true`);
  };

  const handleButtonClick = async () => {
    setDisabled(true);
    const payload = new FormData();
    payload.append("is_finalized", "1");
    if (isRetry) {
      try {
        if (frontfile !== null) {
          payload.append("captured_pic", frontfile);
          const res = await dispatch(UploadkycRetry({ payload, token }));
          if (res?.payload?.data?.status == 1) {
            navigate(`/upload-doc/${token}`);
            toast.success(res?.payload?.data?.message);
            setDisabled(false);
          }
        } else {
          const res = await dispatch(UploadkycRetry({ payload, token }));
          if (res?.payload?.data?.status == 1) {
            navigate(`/upload-doc/${token}`);
            toast.success(res?.payload?.data?.message);
            setDisabled(false);
          }
        }
      } catch (error) {
        toast.error(error?.message);
        setDisabled(false);
        console.error("Error uploading image:", error);
      }
    } else {
      if (frontID) {
        payload.append("files", frontfile);
      }

      try {
        const res = await dispatch(UploadImage({ payload, token }));
        if (res?.payload?.data?.status === 1) {
          navigate(`/upload-doc/${token}`);
          setDisabled(false);
          toast.success(res?.payload?.data?.message);
        }
      } catch (error) {
        toast.error(error?.message);
        setDisabled(false);
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMediaAccess = async () => {
    try {
      const permission = await navigator.permissions.query({
        //@ts-ignore
        name: "camera",
      });

      if (permission.state === "denied") {
        setShowCamera("denied");
        setIsMediaModal(true);
      } else if (permission.state === "granted") {
        setShowCamera("granted");
        setIsMediaModal(false);
        setShowWebcam(true);
      } else if (permission.state === "prompt") {
        try {
          setShowCamera("prompt");
          await navigator.mediaDevices.getUserMedia({ video: true });
          setIsMediaModal(false);
          setShowWebcam(true);
        } catch (error) {
          setIsMediaModal(true);
        }
      }

      permission.onchange = async () => {
        if (permission.state === "denied") {
          setIsMediaModal(true);
          setShowCamera("denied");
        } else if (permission.state === "granted") {
          setShowCamera("granted");
          setIsMediaModal(false);
          setShowWebcam(true);
        } else if (permission.state === "prompt") {
          try {
            setShowCamera("prompt");
            await navigator.mediaDevices.getUserMedia({ video: true });
            setIsMediaModal(false);
            setShowWebcam(true);
          } catch (error) {
            setIsMediaModal(true);
          }
        }
      };
    } catch (error) {
      console.error("Error checking media permissions:", error);
    }
  };

  const handleRetake = () => {
    setWebcamCapture(null);
    setFrontID(null);
    setFrontFile(null);
    setShowWebcam(true);
    setShowCamera("granted");
    handleMediaAccess();
  };

  useEffect(() => {
    handleMediaAccess();
  }, [snowCamera]);

  useEffect(() => {
    if (!isMediaModal && showWebcam) {
      handleWebcamFrontCapture();
    }
  }, [isMediaModal]);

  return (
    <div className="flex items-center flex-col gap-32 px-28 py-32">
      <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
      <CircleLeft1Icon className="hidden sm:block absolute bottom-0 left-0 z-[-1]" />
      <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />

      <img src="assets/icons/remote-icon.svg" alt="" />

      <div className="bg-[#fff] sm:min-w-[60%] h-auto sm:py-[8rem] py-60 px-20 sm:px-20 flex justify-center rounded-lg shadow-md">
        <div className="flex flex-col justify-center gap-40">
          <Typography className="text-[48px] text-center font-700 leading-normal">
            Capture a Photo
            <p className="text-[18px] font-400 text-[#757982] sm:leading-4 py-20">
              To proceed, please take a photo while holding your ID.
            </p>
          </Typography>
          <div className="flex justify-center">
            {!isMediaModal ? (
              <div
                className="flex flex-col gap-[20px]"
                style={{ alignItems: "center" }}
              >
                {frontID ? (
                  <img src={frontID} alt="Front ID" className="w-full" />
                ) : (
                  showWebcam && (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full"
                    />
                  )
                )}
                <div className="border-spacing-5 border-3 border-[#4f46e5] rounded-full">
                  {frontID ? (
                    <button onClick={handleRetake}>
                      <RetakeIcon />
                    </button>
                  ) : showWebcam ? (
                    <button
                      onClick={handleWebcamFrontCapture}
                      className="bg-[#4f46e5] border-2 h-[54px] w-[54px] rounded-full p-2 m-2"
                    ></button>
                  ) : (
                    <button
                      onClick={() =>
                        alert(
                          "Camera access is denied. Please enable camera permissions in your device or browser settings."
                        )
                      }
                      className="bg-[#4f46e5] border-2 h-[54px] w-[54px] rounded-full p-2 m-2"
                    ></button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
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
      <div className="flex gap-[10px] flex-wrap justify-center">
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
          onClick={handleButtonClick}
          disabled={!frontID || disable}
          className="text-[18px] font-500 min-w-[196px]"
        >
          Next
        </Button>
      </div>
      <MicrophonePopup
        isOpen={isMediaModal}
        setIsOpen={setIsMediaModal}
        heading="Whoops! Looks like you denied access"
        media="media"
      />
    </div>
  );
}
