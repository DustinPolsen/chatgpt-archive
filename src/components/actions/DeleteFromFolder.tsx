import { DeleteIcon } from "@src/components/Icon";
import { DropdownMenuItem } from "@src/components/ui/dropdown-menu";
import { deleteConversationsFromFolder } from "@src/pages/content/messages";

export function DeleteFromFolderDropdown({
  folderId,
  conversationId,
}: {
  folderId: string;
  conversationId: string;
}) {
  return (
    <DropdownMenuItem
      onSelect={() => {
        console.debug("delete from folder", { folderId, conversationId });
        deleteConversationsFromFolder([conversationId], folderId);
      }}
    >
      <DeleteIcon className="icon-dropdown-menu-item" size="sm" />
      <span>Delete from folder</span>
    </DropdownMenuItem>
  );
}

export function DeleteFromFolderOptionButton({
  folderId,
  conversationId,
  size = "sm",
}: {
  folderId: string;
  conversationId: string;
  size?: IconSize;
}) {
  return (
    <div
      onClick={() => {
        console.debug("delete from folder", { folderId, conversationId });
        deleteConversationsFromFolder([conversationId], folderId);
      }}
      className={`icon-container icon-container-${size}`}
    >
      <DeleteIcon size={size} />
    </div>
  );
}
