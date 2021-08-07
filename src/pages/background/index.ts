import { BackgroundManager } from "./manager";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { extractConversationId, sendMessageToTab } from "./utils";
import { MESSAGE_ACTIONS } from "@src/constants";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded");

const backgroundManager = new BackgroundManager();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const newCId = extractConversationId(changeInfo.url);
    console.log("URL_CHANGE", changeInfo.url);
    if (changeInfo.url.startsWith("https://chat.openai.com/c/") && !!newCId) {
      sendMessageToTab(tabId, {
        type: MESSAGE_ACTIONS.CURRENT_CONVERSATION_CHANGE,
        data: newCId,
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MESSAGE_ACTIONS.TOGGLE_PANEL) {
    console.log("TOGGLE_PANEL");
  }
});
