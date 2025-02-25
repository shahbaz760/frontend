import {
  FormLabel,
  TextField,
  TextFieldProps,
  InputAdornment,
} from "@mui/material";
import { FormikProps } from "formik";
import { useEffect, useRef, useState, ReactNode } from "react";
import { NumericFormat } from "react-number-format";

interface CustomButtonProps {
  name: string;
  label?: string;
  formik?: FormikProps<unknown>;
  type?: string;
  inputClass?: string;
  hideTopPadding?: boolean;
  icon?: any;
}

function InputFieldPublic({
  disabled = false,
  name,
  formik,
  label,
  type = "text",
  inputClass,
  hideTopPadding,
  icon,
  ...rest
}: CustomButtonProps & TextFieldProps) {
  const [isType, setIsType] = useState<string>(type);
  const handleEyeToggle = () => {
    setIsType(isType === "text" ? "password" : "text");
  };
  const inputRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (document.activeElement === inputRef.current) {
        event.preventDefault();
      }
    };

    const inputElement = inputRef.current;
    inputElement?.addEventListener("wheel", handleWheel);

    return () => {
      inputElement?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (type === "number") {
      if (value === "") {
        formik?.setFieldValue(name, value);
        return;
      }
      const regex = /^\d*\.?\d{0,2}$/;
      if (regex.test(value)) {
        formik?.setFieldValue(name, value);
      }
    } else {
      formik?.setFieldValue(name, value);
    }
  };

  return (
    <div className={`${rest.className} common-inputField w-full relative mb-4`}>
      {label && (
        <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
          {label}
        </FormLabel>
      )}
      <div className={`input_wrap ${inputClass}`}>
        {type === "number" ? (
          // <TextField
          //   hiddenLabel
          //   inputRef={inputRef}
          //   className="justify-center w-[27rem] shadow pe-6 border-1 border-transparent"
          //   id="filled-hidden-label-small"
          //   name={name}
          //   value={formik?.values[name ?? ""]}
          //   error={
          //     !!(formik?.errors[name ?? ""] && formik?.touched[name ?? ""])
          //   }
          //   onChange={(e: any) => handleChange(e)}
          //   variant="standard"
          //   placeholder={rest?.placeholder}
          //   InputProps={{
          //     startAdornment: (
          //       <InputAdornment position="start">
          //         <img src={icon} alt="" className="w-auto !max-w-[100]" />
          //       </InputAdornment>
          //     ),  inputComponent: NumericFormat as any,
          //     endAdornment: (
          //       <InputAdornment
          //         position="end"
          //         sx={{
          //           width: 15,
          //           display: "inline-flex",
          //         }}
          //       ></InputAdornment>
          //     ),
          //   }}
          //   sx={{
          //     pl: 2,
          //     backgroundColor: "white",
          //     border: "1px solid transparent",
          //     borderRadius: "8px",
          //     minHeight: "48px",
          //     "&:focus-within": {
          //       border: "1px solid blue",
          //     },
          //     "& .MuiInputBase-input": {
          //       backgroundColor: "white",
          //       textDecoration: "none",
          //       border: "none",
          //     },
          //     "& .MuiInput-underline:before": {
          //       border: "none !important",
          //     },
          //     "& .MuiInput-underline:after": {
          //       borderBottom: "none !important",
          //     },
          //   }}
          // />
          <div className="relative w-full">
            {icon && <InputAdornment position="start" className="absolute left-3 top-1/2 
          transform -translate-y-1/2 ">
              <img src={icon} alt="icon" className="w-24 h-24  ml-10" />
            </InputAdornment>}
            <NumericFormat
              id="filled-hidden-label-small"
              name={name}
              value={formik?.values[name ?? ""]}
              onChange={(e) => handleChange(e)}
              decimalScale={2}
              allowNegative={false}
              allowLeadingZeros={false}
              disabled={disabled}
              className={`w-full  ${icon ? 'pl-44' : 'pl-10'} !placeholder-[#a3a6ad] font-400 !bg-white shadow-md border-1 border-[#f6f6f6] focus:border-[#4f46e5] focus:outline-none`}
              placeholder={rest?.placeholder}
            />
          </div>
        ) : (
          // <NumericFormat
          //     // hiddenLabel
          //     // inputRef={inputRef}
          //     // className="justify-center w-[27rem] shadow pe-6"
          //     id="filled-hidden-label-small"
          //     name={name}
          //     value={formik?.values[name ?? ""]}
          //     // error={!!(formik?.errors[name ?? ""] && formik?.touched[name ?? ""])}
          //     onChange={(e) => handleChange(e)}
          //     // variant="standard"
          //   decimalScale={2}
          //   allowNegative={false}
          //   allowLeadingZeros={false}
          //   disabled={disabled}
          //   className={
          //     "w-full p-[14px] !placeholder-[#a3a6ad] !bg-white shadow-md font-400 border-1 border-[#f6f6f6] focus:border-[#4f46e5] focus:outline-none"
          //   }
          //   placeholder={rest?.placeholder}

          // />
          <TextField
            hiddenLabel
            inputRef={inputRef}
            className="justify-center w-[27rem] shadow pe-6 border-1 border-transparent"
            id="filled-hidden-label-small"
            name={name}
            value={formik?.values[name ?? ""]}
            error={
              !!(formik?.errors[name ?? ""] && formik?.touched[name ?? ""])
            }
            onChange={(e: any) => handleChange(e)}
            variant="standard"
            placeholder={rest?.placeholder}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={icon} alt="" className="w-auto !max-w-[100]" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    width: 15,
                    display: "inline-flex",
                  }}
                ></InputAdornment>
              ),
            }}
            sx={{
              pl: 2,
              backgroundColor: "white",
              border: "1px solid transparent",
              borderRadius: "8px",
              minHeight: "48px",
              "&:focus-within": {
                border: "1px solid blue",
              },
              "& .MuiInputBase-input": {
                backgroundColor: "white",
                textDecoration: "none",
                border: "none",
              },
              "& .MuiInput-underline:before": {
                border: "none !important",
              },
              "& .MuiInput-underline:after": {
                borderBottom: "none !important",
              },
            }}
          />
        )}
      </div>

      {formik?.touched[name] && formik?.errors[name] && (
        <div className="text-red pt-[9px]  block text-[14px]">
          {formik.errors[name]}.
        </div>
      )}
    </div>
  );
}

export default InputFieldPublic;
