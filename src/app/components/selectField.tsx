/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  FormLabel,
  Select,
  SelectChangeEvent,
  SelectProps,
  styled,
} from "@mui/material";
import { FormikProps } from "formik";

interface IProps {
  // className?: string;
  name: string;
  label?: string;
  formik?: FormikProps<unknown>;
  value?: string;
  // props: TextFieldProps;
}

const StyledSelect = styled(Select)(({ theme }) => ({
  width: "230px",
  borderRadius: "8px",
  backgroundColor: "#f6f6f6",
  lineHeight: 1.4,
  [theme.breakpoints.up("sm")]: {
    width: "100%", // Width for larger screens
  },
  "&.MuiInputBase-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderWidth: "1px",
        borderColor: theme.palette.secondary.main,
      },
    },
    "& .MuiSelect-select": {
      padding: "0px 14px",
      minHeight: "48px",
      display: "flex",
      alignItems: "center",
      lineHeight: 1,
      color: "#000000",
    },
    "& .MuiSelect-icon": {
      color: "#666666", // Ensure the dropdown icon color is black
    },
  },
}));

function SelectField({
  // className,
  name,
  formik,
  label,
  ...rest
}: IProps & SelectProps) {
  const formikValue = formik?.values[name];

  
  const handleFormikChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;

    if (rest.multiple) {
      formik?.setFieldValue(
        name,
        typeof value === "string" ? value.split(",") : value
      );
    } else {
      formik?.setFieldValue(name, value);
    }
  };

  return (
    <div className={`${rest.className} w-full`}>
      {label && (
        <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
          {label}
        </FormLabel>
      )}
      <div className="relative">
        <StyledSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formikValue}
          onChange={handleFormikChange}
          MenuProps={{
            sx: {
              "& .MuiList-root": {
                // paddingBottom: "2rem",
              },
            },
          }}
          {...rest}
        >
          {rest.children}
        </StyledSelect>
        {rest.placeholder &&
        (!formikValue ||
          (typeof formikValue === "object" && !formikValue?.length)) ? (
          <span className="absolute text-para_light text-lg left-16 top-[50%] translate-y-[-50%] pointer-events-none ">
            {rest.placeholder}
          </span>
        ) : null}
      </div>
      <span className="">{formik?.errors[name] && formik?.touched[name]}</span>
      <span className="inline-block text-red pt-[5px]">
        {formik?.errors[name ?? ""] &&
          formik?.touched[name ?? ""] &&
          formik?.errors[name ?? ""]}
      </span>
    </div>
  );
}

export default SelectField;
