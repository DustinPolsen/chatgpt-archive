type Conversation = {
  id: string;
  title: string;
  current_node: string | null;
  update_time: string;
  create_time: string;
  mapping?: {
    [key: string]: Message;
  };
  messageStr?: string | undefined;
  messages?: Message[] | undefined;
};

type ConversationWithKeywordCount = Conversation & {
  keywordCount: number;
};

type SortAttribute = "update_time" | "create_time";
type SearchSortAttribute = "update_time" | "create_time" | "keywordCount";

// background script
type PinConversation = {
  id: string;
  create_time: string;
  update_time: string;
};

type Message = {
  id: string;
  parent: string;
  conversation_id: string;
  conversation_title: string;
  contentStr?: string;
  message: {
    create_time: string;
    content: {
      content_type: string;
      parts: string[];
    };
  };
};

type FetchFilteredConversationData = {
  title: string;
};

type FolderCreationData = {
  name: string;
  color?: string;
  children: string[];
};

type FolderWithoutChildren = {
  id: string;
  update_time: string;
  create_time: string;
} & Omit<FolderCreationData, "children">;

type Folder = FolderWithoutChildren & {
  children: Conversation[];
};

type MessageHandler = (request: any, sender, sendResponse) => void;

type KeyboardShortcutItem = {
  name: string;
  callback: () => void;
  keyCondition: (e: KeyboardEvent) => boolean;
};

// API
type RefreshResponseData = {
  conversations: Conversation[];
  folders: Folder[];
  pinConversations: Conversation[];
};

// Search Prompt
type SearchResult = {
  conversations: (Conversation & { keywordCount: number })[];
  folders: Folder[];
  messages: Message[];
};

// icon
type IconSize = "sm" | "md" | "lg";
