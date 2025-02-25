import React from "react";
import { SVGProps } from "react";

interface IProps extends React.FC<SVGProps<SVGSVGElement>> {}

export const FilterIcon: IProps = ({ fill = "#757982", ...props }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 0V2H17L12 9.5V18H6V9.5L1 2H0V0H18ZM3.404 2L8 8.894V16H10V8.894L14.596 2H3.404Z"
      fill={fill}
    />
  </svg>
);
export const LogOutIcon: IProps = (props) => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="36" cy="36" r="35.5" stroke="#F44336" />
    <g clipPath="url(#clip0_2940_12553)">
      <path
        d="M36 51C27.7155 51 21 44.2845 21 36C21 27.7155 27.7155 21 36 21C38.329 20.9983 40.6263 21.5397 42.7094 22.5812C44.7925 23.6228 46.604 25.1358 48 27H43.935C42.2028 25.4726 40.0668 24.4775 37.7831 24.1341C35.4994 23.7907 33.1651 24.1135 31.0603 25.0638C28.9556 26.0142 27.1697 27.5516 25.9171 29.4918C24.6645 31.4319 23.9983 33.6923 23.9985 36.0017C23.9987 38.311 24.6652 40.5713 25.9182 42.5112C27.1711 44.4512 28.9572 45.9883 31.0622 46.9383C33.1671 47.8883 35.5014 48.2107 37.785 47.8669C40.0687 47.5231 42.2046 46.5277 43.9365 45H48.0015C46.6054 46.8644 44.7936 48.3776 42.7102 49.4191C40.6268 50.4607 38.3292 51.002 36 51ZM46.5 42V37.5H34.5V34.5H46.5V30L54 36L46.5 42Z"
        fill="#F44336"
      />
    </g>
    <defs>
      <clipPath id="clip0_2940_12553">
        <rect
          width="36"
          height="36"
          fill="white"
          transform="translate(18 18)"
        />
      </clipPath>
    </defs>
  </svg>
);
