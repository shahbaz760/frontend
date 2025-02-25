import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./i18n";
import "./styles/app-base.scss";
import "./styles/app-components.css";
import "./styles/app-utilities.scss";

import BrowserRouter from "@fuse/core/BrowserRouter";
import { GoogleOAuthProvider } from "@react-oauth/google";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);
const appVersion = import.meta.env.VITE_APP_VERSION;
const googleid = import.meta.env.VITE_GOOGLE_CLIENT_ID
// /**
//  * Function to check for a new version.
//  */
// async function checkForNewVersion() {
//   try {
//     const response = await fetch("/version.json", {
//       cache: "no-store",
//     });
//     const { version: latestVersion } = await response.json();

//     if (latestVersion !== appVersion) {
//       window.location.reload(); // Force reload
//     }
//   } catch (error) {
//     console.error("Failed to check for new version:", error);
//   }
// }

// // Immediately check for updates when the app loads
// checkForNewVersion();

root.render(
  <GoogleOAuthProvider clientId={googleid}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
