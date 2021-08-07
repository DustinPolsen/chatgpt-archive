import React from "react";
import {
  CardContainer,
  CardContent,
  CardDescription,
  CardRightOptions,
  CardTitle,
} from "@src/components/Card";
import { ConversationDetailOptionButton } from "@src/components/actions/ConversationDetailPopover";
import {
  MoreDropdownButton,
  SimpleDropdownMenuItemWithIcon,
} from "@src/pages/content/components/MoreDropdownButton";
import { AddToFolderDropdown } from "@src/components/actions/AddToFolder";
import { TogglePinConversationDropdown } from "@src/components/actions/TogglePinConversation";
import { useConversation } from "@src/pages/content/hook";
import { loadConversation } from "@src/utils";
import { SelectionIcon } from "@src/components/Selection";
import {
  DeleteIcon,
  FolderIcon,
  MessageIcon,
  RenameFolderIcon,
  ToggleIcon,
} from "@src/components/Icon";
import { DeleteFromFolderOptionButton } from "./actions/DeleteFromFolder";
import { deleteFolder, renameFolder } from "@src/pages/content/messages";
import { DropdownMenuItem } from "./ui/dropdown-menu";

const ConversationPresentor = React.memo(function ConversationCardPresentor({
  conversation,
  folderId,
  pinned,
  active,
}: {
  conversation: Conversation;
  folderId: string;
  pinned: boolean;
  active: boolean;
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
          loadConversation(conversation.id);
        }}
      >
        <CardTitle>{conversation.title}</CardTitle>
      </CardContent>
      <CardRightOptions>
        <ConversationDetailOptionButton conversation={conversation} />
        {/* <TogglePinConversationOptionButton conversationId={conversation.id} /> */}
        <DeleteFromFolderOptionButton
          conversationId={conversation.id}
          folderId={folderId}
        />
        <MoreDropdownButton>
          <AddToFolderDropdown conversationIdList={[conversation.id]} />
          <TogglePinConversationDropdown conversationId={conversation.id} />
        </MoreDropdownButton>
      </CardRightOptions>
    </CardContainer>
  );
});

export function FolderChildConversationItem({
  conversation,
  folderId,
}: {
  conversation: Conversation;
  folderId: string;
}) {
  const { pinned, active } = useConversation(conversation.id);
  return (
    <ConversationPresentor
      conversation={conversation}
      pinned={pinned}
      active={active}
      folderId={folderId}
    />
  );
}

const FolderPresentor = React.memo(function FolderCardPresentor({
  folder,
  selected,
  toggle,
  selectionEnabled,
  OptionButtons,
}: {
  folder: Folder;
  selected: boolean | null;
  toggle: (id: string) => void | null;
  selectionEnabled: boolean | null;
  OptionButtons: React.FC<{ folderId: string }>;
}) {
  console.log("render folder presentor", { OptionButtons });
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative flex flex-col flex-1 min-w-0">
      <CardContainer
        icon={
          <SelectionIcon
            icon={<FolderIcon size="sm" />}
            selectionEnabled={selectionEnabled}
            toggle={toggle}
            id={folder.id}
            selected={selected}
          />
        }
      >
        <CardContent
          onClick={() => setOpen((p) => !p)}
          className="cursor-pointer"
        >
          <CardTitle>{folder.name}</CardTitle>
          <CardDescription>{`${folder.children.length} items`}</CardDescription>
        </CardContent>
        <CardRightOptions>
          <OptionButtons folderId={folder.id} />
        </CardRightOptions>
      </CardContainer>

      <div
        className="animate-dynamic-h-container"
        data-open={open ? "true" : "false"}
      >
        <div className="flex flex-col ml-7 animate-dynamic-h-content">
          {folder.children.map((item) => (
            <FolderChildConversationItem
              key={item.id}
              conversation={item}
              folderId={folder.id}
              //   selected={selection.has(item.id)}
              //   toggle={toggle}
              //   selectionEnabled={selectionEnabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export function FolderItem({
  folder,
  selected = null,
  toggle = null,
  selectionEnabled = null,
  OptionButtons = FolderMoreOptionButton,
}: {
  folder: Folder;
  selected?: boolean;
  toggle?: (id: string) => void;
  selectionEnabled?: boolean;
  OptionButtons?: React.FC<{ folderId: string }>;
}) {
  return (
    <FolderPresentor
      folder={folder}
      selected={selected}
      toggle={toggle}
      selectionEnabled={selectionEnabled}
      OptionButtons={OptionButtons}
    />
  );
}

export const FolderWithoutSelect = React.memo(function FolderCardPresentor({
  folder,
  OptionButtons,
}: {
  folder: Folder;
  OptionButtons: React.FC<{ folderId: string }>;
}) {
  console.log("render folder");
  return (
    <CardContainer icon={<FolderIcon size="sm" />}>
      <CardContent>
        <CardTitle>{folder.name}</CardTitle>
        <CardDescription>{`${folder.children.length} items`}</CardDescription>
      </CardContent>
      <CardRightOptions>
        <OptionButtons folderId={folder.id} />
      </CardRightOptions>
    </CardContainer>
  );
});

export function FolderMoreOptionButton({ folderId }: { folderId: string }) {
  const OptionInputsMap = {
    rename: {
      title: "Rename folder",
      inputs: [
        {
          label: "New Name",
          name: "name",
          type: "text",
          placeholder: "Enter a new name",
          autoComplete: "off",
        },
      ],
      onSubmit: (data: any) => {
        console.log(`rename folder ${folderId}`, data);
        renameFolder(folderId, data.name);
      },
    },
  };
  return (
    <MoreDropdownButton OptionInputsMap={OptionInputsMap}>
      {({ setSelected }) => (
        <>
          <SimpleDropdownMenuItemWithIcon
            icon={RenameFolderIcon}
            onSelect={() => {
              setSelected("rename");
            }}
          >
            Rename folder
          </SimpleDropdownMenuItemWithIcon>
          <DropdownMenuItem
            onSelect={() => {
              deleteFolder([folderId]);
            }}
          >
            <DeleteIcon className="icon-dropdown-menu-item" size="sm" />
            <span>Delete folder</span>
          </DropdownMenuItem>
        </>
      )}
    </MoreDropdownButton>
  );
}
