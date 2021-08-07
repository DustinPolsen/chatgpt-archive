import { useAtom } from "jotai";
import { pinConversationListAtom } from "../pages/content/context";
import { ConversationItemWithoutSelect } from "./Conversation";

export function PinConversationList() {
  const [pinConversations, _] = useAtom(pinConversationListAtom);

  if (pinConversations.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 mb-3">
      {pinConversations.map((c) => (
        <ConversationItemWithoutSelect key={c.id} conversation={c} />
      ))}
    </div>
  );
}
