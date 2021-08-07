import { DropdownMenuItem } from "@src/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { pinConversationIdSetAtom } from "../../pages/content/context";
import { togglePinConversation } from "../../pages/content/messages";
import { PinIcon } from "@src/components/Icon";

export function TogglePinConversationDropdown({
  conversationId,
}: {
  conversationId: string;
}) {
  const [pinSet, _] = useAtom(pinConversationIdSetAtom);
  const pinned = pinSet.has(conversationId);
  return (
    <DropdownMenuItem
      onSelect={() => {
        togglePinConversation(conversationId);
      }}
    >
      <PinIcon pinned={pinned} className="icon-dropdown-menu-item" size="sm" />
      {pinned ? "Unpin conversation" : "Pin conversation"}
    </DropdownMenuItem>
  );
}

export function TogglePinConversationOptionButton({
  conversationId,
  size = "sm",
  ...rest
}: {
  conversationId: string;
  size?: IconSize;
} & Omit<React.ComponentPropsWithoutRef<typeof PinIcon>, "pinned">) {
  const [pinSet, _] = useAtom(pinConversationIdSetAtom);
  const pinned = pinSet.has(conversationId);
  return (
    <div className={`icon-container icon-container-${size}`}>
      <PinIcon
        pinned={pinned}
        size={size}
        onClick={() => {
          togglePinConversation(conversationId);
        }}
        {...rest}
      />
    </div>
  );
}
