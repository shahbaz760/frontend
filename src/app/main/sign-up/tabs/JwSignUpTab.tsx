import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import InputField from "src/app/components/InputField";
import { z } from "zod";
import { SignUpPayload, useAuth } from "../../../auth/AuthRouteProvider";

/**
 * Form Validation Schema
 */
const schema = z
  .object({
    displayName: z.string().nonempty("You must enter your name"),
    email: z
      .string()
      .email("You must enter a valid email")
      .nonempty("You must enter an email"),
    password: z
      .string()
      .nonempty("Please enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum."),
    passwordConfirm: z.string().nonempty("Password confirmation is required"),
    acceptTermsConditions: z
      .boolean()
      .refine(
        (val) => val === true,
        "The terms and conditions must be accepted."
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

const defaultValues = {
  displayName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  acceptTermsConditions: false,
};

function JwtSignUpTab() {
  const { jwtService } = useAuth();

  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {
      const data = {
        displayName: values.name,
        email: values.email,
        password: values.password,
      };
      onSubmit(data);
    },
  });

  const { control, formState, handleSubmit, setError } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(formData: SignUpPayload) {
    const { displayName, email, password } = formData;
    jwtService
      .signUp({
        displayName,
        password,
        email,
      })
      .then(() => {
        // No need to do anything, registered user data will be set at app/auth/AuthRouteProvider
      })
      .catch(
        (
          _errors: {
            type: "email" | "password" | `root.${string}` | "root";
            message: string;
          }[]
        ) => {
          _errors.forEach(({ message, type }) => {
            setError(type, { type: "manual", message });
          });
        }
      );
  }

  return (
    <div className="w-full mt-32 max-w-[417px] flex gap-16 flex-col">
      <InputField
        formik={formik}
        name="name"
        label="Name"
        placeholder="Enter name"
      />
      <InputField
        formik={formik}
        name="email"
        label="Email"
        placeholder="Enter email"
      />
      <InputField
        formik={formik}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter password"
        sx={{
          ".MuiInputBase-input": {
            paddingRight: "34px",
          },
        }}
      />
      <InputField
        formik={formik}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Enter confirm password"
        sx={{
          ".MuiInputBase-input": {
            paddingRight: "34px",
          },
        }}
      />
      <Button
        variant="contained"
        color="secondary"
        className="mt-28 w-full h-[50px] text-[18px] font-bold"
        aria-label="Log In"
        size="large"
        onClick={() => formik.handleSubmit()}
      >
        Sign up
      </Button>
      <div className="mt-28 flex items-center cursor-pointer justify-center">
        <Typography color="text.secondary">Already have an account?</Typography>
        <Typography color="secondary.main">
          <Link className="ml-2 !no-underline font-bold " to="/sign-in">
            Log In
          </Link>
        </Typography>
      </div>
    </div>
  );
}

export default JwtSignUpTab;
