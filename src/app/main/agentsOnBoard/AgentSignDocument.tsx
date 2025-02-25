import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { setPassword } from "app/store/Auth";
import { AuthRootState } from "app/store/Auth/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
} from "public/assets/icons/welcome";
import signDoc from "public/assets/images/etc/signDocument.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassSchemaWeek } from "src/formSchema";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function AgentSignDocument() {
  // State to track loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams();
  const dispatch = useAppDispatch();
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
    let data = {
      password: formData.password,
      token,
    };
    setIsLoading(true);
    let { payload } = await dispatch(setPassword(data));
    setIsLoading(false);
    if (payload?.data?.status) {
      navigate("/sign-in");
    }
  }
  const title = [
    {
      description: " Upload Front ID Pic",
    },
    {
      description: " Upload Back ID Pic",
    },
  ];
  //
  return (
    <>
      <div className="flex items-center flex-col gap-32 py-32 ">
        <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
        <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
        <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />
        <img src="assets/icons/remote-icon.svg" alt="" />

        <div className="bg-[#fff] sm:min-w-[60%] h-auto  py-20 px-20 sm:px-24 flex justify-center rounded-lg shadow-md ">
          <div className="flex flex-col justify-center gap-40 ">
            <Typography className="text-[48px] text-center font-700 leading-normal">
              Sign Document
              <p className="text-[18px] font-400 text-[#757982] leading-4 pt-20">
                To proceed, please review the document and provide your
                signature.
              </p>
            </Typography>
            <div className="text-center width-full m-auto pb-20 object-cover">
              <img src={signDoc} alt="" className="object-fit" />
            </div>
          </div>
        </div>
        <Link to="/kyc-doc/:token">
          <Button
            variant="contained"
            color="secondary"
            size="large"
            className="text-[18px] font-700 min-w-[196px]"
          >
            Next
          </Button>
        </Link>
      </div>
    </>
  );
}
