import { TextField, TextFieldProps } from "@mui/material";
import { FormikProps } from "formik";
import { useState } from "react";

interface CustomButtonProps {
  name: string;
  label?: string;
  formik?: FormikProps<unknown>;
  type?: string;
  inputClass?: string;
  hideTopPadding?: boolean;
}

function InputFieldWithOption({
  name,
  formik,
  label,
  type = "text",
  inputClass,
  hideTopPadding,
  ...rest
}: CustomButtonProps & TextFieldProps) {
  const [isType, setIsType] = useState<string>(type);
  const handleEyeToggle = () => {
    setIsType(isType === "text" ? "password" : "text");
  };

  return (
    <div className={`${rest.className} common-inputField w-full`}>
      <div className={`input_wrap ${inputClass}`}>
        <TextField
          type={isType}
          onChange={(e) => formik.setFieldValue(name, e.target.value)}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={formik?.values[name ?? ""]}
          error={!!(formik?.errors[name ?? ""] && formik?.touched[name ?? ""])}
          {...rest}
          className=""
        />
        {type === "password" && (
          <span
            className="password_icon"
            onClick={handleEyeToggle}
            aria-hidden="true"
          >
            <img
              src={
                isType === "password"
                  ? "assets/icons/invisibleEye.svg"
                  : "assets/icons/visibleEye.svg"
              }
              alt=""
            />
          </span>
        )}
      </div>
      {!hideTopPadding && (
        <span className="inline-block text-red pt-[5px]">
          {formik?.errors[name ?? ""] &&
            formik?.touched[name ?? ""] &&
            formik?.errors[name ?? ""]}
        </span>
      )}
    </div>
  );
}

export default InputFieldWithOption;
