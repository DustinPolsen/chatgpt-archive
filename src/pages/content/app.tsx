import Panel from "./components/Panel";
import { Thumb } from "./components/Thumb";

import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { PANEL_NAV_ITEMS } from "./config";
import { useEffect } from "react";
import { init } from "./messages";
import { MESSAGE_ACTIONS } from "@src/constants";
import { useAtom } from "jotai";
import {
  bgResponseStatusAtom,
  conversationListAtom,
  currentConversationIdAtom,
  folderListAtom,
  globalDialogAtom,
  panelOpenAtom,
  pinConversationListAtom,
  searchOpenAtom,
} from "./context";
import { useBgMessage, useRefresh, useKeyboardShortcut } from "./hook";

import { Toaster } from "@src/components/ui/toaster";
import { useToast } from "@src/components/ui/use-toast";
import { SuccessIcon } from "@src/components/Icon";
import { SearchPrompt } from "./components/searchPrompt";

const router = createMemoryRouter([
  {
    path: "/",
    element: <Panel />,
    children: PANEL_NAV_ITEMS,
  },
]);

const KEYBOARD_SHORTCUTS_GLBOAL = [
  {
    name: "closePanel",
    keyCondition: (e: KeyboardEvent) => e.key === "Escape",
  },
  {
    name: "togglePanel",
    keyCondition: (e: KeyboardEvent) => e.ctrlKey && e.key === "k",
  },
];

const KEYBOARD_SHORTCUTS_NAME_TO_CONDITION = {
  closePanel: (e: KeyboardEvent) => e.key === "Escape",
  togglePanel: (e: KeyboardEvent) => e.ctrlKey && e.key === "k",
  toggleSearch: (e: KeyboardEvent) => e.ctrlKey && e.key === "j",
};

const KEYBOARD_SHORTCUTS_CONVERSATION = [
  {
    name: "gotoNextConversation",
    keyCondition: (e: KeyboardEvent) => e.ctrlKey && e.key === "ArrowDown",
  },
  {
    name: "gotoPreviousConversation",
    keyCondition: (e: KeyboardEvent) => e.ctrlKey && e.key === "ArrowUp",
  },
];

export default function App() {
  const [responseStatus, setResponseStatus] = useAtom(bgResponseStatusAtom);
  const [folders, setFolders] = useAtom(folderListAtom);
  const [conversations, setConversations] = useAtom(conversationListAtom);
  const [open, setOpen] = useAtom(panelOpenAtom);
  const [searchOpen, setSearchOpen] = useAtom(searchOpenAtom);
  const [pinConversationIdList, setPinConversationIdList] = useAtom(
    pinConversationListAtom
  );
  const [currentConversationId, setCurrentConversationId] = useAtom(
    currentConversationIdAtom
  );
  const [dialogOpen, setDialogOpen] = useAtom(globalDialogAtom);
  const { triggerRefresh } = useRefresh();
  const { toast } = useToast();

  useBgMessage({
    [MESSAGE_ACTIONS.REFRESH]: (request, sender, _) => {
      console.log(
        "[useBgMessage][Type: Refresh][Component: App]",
        request.data
      );
      // cast request.data as RefreshResponseData
      const { folders, conversations, pinConversations } =
        request.data as RefreshResponseData;
      setFolders(folders);
      setConversations(conversations);
      setPinConversationIdList(pinConversations);
    },
    [MESSAGE_ACTIONS.RESPONSE_STATUS]: (request, sender, _) => {
      console.log(
        "[useBgMessage][Type: ResponseStatus][Component: App]",
        request.data
      );
      setResponseStatus(request.data);
      console.log("response status", request.data);
      if (request.data.status === "SUCCESS") {
        console.log("showing toast");
        toast({
          description: request.data.message,
          icon: <SuccessIcon />,
          duration: 1500,
        });
      }
    },
    [MESSAGE_ACTIONS.FETCH_FOLDERS]: (request, sender, _) => {
      console.log(
        "[useBgMessage][Type: FetchFolders][Component: App]",
        request.data
      );
      setFolders(request.data);
    },
    [MESSAGE_ACTIONS.FETCH_CONVERSATIONS]: (request, sender, _) => {
      console.log(
        "[useBgMessage][Type: FetchConversations][Component: App]",
        request.data
      );
      setConversations(request.data);
    },
    [MESSAGE_ACTIONS.PIN_CONVERSATION]: (request, sender, _) => {
      console.log(
        "[useBgMessage][Type: PinConversation][Component: App]",
        request.data
      );
      setPinConversationIdList(request.data);
    },
    [MESSAGE_ACTIONS.CURRENT_CONVERSATION_CHANGE]: (request, sender, _) => {
      console.log(
        "[useBgMessage][Type: CurrentConversationChange][Component: App]",
        request.data
      );
      setCurrentConversationId(request.data);
    },
    [MESSAGE_ACTIONS.TOGGLE_PANEL]: (request, sender, _) => {
      console.log(
        "[useBgMessage][Type: TogglePanel][Component: App]",
        request.data
      );
      setOpen((prev) => !prev);
    },
  });

  const keyFunctions = {
    closePanel: () => {
      setOpen(() => false);
    },
    togglePanel: () => {
      setOpen((prev) => !prev);
    },
    toggleSearch: () => {
      setSearchOpen((prev) => !prev);
    },
  };

  useKeyboardShortcut(
    Object.keys(keyFunctions).map((name) => ({
      name,
      keyCondition: KEYBOARD_SHORTCUTS_NAME_TO_CONDITION[name],
      callback: keyFunctions[name],
    }))
  );

  useEffect(() => {
    triggerRefresh();
    init();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      const el = document.querySelector(
        `[data-cid='${currentConversationId}']`
      );
      if (el) {
        // console.log("scrolling to", currentConversationId, el);
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [currentConversationId]);

  return (
    <>
      <Thumb />
      <RouterProvider router={router} />
      <SearchPrompt />
      <Toaster />
    </>
  );
}
