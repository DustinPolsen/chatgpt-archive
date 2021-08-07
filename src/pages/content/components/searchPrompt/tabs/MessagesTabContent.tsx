import { MessageItem } from "@src/components/Message";
import { EmptyResult } from "../EmptyResult";

export function MessageTabContent({
  messages,
  keyword,
}: {
  messages: Message[];
  keyword: string;
}) {
  return (
    <>
      {messages && messages.length !== 0 ? (
        messages.map((m) => (
          <MessageItem key={m.id} message={m} keyword={keyword} />
        ))
      ) : (
        <EmptyResult name="message" />
      )}
    </>
  );
}
