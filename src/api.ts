import { batchPromises, sleep } from "./utils";

const CHATGPT_HOST_URL = "https://chat.openai.com";

function fetchWithToken(
  token: string,
  url: RequestInfo,
  options: RequestInit = {}
) {
  return fetch(url, {
    headers: {
      authorization: "Bearer " + token,
      "content-type": "application/json",
    },
    ...options,
  }).then((res) => res.json());
}

export async function getAccessToken() {
  try {
    const res = await fetch("https://chat.openai.com/api/auth/session").then(
      (response) => response.json()
    );
    if (res.accessToken)
      return {
        accessToken: res.accessToken,
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        avatarUrl: res.user.picture,
      };
    console.warn("no access token from get access token:", res);
  } catch (err) {
    console.error("error getting access token:", err);
  }
  return null;
}

export async function fetchConversations(
  offset: number,
  limit: number,
  order: string,
  token: string
) {
  return await fetch(
    `https://chat.openai.com/backend-api/conversations?offset=${offset}&limit=${limit}&order=${order}`,
    {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "application/json",
      },
      method: "GET",
    }
  ).then((response) => response.json());
}

export function fetchOneConversationDetail(
  conversationId: string,
  token: string
) {
  return fetchWithToken(
    token,
    `${CHATGPT_HOST_URL}/backend-api/conversation/${conversationId}`
  );
}

export async function fetchConversationDetails(
  conversationIdList: string[],
  token: string,
  onUpdate: (current: number, total: number, curVal: any) => void
) {
  const res = [];
  for (let i = 0; i < conversationIdList.length; i++) {
    const cid = conversationIdList[i];
    try {
      const tmp = await fetchOneConversationDetail(cid, token);
      res.push(tmp);
      onUpdate(i + 1, conversationIdList.length, tmp);
      await sleep(1200);
    } catch (err) {
      console.error("error fetching conversation detail:", err);
    }
  }
  return res;
}

export async function fetchAllConversationsGivenTotal(total_count, token) {
  const limit = 50;
  const page_count = Math.ceil(total_count / limit);
  const order = "updated";
  const promise_funcs = [];
  for (let i = 0; i < page_count; i++) {
    promise_funcs.push(() =>
      fetchConversations(i * limit, limit, order, token)
    );
  }
  return batchPromises<{ items: Conversation[] }>(promise_funcs).then(
    (data) => {
      const all_conversations = [];
      data.forEach((d) => {
        all_conversations.push(...d.items);
      });
      return all_conversations;
    }
  );
}

export async function fetchAllConversations(token) {
  console.log("fetching all conversations......");
  const data = await fetchConversations(0, 10, "updated", token);
  if (!data.items) return null;
  const conversationCount = data.total;
  const all_conversations = await fetchAllConversationsGivenTotal(
    conversationCount,
    token
  );
  console.log("done fetching", all_conversations);
  return all_conversations;
}

export async function fetchNewConversations(token, currentLatestDate) {
  console.log("fetching new conversations......");
  const new_conversations = [];
  let data;
  let shouldStop = false;
  let offset = 0;
  const pageSize = 10;
  while (!shouldStop) {
    data = await fetchConversations(offset, pageSize, "updated", token);
    data.items.forEach((c) => {
      if (shouldStop) return;
      const d = new Date(c.update_time);
      if (d > currentLatestDate) {
        new_conversations.push(c);
      } else {
        shouldStop = true;
      }
    });
    offset += pageSize;
  }
  console.log("done fetching latest conversations:", new_conversations);
  return new_conversations;
}

// export async function fetchAllConversationsWithDetail(
//   conversations: Conversation[],
//   token: string,
//   updateHandler: () => void
// ) {
//   const promises = conversations.map((c) => {
//     return () => {
//       updateHandler();
//       return fetchOneConversationDetail(c.id, token);
//     };
//   });
//   return batchPromises(promises);
// }

export async function renameConversation(
  conversationId: string,
  newTitle: string,
  token: string
) {
  return await fetchWithToken(
    token,
    `${CHATGPT_HOST_URL}/backend-api/conversation/${conversationId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ title: newTitle }),
    }
  );
}
