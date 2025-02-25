import Button from "@mui/material/Button";
import React from "react";

type SpinnerProps = {
    size?: string; // Width and height of the spinner
    color?: string; // Color of the top border
    className?: string; // Additional custom class names
    title?: string
};

const CustomButton: React.FC<SpinnerProps> = ({
    size = "h-20 w-20", // Default size
    color = "border-t-blue-600", // Default top border color
    className = "", // Additional custom styles
    title,
    ...reset
}) => {
    return (
        <Button
            variant="contained"
            color="secondary"
            className="w-max h-[48px] text-[18px]"
            {...reset}
        >
            <div className="w-20 h-20 mr-10 border-4 border-gray-300 rounded-full animate-spin border-t-blue-600" />
            {title}
        </Button>

    );
};

export default CustomButton;
