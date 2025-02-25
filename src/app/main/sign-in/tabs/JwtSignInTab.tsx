import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useGoogleLogin } from "@react-oauth/google";
import { restAll } from "app/store/Auth";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import InputField from "src/app/components/InputField";
import { loginSchema } from "src/formSchema";

type FormType = {
  email: string;
  password: string;
  remember?: boolean;
};

function jwtSignInTab() {
  const { jwtService } = useAuth();
  const { error } = useSelector((state: RootState) => state.auth);
  const [check, setCheck] = useState(false);
  let [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);
  const [initial, setInitial] = useState(false);
  let [passErrorMsg, setPassErrorMsg] = useState<string | null>(null);
  let [ErrorMsg, setErrorMsg] = useState<string | null>(null);
  const { loginWithRedirect } = useAuth0();
  // State to track loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const FbAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
  const dispatch = useAppDispatch();
  const onSubmit = useCallback(async (formData) => {
    const { email, password } = formData;
    setIsLoading(true);
    await jwtService.signIn({ email, password });
    setIsLoading(false);
    // formik.resetForm();
  }, []);

  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    // Submit the form using Formik
    formik.handleSubmit();

    // Reset any state related to your form or form validation checks

    // Reset check state or any other state as needed
    setCheck(!check);
  };

  const responseFacebook = async (response) => {
    const fullName = response?.name.split(" ");
    if (response.id) {
      const payload = {
        id: response.id,
        type: 2,
        firstname: fullName[0],
        lastname: fullName.slice(1).join(" "),
        email: response.email ? response.email : `${response.id}@facebook.com`,
      };
      await jwtService.socialSignIn(payload);
    } else {
      console.error("Facebook login failed:", response);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // Use the token to fetch user details from Google's API
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((user) => {
          const fullName = user?.name.split(" ");
          const payload = {
            id: user.sub,
            type: 1,
            firstname: fullName[0],
            lastname: fullName.slice(1).join(" "),
            email: user.email,
          };
          // onLogin(user);
          jwtService.socialSignIn(payload);
        })
        .catch((error) => console.error("Error fetching user info:", error));
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmailErrorMsg(null);
      dispatch(restAll());
      formik.setFieldError("password", "");
    }
    if (name === "password") {
      setPassErrorMsg(null);
      dispatch(restAll());
      formik.setFieldError("password", "");
    }
    formik.handleChange(event);
  };

  useEffect(() => {
    if (initial) {
      if (error && (error.includes("email") || error.includes("Email"))) {
        setEmailErrorMsg(error);
      } else {
        setEmailErrorMsg(null);
      }

      if (error && (error.includes("Password") || error.includes("password"))) {
        setPassErrorMsg(error);
      } else {
        setPassErrorMsg(null);
      }

      if (
        error &&
        !(error.includes("Password") || error.includes("password")) &&
        !(error.includes("email") || error.includes("Email"))
      ) {
        setErrorMsg(error);
      } else {
        setErrorMsg(null);
      }
    }
    setInitial(true);
  }, [error, check]);

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   if (name === "email") {
  //     setEmailErrorMsg(null);
  //   }
  //   if (name === "password") {
  //     setPassErrorMsg(null);
  //   }
  //   // Handle other form changes if needed
  // };
  // if (jwtService?.isLoading == true) {
  //   return <FuseLoading />;
  // }
  return (
    <div className="w-full mt-32 max-w-[417px] flex gap-16 flex-col">
      {ErrorMsg &&
        (ErrorMsg.includes("inactive") ||
          ErrorMsg.includes("has been deleted")) && (
          <span
            className="text-red pt-[1px] block"
            dangerouslySetInnerHTML={{
              __html: ErrorMsg.replace(
                /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
                (email) => `<strong>${email}</strong>`
              ),
            }}
          />
          // <span className=" text-red pt-[1px]  block ">{ErrorMsg}</span>
        )}
      <form onSubmit={handleSubmit}>
        <InputField
          formik={formik}
          name="email"
          label="Email Address"
          placeholder="Enter Email Address"
          onChange={handleChange}
        // inputRef={input => input && input.focus()}
        />
        <div>
          {formik?.values.email != "" ? (
            <span className=" text-red pt-[1px]  block ">{emailErrorMsg}</span>
          ) : (
            ""
          )}
        </div>
        <InputField
          formik={formik}
          name="password"
          label="Password"
          type="password"
          onChange={handleChange}
          placeholder="Enter Password"
          sx={{
            ".MuiInputBase-input": {
              paddingRight: "34px",
            },
          }}
        />
        <div>
          <span className=" text-red pt-[1px]  block ">{passErrorMsg}</span>
        </div>

        <Link
          className="text-[16px] font-medium !no-underline w-fit inline-block mt-10"
          to="/forgot-password"
        >
          Forgot Password
        </Link>
        <Button
          variant="contained"
          color="secondary"
          className="mt-28 w-full h-[50px] text-[18px] font-bold"
          aria-label="Log In"
          size="large"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <Box
              marginTop={0}
              id="spinner"
              sx={{
                "& > div": {
                  backgroundColor: "palette.secondary.main",
                },
              }}
            >
              <div className="bounce1 mt-[-40px] !bg-[#4f46e5]" />
              <div className="bounce2 mt-[-40px] !bg-[#4f46e5]" />
              <div className="bounce3 mt-[-40px] !bg-[#4f46e5]" />
            </Box>
          ) : (
            "Log In"
          )}
        </Button>
      </form>
      <div className="flex items-center mt-12">
        <div className="flex-auto mt-px border-t" />
        <Typography className="mx-8" color="text.secondary">
          Or continue with
        </Typography>
        <div className="flex-auto mt-px border-t" />
      </div>
      <div className="flex justify-center mt-16">
        <Button
          variant="contained"
          className="w-full max-w-[345px] h-[56px] max-h-[56px] text-[18px] focus:bg-white font-medium border
           bg-white border-solid border-[#E7E8E9] focus:shadow-lg shadow-lg  rounded-full"
          aria-label="Log In"
          onClick={() => login()}
        >
          <img src="assets/icons/google.svg" alt="" className="mr-14" />
          Log In with Google
        </Button>
      </div>

      <div className="flex justify-center mt-8">
        <div className="w-full">
          <FacebookLogin
            appId={FbAppId}
            // autoLoad
            testusers={true}
            scope="email"
            callback={responseFacebook}
            className=" !w-[345px] !h-[56px] max-h-[56px] text-[18px] focus:bg-white  font-medium border !bg-white border-solid !border-[#E7E8E9] !shadow-lg !rounded-full buttonNew mx-auto"
            icon={
              <img src="assets/icons/facebook.svg" alt="" className="mr-14" />
            }
            cssClass="facebook-login-btn flex items-center justify-center mx-auto w-full !max-w-[345px] !h-[56px] max-h-[56px] text-[18px] font-medium border !bg-white border-solid !border-[#E7E8E9] !shadow-lg !rounded-full buttonNew"
            textButton="&nbsp;&nbsp; Log In with Facebook"
          />
        </div>
      </div>


      {/* <div className="flex items-center justify-center mt-20 cursor-pointer gap-6">
        <Typography color="text.secondary">New User?</Typography>
        <Typography color="secondary.main">
          Create Account
        </Typography>
      </div> */}
    </div>
  );
}
export default React.memo(jwtSignInTab);
