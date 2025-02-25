import React from "react";
import { SVGProps } from "react";

export const DragIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      y="24"
      width="24"
      height="24"
      rx="12"
      transform="rotate(-90 0 24)"
      fill="white"
      fillOpacity="0.1"
    />
    <rect
      x="8.79968"
      y="18"
      width="12.6222"
      height="2.66667"
      rx="0.2"
      transform="rotate(-90 8.79968 18)"
      fill="#757982"
    />
    <rect
      x="12.5333"
      y="18"
      width="12.6222"
      height="2.66667"
      rx="0.2"
      transform="rotate(-90 12.5333 18)"
      fill="#757982"
    />
    <path
      d="M19.8119 11.8437C19.9093 11.7637 19.9093 11.6146 19.8119 11.5346L16.8603 9.10952C16.7298 9.00228 16.5333 9.09513 16.5333 9.26405L16.5333 14.1142C16.5333 14.2831 16.7298 14.376 16.8603 14.2688L19.8119 11.8437Z"
      fill="#757982"
    />
    <path
      d="M4.18808 11.8437C4.0907 11.7637 4.0907 11.6146 4.18808 11.5346L7.1397 9.10952C7.27022 9.00228 7.46667 9.09513 7.46667 9.26405L7.46667 14.1142C7.46667 14.2831 7.27022 14.376 7.1397 14.2688L4.18808 11.8437Z"
      fill="#757982"
    />
  </svg>
);

export const ThreeDotsIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.5563 20.25 20.25 16.5563 20.25 12C20.25 7.44365 16.5563 3.75 12 3.75ZM2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12Z"
      fill="#757982"
    />
    <path
      d="M12 13.125C12.6213 13.125 13.125 12.6213 13.125 12C13.125 11.3787 12.6213 10.875 12 10.875C11.3787 10.875 10.875 11.3787 10.875 12C10.875 12.6213 11.3787 13.125 12 13.125Z"
      fill="#757982"
    />
    <path
      d="M12 8.625C12.6213 8.625 13.125 8.12132 13.125 7.5C13.125 6.87868 12.6213 6.375 12 6.375C11.3787 6.375 10.875 6.87868 10.875 7.5C10.875 8.12132 11.3787 8.625 12 8.625Z"
      fill="#757982"
    />
    <path
      d="M12 17.625C12.6213 17.625 13.125 17.1213 13.125 16.5C13.125 15.8787 12.6213 15.375 12 15.375C11.3787 15.375 10.875 15.8787 10.875 16.5C10.875 17.1213 11.3787 17.625 12 17.625Z"
      fill="#757982"
    />
  </svg>
);

export const PlusIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <g clipPath="url(#clip0_17_593)">
      <path
        d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20Z"
        fill={props.color}
      />
    </g>
    <defs>
      <clipPath id="clip0_17_593">
        <rect width="24" height="24" fill={props.color} />
      </clipPath>
    </defs>
  </svg>
);

export const HoverEditIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 15 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.47978 9.33322L10.3959 3.41705L9.57111 2.59222L3.65495 8.50839V9.33322H4.47978ZM4.96336 10.4999H2.48828V8.0248L9.1587 1.35439C9.26809 1.24503 9.41644 1.18359 9.57111 1.18359C9.72579 1.18359 9.87414 1.24503 9.98353 1.35439L11.6338 3.00464C11.7431 3.11403 11.8046 3.26237 11.8046 3.41705C11.8046 3.57173 11.7431 3.72008 11.6338 3.82947L4.96336 10.4999ZM2.48828 11.6666H12.9883V12.8332H2.48828V11.6666Z"
      fill={props.color ? props.color : "#757982"}
    />
  </svg>
);
export const LoginIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 11V8L15 12L10 16V13H1V11H10ZM2.458 15H4.582C5.28005 16.7191 6.55371 18.1422 8.18512 19.0259C9.81652 19.9097 11.7043 20.1991 13.5255 19.8447C15.3468 19.4904 16.9883 18.5142 18.1693 17.0832C19.3503 15.6523 19.9975 13.8554 20 12C20.001 10.1427 19.3558 8.34283 18.1749 6.90922C16.994 5.47561 15.3511 4.49756 13.528 4.14281C11.7048 3.78807 9.81505 4.07874 8.18278 4.96498C6.55051 5.85121 5.27747 7.27778 4.582 9H2.458C3.732 4.943 7.522 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C7.522 22 3.732 19.057 2.458 15Z"
      fill="#4F46E5"
    />
  </svg>
);
export const CalendarLineIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_542_9956)">
      <path
        d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM15 5H9V7H7V5H4V9H20V5H17V7H15V5ZM20 11H4V19H20V11Z"
        fill="#757982"
      />
    </g>
    <defs>
      <clipPath id="clip0_542_9956">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export const LeftIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 17L9 11L15 5"
      stroke="#757982"
      stroke-width="2"
      strokeLinecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
export const RightIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 17L15 11L9 5"
      stroke="#757982"
      stroke-width="2"
      strokeLinecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
export const DownArrowIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 14L8 10H16L12 14Z" fill="#4F46E5" />
  </svg>
);
export const DownArrowIconWhite: React.FC<SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 14L8 10H16L12 14Z" fill="#fff" />
  </svg>
);
export const UpArrowIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_542_15937)">
      <path d="M12 10L8 14H16L12 10Z" fill="#4F46E5" />
    </g>
    <defs>
      <clipPath id="clip0_542_15937">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="matrix(1 0 0 -1 0 24)"
        />
      </clipPath>
    </defs>
  </svg>
);
export const UpArrowBlank: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_542_17805)">
      <path d="M12 10L8 14H16L12 10Z" fill="#9DA0A6" />
    </g>
    <defs>
      <clipPath id="clip0_542_17805">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="matrix(1 0 0 -1 0 24)"
        />
      </clipPath>
    </defs>
  </svg>
);
export const DownArrowBlank: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_542_17170)">
      <path d="M12 14L8 10H16L12 14Z" fill="#9DA0A6" />
    </g>
    <defs>
      <clipPath id="clip0_542_17170">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export const DownArrowGreen: React.FC<SVGProps<SVGSVGElement>> = ({
  color = "#4CAF50",
  ...props
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_542_17170)">
      <path d="M12 14L8 10H16L12 14Z" fill={color} />
    </g>
    <defs>
      <clipPath id="clip0_542_17170">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
