import { useTheme } from "@mui/material";

interface IProps {
  images: string[];
  alignLeft?: boolean;
}

function ImagesOverlap({ images, alignLeft }: IProps) {
  const theme = useTheme();

  return (
    <div className={`flex ${alignLeft ? "justify-left" : "justify-center"} `}>
      {images?.length > 0 &&
        images?.map((item, index) =>
          index < 3 ? (
            <img
              className="h-[34px] w-[34px] rounded-full border-2 border-white ml-[-14px] z-0"
              key={item}
              src={`/assets/images/avatars/${item}`}
              alt={item}
              loading="lazy"
            />
          ) : index > 3 ? (
            <span
              style={{
                backgroundColor: theme.palette.secondary.main,
              }}
              className="h-[34px] w-[34px] flex items-center justify-center text-sm text-white bg-secondary
            rounded-full border-2 border-white ml-[-10px] z-0"
            >
              +{images.length - 3}
            </span>
          ) : null
        )}
    </div>
  );
}

export default ImagesOverlap;
