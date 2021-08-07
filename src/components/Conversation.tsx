import React from "react";
import {
  CardContainer,
  CardContent,
  CardRightOptions,
  CardTitle,
} from "@src/components/Card";
import { ConversationDetailOptionButton } from "@src/components/actions/ConversationDetailPopover";
import {
  MoreDropdownButton,
  SimpleDropdownMenuItemWithIcon,
} from "@src/pages/content/components/MoreDropdownButton";
import { AddToFolderDropdown } from "@src/components/actions/AddToFolder";
import {
  TogglePinConversationOptionButton,
  TogglePinConversationDropdown,
} from "@src/components/actions/TogglePinConversation";
import { useConversation } from "@src/pages/content/hook";
import { loadConversation } from "@src/utils";
import { SelectionIcon } from "@src/components/Selection";
import { MessageIcon, RenameIcon } from "@src/components/Icon";
import { renameConversation } from "@src/pages/content/messages";

const ConversationPresentor = React.memo(function ConversationCardPresentor({
  conversation,
  pinned,
  active,
  selected,
  toggle,
  selectionEnabled,
  optionButtons,
}: {
  conversation: Conversation;
  pinned: boolean;
  active: boolean;
  selected: boolean | null;
  toggle: (id: string) => void | null;
  selectionEnabled: boolean | null;
  optionButtons: ({
    conversation,
  }: {
    conversation: Conversation;
  }) => React.ReactNode;
}) {
  console.log("render Conversation");
  return (
    <CardContainer
      icon={
        <SelectionIcon
          icon={<MessageIcon size="sm" />}
          selectionEnabled={selectionEnabled}
          toggle={toggle}
          id={conversation.id}
          selected={selected}
        />
      }
      props={{
        container: {
          "data-pin": pinned ? "true" : "false",
          "data-active": active ? "true" : "false",
          className: "conversation",
        },
      }}
      key={conversation.id}
    >
      <CardContent
        className="conversation-content"
        onClick={() => {
          console.log("click conversation");
          loadConversation(conversation.id);
        }}
      >
        <CardTitle>{conversation.title}</CardTitle>
      </CardContent>
      {optionButtons({ conversation })}
    </CardContainer>
  );
});

export function ConversationItem({
  conversation,
  selected = null,
  toggle = null,
  selectionEnabled = null,
  optionButtons = DefaultConversationOptions,
}: {
  conversation: Conversation;
  selected?: boolean;
  toggle?: (id: string) => void;
  selectionEnabled?: boolean;
  optionButtons?: ({
    conversation,
  }: {
    conversation: Conversation;
  }) => React.ReactNode;
}) {
  const { pinned, active } = useConversation(conversation.id);
  return (
    <ConversationPresentor
      conversation={conversation}
      selected={selected}
      toggle={toggle}
      pinned={pinned}
      active={active}
      selectionEnabled={selectionEnabled}
      optionButtons={optionButtons}
    />
  );
}

const ConversationPresentorWithoutSelect = React.memo(
  function ConversationCardPresentor({
    conversation,
    pinned,
    active,
    optionButtons,
  }: {
    conversation: Conversation;
    pinned: boolean;
    active: boolean;
    optionButtons: ({
      conversation,
    }: {
      conversation: Conversation;
    }) => React.ReactNode;
  }) {
    console.log("render Conversation");
    return (
      <CardContainer
        icon={<MessageIcon size="sm" />}
        props={{
          container: {
            "data-pin": pinned ? "true" : "false",
            "data-active": active ? "true" : "false",
            className: "conversation",
          },
        }}
        key={conversation.id}
      >
        <CardContent
          className="conversation-content"
          onClick={() => {
            console.log("click conversation");
            loadConversation(conversation.id);
          }}
        >
          <CardTitle>{conversation.title}</CardTitle>
        </CardContent>
        {optionButtons({ conversation })}
      </CardContainer>
    );
  }
);

export function ConversationItemWithoutSelect({
  conversation,
  optionButtons = DefaultConversationOptions,
}: {
  conversation: Conversation;
  optionButtons?: ({
    conversation,
  }: {
    conversation: Conversation;
  }) => React.ReactNode;
}) {
  const { pinned, active } = useConversation(conversation.id);
  return (
    <ConversationPresentorWithoutSelect
      conversation={conversation}
      pinned={pinned}
      active={active}
      optionButtons={optionButtons}
    />
  );
}

export function ConversationDefaultRightOptions({
  conversation,
}: {
  conversation: Conversation;
}) {
  const OptionInputsMap = {
    rename: {
      title: "Rename Conversation",
      inputs: [
        {
          label: "New Name",
          name: "name",
          type: "text",
          defaultValue: conversation.title,
          placeholder: "Enter a new conversation name",
          autoComplete: "off",
        },
      ],
      onSubmit: (data: any) => {
        if (data.name !== conversation.title) {
          console.log(`rename conversation ${conversation.title}`, data);
          renameConversation(conversation.id, data.name);
        }
      },
    },
  };
  return (
    <>
      <ConversationDetailOptionButton conversation={conversation} />
      <TogglePinConversationOptionButton conversationId={conversation.id} />
      <MoreDropdownButton OptionInputsMap={OptionInputsMap}>
        {({ setSelected }) => (
          <>
            <SimpleDropdownMenuItemWithIcon
              icon={RenameIcon}
              onSelect={() => {
                setSelected("rename");
              }}
            >
              Rename
            </SimpleDropdownMenuItemWithIcon>
            <AddToFolderDropdown conversationIdList={[conversation.id]} />
            <TogglePinConversationDropdown conversationId={conversation.id} />
          </>
        )}
      </MoreDropdownButton>
    </>
  );
}

export function DefaultConversationOptions({
  conversation,
}: {
  conversation: Conversation;
}) {
  return (
    <CardRightOptions>
      <ConversationDefaultRightOptions conversation={conversation} />
    </CardRightOptions>
  );
}
