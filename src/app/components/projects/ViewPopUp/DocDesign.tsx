import { Typography } from "@mui/material";
import docImage from "public/assets/images/pages/ProjectView/docImage.png";
const DocDesign = () => {
  return (
    <div className="px-16">
      <Typography className="py-10 text-[20px] text-[#111827] font-600">
        Doc
      </Typography>
      <Typography className="pb-10 text-[14px] text-[#757982] font-400">
        Create docs, wikis, and knowledge-bases with Doc view's flexible and
        shareable pages.
      </Typography>
      <img src={docImage} alt="" />
    </div>
  );
};

export default DocDesign;
