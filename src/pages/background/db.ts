import Dexie from "dexie";
import { extractMessageString, extractMessages } from "./utils";

type ConversationToFolderData = {
  conversationId: string;
  folderId: string;
  create_time: string;
  update_time: string;
};

type messageToFolderData = {
  conversationId: string;
  messageId: string;
  folderId: string;
  create_time: string;
  update_time: string;
};

export class RootDB extends Dexie {
  conversations: Dexie.Table<Conversation, string>;
  messages: Dexie.Table<Message, string>;
  folders: Dexie.Table<FolderWithoutChildren, string>;
  conversationToFolder: Dexie.Table<ConversationToFolderData, number>;
  messageToFolder: Dexie.Table<messageToFolderData, number>;
  pinConversations: Dexie.Table<PinConversation, string>;

  constructor(username: string) {
    super("ca-db-" + username);
    this.version(1).stores({
      conversations: "&id, title, create_time, update_time",
      messages: "&id, parent, message.create_time, conversation_id",
      folders: "&id, name, create_time, update_time",
      conversationToFolder:
        "++id, conversationId, folderId, create_time, update_time",
      messageToFolder:
        "++id, conversationId, messageId, folderId, create_time, update_time",
      pinConversations: "&id, create_time, update_time",
    });
  }

  async getManyConversations(
    limit: number | undefined = undefined,
    offset: number | undefined = undefined,
    sortBy = "update_time",
    desc = true
  ) {
    const c = await this.conversations.count();
    if (c === 0) {
      return [];
    }
    let q = this.conversations.orderBy(sortBy);
    if (desc) {
      q = q.reverse();
    }
    if (offset) {
      q = q.offset(offset);
    }
    if (limit) {
      q = q.limit(limit);
    }
    const conversations = await q.toArray();
    for (let i = 0; i < conversations.length; i++) {
      const c = conversations[i];
      const messageCount = await this.messages.where({ parent: c.id }).count();
      c["messageCount"] = messageCount;
    }
    return conversations;
  }

  async getConversationWithoutMessage(): Promise<string[]> {
    const c = await this.conversations.count();
    if (c === 0) {
      return [];
    }
    let q = this.conversations.orderBy("update_time").reverse();
    return (await q.toArray()).filter((c) => !c.messageStr).map((c) => c.id);
  }

  putManyConversations(conversations: Conversation[]) {
    return this.conversations.bulkPut(conversations);
    // return this.transaction(
    //   "rw",
    //   this.conversations,
    //   this.messages,
    //   async () => {
    //     const conversationData = conversations.map((c) => {
    //       return {
    //         ...c,
    //         messageStr: extractMessageString(c),
    //         mapping: undefined,
    //       };
    //     });
    //     const messageData = conversations
    //       .map((c) => {
    //         return extractMessages(c);
    //       })
    //       .flat();
    //     await this.conversations.bulkPut(conversationData);
    //     await this.messages.bulkPut(messageData);
    //     console.log(
    //       `Saved ${conversations.length} conversations, ${messageData.length} messages`
    //     );
    //   }
    // );
  }

  async updateConversationDetail(conversationId: string, data: any) {
    return this.transaction(
      "rw",
      this.conversations,
      this.messages,
      async () => {
        const messageData = extractMessages(data);
        this.conversations.update(conversationId, {
          messageStr: extractMessageString(data),
          messageCount: messageData.length,
        });
        await this.messages.bulkPut(messageData);
        console.log(
          `Saved ${messageData.length} messages for conversation ${conversationId}`
        );
      }
    );
  }

  getLatestConversation() {
    return this.conversations.orderBy("update_time").reverse().first();
  }

  async getManyFolders(
    limit: number | undefined = undefined,
    offset: number | undefined = undefined,
    sortBy = "update_time",
    desc = true
  ) {
    const c = await this.folders.count();
    if (c === 0) {
      return [];
    }
    let q = this.folders.orderBy(sortBy);
    if (desc) {
      q = q.reverse();
    }
    if (offset) {
      q = q.offset(offset);
    }
    if (limit) {
      q = q.limit(limit);
    }
    const folders = await q.toArray();
    const conIdSet = new Set<string>();
    const fChildrenList = (
      await Promise.allSettled(
        folders.map((f) =>
          db.conversationToFolder.where({ folderId: f.id }).toArray()
        )
      )
    ).map((p) => (p["status"] === "fulfilled" ? p["value"] : []));
    for (let i = 0; i < fChildrenList.length; i++) {
      for (let j = 0; j < fChildrenList[i].length; j++) {
        conIdSet.add(fChildrenList[i][j].conversationId);
      }
    }
    const conIdList = Array.from(conIdSet);
    const conList = await db.conversations.bulkGet(conIdList);
    const conversationIdMap = conIdList.reduce(
      (obj: Record<string, any>, key: string, i: number) => ({
        ...obj,
        [key]: conList[i],
      }),
      {}
    );
    // for (let i = 0; i < folders.length; i++) {
    //   const f = folders[i];
    //   f.children = fChildrenList[i].map( (r) => conversationIdMap[r.conversationId]);
    // }
    return folders.map((f, i) => ({
      ...f,
      children: fChildrenList[i].map(
        (r) => conversationIdMap[r.conversationId]
      ),
    }));
  }

  async createNewFolder(data: FolderCreationData) {
    const folderId = crypto.randomUUID();
    const curDatetime = Date.now().toString();
    if (data.children.length !== 0) {
      for (let i = 0; i < data.children.length; i++) {
        const conId = data.children[i];
        const con = await db.conversations.get(conId);
        if (!con) {
          console.warn("Conversation ID " + conId + " does not exist");
          return;
        }
        await db.conversationToFolder.put({
          folderId,
          conversationId: conId,
          update_time: curDatetime,
          create_time: curDatetime,
        });
      }
    }
    delete data.children;
    const folder = {
      ...data,
      id: folderId,
      update_time: curDatetime,
      create_time: curDatetime,
    };
    return this.folders.add(folder);
  }

  async renameFolder(folderId: string, name: string) {
    const folder = await db.folders.get(folderId);
    if (!folder) {
      throw new Error("No folder found with id");
    }
    return db.folders.update(folderId, {
      name,
      update_time: Date.now().toString(),
    });
  }

  async deleteFolder(folderIdList: string[]) {
    const folderExists = await Promise.all(
      folderIdList.map((folderId) => db.folders.get(folderId))
    );
    if (folderExists.some((f) => !f)) {
      throw new Error("Some folders do not exist");
    }
    await db.folders.bulkDelete(folderIdList);
    for (let i = 0; i < folderIdList.length; i++) {
      const folderId = folderIdList[i];
      await db.conversationToFolder.where({ folderId }).delete();
    }
  }

  async addConversationsToFolder(conIdList: string[], folderId: string) {
    const conList = await db.conversations.bulkGet(conIdList);
    if (!conList) {
      throw new Error("No conversation found with id");
    }
    const folder = await db.folders.get(folderId);
    if (!folder) {
      throw new Error("No folder found with id");
    }
    const dateNow = Date.now().toString();

    const existingConIdList = (
      await db.conversationToFolder.where({ folderId }).toArray()
    ).map((r) => r.conversationId);

    const notAddedConIdList = conIdList.filter(
      (cid) => !existingConIdList.includes(cid)
    );

    const notAddedConToFolder = notAddedConIdList.map((conId) => ({
      conversationId: conId,
      folderId,
      update_time: dateNow,
      create_time: dateNow,
    }));
    console.log(`Adding ${notAddedConIdList.length} conversations to folder`, {
      notAddedConToFolder,
    });

    await db.conversationToFolder.bulkPut(notAddedConToFolder);
  }

  async deleteConversationsFromFolder(
    conversationIdList: string[],
    folderId: string
  ) {
    const folder = await db.folders.get(folderId);
    if (!folder) {
      throw new Error("No folder found with id");
    }
    try {
      // Start a transaction
      await db.transaction("rw", db.conversationToFolder, async () => {
        // Iterate over the conversation IDs
        for (const conversationId of conversationIdList) {
          // Delete the conversation entry that matches the folder ID and conversation ID
          await db.conversationToFolder
            .where({ folderId: folderId, conversationId: conversationId })
            .delete();
        }
      });
      console.log("Conversations deleted successfully");
    } catch (error) {
      console.error("Failed to delete conversations:", error);
    }
  }

  async searchConversations(
    query: string,
    sortBy = "update_time",
    desc = true
  ) {
    const conversations = (
      await this.conversations.orderBy(sortBy).reverse().toArray()
    )
      .map((d) => {
        const regex2 = new RegExp(query, "gi");
        const msgCount = (d.messageStr?.match(regex2) || []).length;
        const titleCount = (d.title.match(regex2) || []).length;
        return {
          ...d,
          keywordCount: titleCount + msgCount,
          messageStr: undefined,
        };
      })
      .filter((c) => {
        const regex = new RegExp(query, "i");
        return regex.test(c.title) || c.keywordCount > 0;
      });
    conversations.sort(
      (a: ConversationWithKeywordCount, b: ConversationWithKeywordCount) => {
        if (a.keywordCount !== b.keywordCount) {
          return b.keywordCount - a.keywordCount;
        }
        return (
          new Date(b.update_time).getTime() - new Date(a.update_time).getTime()
        );
      }
    );

    return conversations;
  }

  async searchFolders(query: string, sortBy = "update_time") {
    const data = (
      await this.getManyFolders(undefined, undefined, sortBy, true)
    ).filter((f) => {
      const reg = new RegExp(query, "i");
      return reg.test(f.name);
    });

    return data;
  }

  async searchMessages(query: string, sortBy = "message.create_time") {
    const data = (await this.messages.orderBy(sortBy).reverse().toArray())
      .map((m) => {
        const regex2 = new RegExp(query, "gi");
        const count = (m.contentStr?.match(regex2) || []).length;
        return {
          ...m,
          keywordCount: count,
        };
      })
      .filter((m) => m.keywordCount > 0);
    data.sort((a: any, b: any) => {
      if (a.keywordCount !== b.keywordCount) {
        return b.keywordCount - a.keywordCount;
      }
      return (
        new Date(b.update_time).getTime() - new Date(a.update_time).getTime()
      );
    });

    return data;
  }

  // conversation api actions
  async renameConversation(conversationId: string, title: string) {
    const conversation = await db.conversations.get(conversationId);
    if (!conversation) {
      throw new Error("No conversation found with id");
    }
    await db.conversations.update(conversationId, {
      title,
      update_time: Date.now().toString(),
    });
  }

  // Pin conversations

  async getPinConversations() {
    const pinConversations = await this.pinConversations
      .orderBy("update_time")
      .reverse()
      .toArray();
    const pinConversationsIdList = pinConversations.map((c) => c.id);
    return await db.conversations.bulkGet(pinConversationsIdList);
  }

  async togglePinConversation(conversationId: string) {
    const conversation = await db.conversations.get(conversationId);
    if (!conversation) {
      throw new Error("No conversation found with id");
    }
    const dateNow = Date.now().toString();
    const existing = await db.pinConversations.get(conversationId);
    if (existing) {
      await db.pinConversations.delete(conversationId);
    } else {
      await db.pinConversations.put({
        id: conversationId,
        create_time: dateNow,
        update_time: dateNow,
      });
    }
  }
}

let db: RootDB;

export async function initDB(username: string) {
  if (!db) {
    db = new RootDB(username);
  }
  if (!db.isOpen()) {
    await db.open();
  }
  console.log("DB initialized", db);
}

export { db };
