export const sendMessageToTab = (tabId, data) =>
  chrome.tabs.sendMessage(tabId, data);

export const extractMessageString = (conversation) => {
  if (!conversation.mapping) return undefined;
  return Object.values(conversation.mapping)
    .map((item: any) => {
      return item.message?.content?.parts?.join(" ") || "";
    })
    .join(" ");
};

export const extractMessages = (conversation) => {
  if (!conversation.mapping) return [];
  return Object.values(conversation.mapping).map((item: any) => ({
    ...item,
    conversation_title: conversation.title,
    conversation_id: conversation.conversation_id,
    contentStr: item.message?.content?.parts?.join(" ") || "",
  }));
};

export function extractConversationId(url: string) {
  const match = /\/c\/([a-z0-9].*)/.exec(url);
  return match ? match[1] : null;
}
