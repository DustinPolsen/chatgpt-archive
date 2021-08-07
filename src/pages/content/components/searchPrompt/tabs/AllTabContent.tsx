// import { CommandGroup, CommandList } from "@src/components/ui/command";
import React from "react";
import { EmptyResult } from "../EmptyResult";
import { MoreButton } from "../MoreButton";
import { ALL_TAB_GROUP_SIZE, SEARCH_TABS } from "../config";
import {
  ConversationItemWithoutSelect,
  DefaultConversationOptions,
} from "@src/components/Conversation";
import { FolderItem } from "@src/components/Folder";
import { MessageItem } from "@src/components/Message";

function GroupTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between pl-3 pr-3 py-2 text-sm text-muted-foreground border border-transparent">
      <span>{title}</span>
    </div>
  );
}

export default function AllTabContent({
  result: { conversations, folders, messages },
  keyword,
  handleConversationSelect,
  setTab,
}: {
  result: SearchResult;
  keyword: string;
  handleConversationSelect: (id: string) => void;
  setTab: React.Dispatch<React.SetStateAction<keyof typeof SEARCH_TABS>>;
}) {
  return (
    <>
      <div>
        <GroupTitle title="Conversations" />
        {conversations && conversations.length !== 0 ? (
          conversations.slice(0, ALL_TAB_GROUP_SIZE).map((conversation, i) => (
            <ConversationItemWithoutSelect
              key={conversation.id}
              conversation={conversation}
              optionButtons={() => (
                <>
                  <div className="absolute right-10 flex items-center gap-1">
                    <DefaultConversationOptions conversation={conversation} />
                  </div>
                  <div className="text-primary font-medium mr-2 text-sm">
                    {conversation.keywordCount}
                  </div>
                </>
              )}
            />
          ))
        ) : (
          <EmptyResult name="conversation" />
        )}

        <MoreButton
          data={conversations}
          name="conversations"
          onSelect={() => {
            setTab("conversations");
          }}
        />
      </div>
      <div>
        <GroupTitle title="Messages" />
        {messages && messages.length !== 0 ? (
          messages
            .slice(0, ALL_TAB_GROUP_SIZE)
            .map((m) => (
              <MessageItem key={m.id} message={m} keyword={keyword} />
            ))
        ) : (
          <EmptyResult name="message" />
        )}

        <MoreButton
          data={messages}
          name="messages"
          onSelect={() => {
            setTab("messages");
          }}
        />
      </div>
      <div>
        <GroupTitle title="Folders" />
        {folders && folders.length !== 0 ? (
          folders
            .slice(0, ALL_TAB_GROUP_SIZE)
            .map((f) => <FolderItem key={f.id} folder={f} />)
        ) : (
          <EmptyResult name="folder" />
        )}

        <MoreButton
          data={folders}
          name="folders"
          onSelect={() => {
            setTab("folders");
          }}
        />
      </div>
    </>
  );
}
