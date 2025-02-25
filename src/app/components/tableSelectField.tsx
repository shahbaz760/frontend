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
  width: "100%",
  borderRadius: "8px",
  backgroundColor: "#f6f6f6",
  lineHeight: 1.4,
  "&.MuiInputBase-root": {
    "& .MuiOutlinedInput-input": {
      paddingRight: "14px !important",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      border: "none",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderWidth: "1px",
        borderColor: theme.palette.secondary.main,
      },
    },
    "& .MuiSelect-select": {
      padding: "2px 14px 2px 24px",
      minHeight: "auto",
      alignItems: "center",
      textOverflow: "ellipsis", // Ensure ellipsis is applied
      overflow: "hidden", // Hide overflowing content
      whiteSpace: "nowrap", // Ensure no wrapping
      position: "relative",
    },
    "& .MuiSelect-icon": {
      // Conditionally set icon position based on prop
      left: "2px",
    },
  },
}));

function TableSelectField({
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
    <div className={`${rest.className} `}>
      {label && (
        <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
          {label}
        </FormLabel>
      )}
      <div className="relative">
        <StyledSelect
          name={name}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formikValue}
          onChange={handleFormikChange}
          MenuProps={{
            sx: {
              "& .MuiList-root": {
                paddingBottom: "2rem",
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
          <span className="absolute text-para_light text-lg left-16 top-[50%] translate-y-[-50%] pointer-events-none">
            {rest.placeholder}
          </span>
        ) : null}
      </div>
      <span className="">{formik?.errors[name] && formik?.touched[name]}</span>
    </div>
  );
}

export default TableSelectField;
