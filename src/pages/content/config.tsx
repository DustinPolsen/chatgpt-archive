import { AccountPage } from "./pages/AccountPage";
import { DataPage } from "./pages/DataPage";
import { ConversationPage } from "./pages/data/ConversationPage";
import { FolderPage } from "./pages/data/FolderPage";

export const PANEL_NAV_ITEMS = [
  // {
  //   name: "Search",
  //   path: "/",
  //   icon: "Search",
  //   element: <SearchPage />,
  // },
  {
    name: "Home",
    path: "/",
    icon: "MessageSquare",
    element: <DataPage />,
    children: [
      {
        name: "Conversation",
        path: "/",
        element: <ConversationPage />,
      },
      {
        name: "Folder",
        path: "/folder",
        element: <FolderPage />,
      },
    ],
  },
  {
    name: "Account",
    path: "/account",
    icon: "User2",
    element: <AccountPage />,
  },
];
