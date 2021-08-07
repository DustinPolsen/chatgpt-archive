import { MESSAGE_ACTIONS } from "@src/constants";

export function refresh() {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.REFRESH,
  });
}

export function refreshForce() {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.REFRESH,
    data: {
      force: true,
    },
  });
}

export function search(query: string) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.SEARCH,
    data: { query },
  });
}
export function init() {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.INIT,
  });
}

export function fetchConversations(sortBy: string, desc: boolean) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.FETCH_CONVERSATIONS,
    data: {
      sortBy,
      desc,
    },
  });
}

export function fetchMoreFolders(page: number, pageSize: number) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.APPEND_FOLDERS,
    data: {
      page,
      pageSize,
    },
  });
}

export function renameConversation(conversationId: string, name: string) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.RENAME_CONVERSATION,
    data: {
      conversationId,
      name,
    },
  });
}

export function createNewFolder(data: FolderCreationData) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.CREATE_NEW_FOLDER,
    data,
  });
}

export function addConversationsToFolder(
  conversationIdList: string[],
  folderId: string
) {
  console.log("addConversationToFolder", conversationIdList, folderId);
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.ADD_CONVERSATIONS_TO_FOLDER,
    data: { conversationIdList, folderId },
  });
}

export function renameFolder(folderId: string, name: string) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.RENAME_FOLDER,
    data: { folderId, name },
  });
}

export function deleteFolder(folderIdList: string[]) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.DELETE_FOLDER,
    data: { folderIdList },
  });
}

export function deleteConversationsFromFolder(
  conversationIdList: string[],
  folderId: string
) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.DELETE_CONVERSATIONS_FROM_FOLDER,
    data: { conversationIdList, folderId },
  });
}

// pin conversations
export function togglePinConversation(conversationId: string) {
  chrome.runtime.sendMessage({
    type: MESSAGE_ACTIONS.PIN_CONVERSATION,
    data: { conversationId },
  });
}
