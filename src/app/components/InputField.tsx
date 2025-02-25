import {
  Button,
  FormLabel,
  TextField,
  TextFieldProps,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import { FormikProps } from "formik";
import moment from "moment";
import { DownArrow, TooltipArrow } from "public/assets/icons/topBarIcons";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#F6F6F6 ",
    color: "#111827",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "0.5px solid #B0B3B8",
    borderRadius: "10px",
    boxShadow: "2px 2px 6px 0px #00000033",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#F6F6F6",
    "&::before": {
      border: "0.5px solid #B0B3B8", // Arrow border color
      boxShadow: "2px 2px 6px 0px #00000033",
    },
  },
}));
interface CustomButtonProps {
  // className?: string;
  name: string;
  label?: string;
  formik?: FormikProps<unknown>;
  type?: string;
  inputClass?: string;
  hideTopPadding?: boolean;
  min?: any;
  tommorow?: boolean;
  max?: any;
  mainType?: any;
  readonly?: boolean;
  icon?: boolean;
  tooltipTitle?: string;
  placeStyle?: boolean;

  // props: TextFieldProps;
}

function InputField({
  // className,
  disabled = false,
  name,
  formik,
  label,
  type = "text",
  inputClass,
  hideTopPadding,
  min = 0,
  max,
  tommorow = false,
  focused = false,
  mainType = null,
  icon = false,
  readonly = false,
  tooltipTitle,
  placeStyle = false,

  ...rest
}: CustomButtonProps & TextFieldProps) {
  const [isType, setIsType] = useState<string>(type);
  const handleEyeToggle = () => {
    setIsType(isType == "text" ? "password" : "text");
  };
  const inputRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
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

  const openDatePicker = () => {
    if (inputRef.current) {
      inputRef.current?.querySelector("input")?.showPicker(); // Opens the date picker on click
    }
  };

  const maxDate = moment(max, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD");
  const maxTime = moment(max, "DD/MM/YYYY HH:mm").format("HH:mm");

  const handleChange = (e) => {
    let value = e.target.value;

    if (type == "account") {
      let fieldname = e.target.name;
      // Allow only numbers
      value = value.replace(/[^\d]/g, "");

      if (fieldname == "account_number" && value.length > 17) {
        value = value.slice(0, 17); // Limit to 17 digits
      }

      if (fieldname == "routing_number" && value.length > 9) {
        value = value.slice(0, 9); // Limit to 9 digits
      }

      formik.setFieldValue(name, value);
      return;
    }
    if (type == "number" && mainType != "comma") {
      if (value == "") {
        formik.setFieldValue(name, value);
        return;
      }
      const regex = /^\d*\.?\d{0,2}$/;
      if (regex.test(value)) {
        formik.setFieldValue(name, value);
      }
    } else if (mainType === "comma") {

      value = value.replace(/[^\d,]/g, "");

      // Ensure no consecutive commas (e.g., ,, should be replaced with ,)
      value = value.replace(/,{2,}/g, ", "); // Replace multiple commas with a single comma

      // Ensure the value starts or ends without a comma
      value = value.replace(/^,/, "");

      // Add commas after every two digits (for thousands formatting)
      value = value.replace(/(\d{2})(?=\d)/g, "$1, ");

      // Set the formatted value back to the form field
      formik.setFieldValue(name, value);
    } else {
      formik.setFieldValue(name, value);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  function formatDate(date) {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const minDate = formatDate(tomorrow);
  return (
    <div
      className={`${rest.className} ${placeStyle ? "secondary-inputField common-inputField" : "common-inputField"} w-full relative`}
    >
      {label == "no" && (
        <FormLabel className=" sm:block hidden text-[16px] font-medium text-[transparent] mb-5">
          {label}
        </FormLabel>
      )}
      {label && label != "no" && (
        <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
          <div className="flex items-center gap-5">
            <span>{label}</span>
            {icon && (
              <HtmlTooltip title={tooltipTitle} arrow>
                <span>
                  <TooltipArrow />
                </span>
              </HtmlTooltip>
            )}
          </div>
        </FormLabel>
      )}
      <div className={`input_wrap ${inputClass}`}>
        {type == "number" ? (
          <NumericFormat
            onChange={(e) => handleChange(e)}
            value={formik?.values[name ?? ""]}
            decimalScale={2}
            // isAllowed={(values) => {
            //   const { floatValue } = values;
            //   return floatValue < 1000000;
            // }}
            allowNegative={false}
            allowLeadingZeros={false}
            className={
              "w-full p-[14px] !placeholder-[#a3a6ad]  font-400 border-1 border-[#f6f6f6] focus:border-[#4f46e5] focus:outline-none"
            }
            placeholder={rest?.placeholder}
          />
        ) : (
          <TextField
            ref={inputRef}
            name={name}
            type={isType}
            disabled={disabled}
            autoFocus={focused}
            onClick={() => {
              if (type === "date") {
                openDatePicker();
              }
            }}
            inputProps={{
              min:
                type === "number"
                  ? 0
                  : type === "date"
                    ? tommorow
                      ? minDate
                      : formatDate(new Date())
                    : undefined,
              max: type === "date" && max ? maxDate : undefined,
            }}
            onChange={(e) => handleChange(e)}
            value={formik?.values[name ?? ""]}
            error={
              !!(formik?.errors[name ?? ""] && formik?.touched[name ?? ""])
            }
            onKeyDown={(e) => {
              if (type === "date" || type === "time") e.preventDefault();
            }}
            multiline={type === "textarea"}
            rows={type === "textarea" ? 4 : undefined}
            {...rest}
            className={rest.className}
          />
        )}
        {type === "password" && (
          <span
            className="password_icon bg-[#f6f6f6]"
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

      {!hideTopPadding && name != "group_name" && (
        <div>
          <span className=" text-red pt-[9px]  block ">
            {formik?.errors[name ?? ""] &&
              formik?.touched[name ?? ""] &&
              formik?.errors[name ?? ""]}
          </span>
        </div>
      )}
    </div>
  );
}

export default InputField;
