import { Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import remoteIcon from "public/assets/images/pages/add-project/remoteIcon.png";
import InputField from "src/app/components/InputField";

export default function AddProject() {
  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {},
  });
  return (
    <div className="h-full flex flex-col gap-40 items-center justify-center bg-cover bg-no-repeat bg-[url('public/assets/images/pages/add-project/addProjectBg.svg')]">
      <img className="w-[200px] md:w-[250px]" src={remoteIcon} alt="" />
      <div className="flex flex-col items-center px-[20px] py-[20px] bg-white shadow-lg rounded-[10px] sm:px-[170px] sm:py-[120px]">
        <Typography className="text-[36px] font-bold">Let's Start</Typography>
        <Typography
          className="text-center text-[18px] mt-10"
          color="primary.light"
        >
          To begin, kindly include the name of your project.
        </Typography>
        <InputField
          className="mt-40"
          formik={formik}
          name="name"
          label="Name Your First Project"
          placeholder="Enter Your First Project Name"
        />
        <Button
          variant="contained"
          color="secondary"
          className="mt-52 w-full h-[50px] text-[18px] font-bold"
          aria-label="Log In"
          size="large"
          onClick={() => formik.handleSubmit()}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
