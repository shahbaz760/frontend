import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import authRoles from "../../auth/authRoles";
import AgentSignDocument from "./AgentSignDocument";
import CreatePassword from "./CreatePassWord";
import PhotoId from "./PhotoId";
import UploadKyc from "./UploadKyc";
import UploadPage from "./UploadPage";
import RejectKyc from "./RejectKyc";
import PaymentMethod from "src/app/main/paymentMethod/PaymentMethod";
// import SignDocuement from "./SignDocuement";

const AgentOnBoardConfig: FuseRouteConfigType = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "create-password",
      element: <CreatePassword />,
    },
    {
      path: "sign-doc",
      element: <AgentSignDocument />,
    },
    {
      path: "kyc-doc/:token",
      element: <UploadKyc />,
    },
    {
      path: "photo-id/:token",
      element: <PhotoId />,
    },
    {
      path: "upload-doc/:token",
      element: <UploadPage />,
    },

    {
      path: "reject-kyc/:token",
      element: <RejectKyc />,
    },
  ],
};

export default AgentOnBoardConfig;
