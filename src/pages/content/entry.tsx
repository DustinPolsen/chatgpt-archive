import { createRoot } from "react-dom/client";
import App from "@src/pages/content/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { Provider } from "jotai";
import { initializeShadowRoot, shadowRoot } from "./root";
import { getDarkModeEnabledFromLocalStorage } from "./utils";
import { TooltipProvider } from "@src/components/ui/tooltip";

refreshOnUpdate("pages/content");

const reactShadowRoot = initializeShadowRoot();

const cssPath = "assets/css/contentStyle.chunk.css";
const cssFullPath = chrome.runtime.getURL(cssPath);
const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", cssFullPath);
shadowRoot.appendChild(cssLink);

// Hide the shadow root until the CSS is loaded
reactShadowRoot.style.display = "none";
cssLink.onload = () => {
  reactShadowRoot.style.display = "block";
};

const darkModeEnabled = getDarkModeEnabledFromLocalStorage();
if (darkModeEnabled) {
  reactShadowRoot.classList.add("dark");
}

if (window.location.pathname.includes("auth/login")) {
  console.log("Please login first");
} else {
  createRoot(reactShadowRoot).render(
    <Provider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </Provider>
  );
}
