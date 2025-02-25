import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import * as React from "react";
import arrowDown from "../../../public/assets/icons/number-down-arrow.svg";
import arrowUp from "../../../public/assets/icons/number-up-arrow.svg";

const CustomNumberInput = React.forwardRef(function CustomNumberInput(
  props: NumberInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { onChange } = props;
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: (
            <img src={arrowDown} alt="arrow" className="w-[10px] max-w-none" />
          ),
        },
        decrementButton: {
          children: (
            <img src={arrowUp} alt="arrow" className="w-[10px] max-w-none" />
          ),
        },
      }}
      // {...props}
      ref={ref}
    />
  );
});

export default function NumberInput({
  label,
  formik = null,
  name,
  disable = false,
  value,
}) {
  return (
    // <div>
    //   <label className=" inline-block text-[16px] font-medium mb-[0.5rem] leading-[20px]">
    //     {label}
    //   </label>
    //   {/* <CustomNumberInput
    //     aria-label="Demo number input"
    //     placeholder="0"
    //     onChange={onChange}
    //   /> */}

    //   <BaseNumberInput
    //     slots={{
    //       root: StyledInputRoot,
    //       input: StyledInputElement,
    //       incrementButton: StyledButton,
    //       decrementButton: StyledButton,
    //     }}
    //     slotProps={{
    //       incrementButton: {
    //         children: (
    //           <img
    //             src={arrowDown}
    //             alt="arrow"
    //             className="w-[10px] max-w-none"
    //           />
    //         ),
    //       },
    //       decrementButton: {
    //         children: (
    //           <img src={arrowUp} alt="arrow" className="w-[10px] max-w-none" />
    //         ),
    //       },
    //     }}
    //     disabled={disable}
    //     placeholder="0"
    //     value={value}
    //     onChange={(e: any) => {
    //       formik ? formik.setFieldValue(name, e.target.value) : null;
    //     }}
    //     // {...props}
    //     // ref={ref}
    //   />
    //   <span className="inline-block text-red pt-[5px]">
    //     {formik?.errors[name ?? ""] &&
    //       formik?.touched[name ?? ""] &&
    //       formik?.errors[name ?? ""]}
    //   </span>
    // </div>

    <div className="common-inputField">
      <label className="inline-block text-[16px] font-medium mb-[0.5rem] leading-[20px]">
        {label}
      </label>

      {/* <StyledInputRoot> */}
      {/* <input
          type="number"
          disabled={disable}
          placeholder="0"
          min={0}
          value={value}
          onChange={(e) => {
            formik ? formik.setFieldValue(name, e.target.value) : null;
          }}
        /> */}

      <input
        type="number"
        id="filled-hidden-label-small"
        defaultValue=""
        placeholder="0"
        className="noscroll sm:w-[300px] w-[230px]"
        value={value}
        onChange={(e) => {
          formik ? formik.setFieldValue(name, e.target.value) : null;
        }}
        style={{
          // width: "300px",
          paddingBottom: "0px",
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          // border: "none",
          borderBottom: "none",
          color: "#111827",
          padding: "0px 14px",
          border: "0.5px solid #9DA0A6",
        }}
        min={0}
        disabled={disable}
      />
      {/* <StyledButton
          onClick={() => {
            formik.setFieldValue(name, value + 1);
          }}
        >
          <img src={arrowUp} alt="arrow" className="w-[10px] max-w-none" />
        </StyledButton>
        <StyledButton
          onClick={() => {
            if (formik) {
              formik.setFieldValue(name, value - 1);
            }
          }}
        >
          <img src={arrowDown} alt="arrow" className="w-[10px] max-w-none" />
        </StyledButton> */}
      {/* </StyledInputRoot> */}
      <span className="inline-block text-red pt-[5px]">
        {formik?.errors[name ?? ""] &&
          formik?.touched[name ?? ""] &&
          formik?.errors[name ?? ""]}
      </span>
    </div>
  );
}

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const StyledInputRoot = styled("div")(
  ({ theme }) => `
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? "#757982" : "#757982"};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#f6f6f6"};
 font-size : 14px;
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  height: 48px;
  overflow: visible;
  width : 200px;

  &.${numberInputClasses.focused} {
    border-color: none;
    box-shadow: none;
  }
  &.muiltr-1d7x7jy {
    box-shadow : none
  }
  &:hover {
    border-color: none;
  }

  // firefox
  &:focus-visible {
    outline: 0;
    box-shadow : none
  }
`
);

const StyledInputElement = styled("input")(
  ({ theme }) => `
font-size: 16px;
font-weight: 400;
line-height: 16px;
  grid-column: 1/2;
  grid-row: 1/3;
  color: '#757982';
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
  
  border : 0.5px solid #9DA0A6;
`
);

const StyledButton = styled("button")(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 0;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  border-left: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    padding:12px 20px;
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    background: ${theme.palette.mode === "dark" ? "#F6F6F6" : "#F6F6F6"};
    border-top-right-radius : 7px;
    border-bottom: 0;
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    padding:11px 20px;
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    background: ${theme.palette.mode === "dark" ? "#F6F6F6" : "#F6F6F6"};
    border-bottom-right-radius : 7px;
    border-top: 0;
  }
  & .arrow {
    transform: translateY(-1px);
  }

  & .arrow {
    transform: translateY(-1px);
  }
`
);
