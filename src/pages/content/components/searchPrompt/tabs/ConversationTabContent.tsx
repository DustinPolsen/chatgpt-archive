import { EmptyResult } from "../EmptyResult";
import {
  ClearSelectionButton,
  SelectAllButton,
  SelectionActionBar,
} from "../../../../../components/SelectionActionBar";
import { MoreDropdownButton } from "../../MoreDropdownButton";
import { AddToFolderDropdown } from "../../../../../components/actions/AddToFolder";
import { useState } from "react";
import {
  ConversationItem,
  DefaultConversationOptions,
} from "@src/components/Conversation";

export default function ConversationTabContent({
  conversations,
  keyword,
  handleConversationSelect,
}: {
  conversations: (Conversation & { keywordCount: number })[];
  keyword: string;
  handleConversationSelect: (id: string) => void;
}) {
  const [selection, setSelection] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelection((prev) => {
      const next = new Set(prev);
      if (selection.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <>
      {conversations.length === 0 ? (
        <EmptyResult name="conversation" />
      ) : (
        conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            selected={selection.has(conversation.id)}
            toggle={toggle}
            selectionEnabled={selection.size !== 0}
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
      )}

      <SelectionActionBar
        enabled={selection.size !== 0}
        className="bottom-2 left-2 right-2 fixed"
        selection={selection}
        left={() => {
          return (
            <>
              <SelectAllButton
                onClick={() => {
                  setSelection(new Set(conversations.map((c: any) => c.id)));
                }}
              />
              <ClearSelectionButton setSelection={setSelection} />
            </>
          );
        }}
        right={() => (
          <>
            <div className="icon-container icon-container-sm">
              <MoreDropdownButton
                contentProps={{
                  side: "top",
                }}
              >
                <AddToFolderDropdown
                  conversationIdList={new Array(...selection)}
                />
              </MoreDropdownButton>
            </div>
          </>
        )}
      />
    </>
  );
}
