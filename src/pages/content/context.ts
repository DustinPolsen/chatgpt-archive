import { atom, useAtom } from "jotai";
import { selectAtom } from "jotai/utils";

export const panelOpenAtom = atom<boolean>(false);
export const searchOpenAtom = atom<boolean>(false);

export const oUserAtom = atom<any>(null);

export const conversationListAtom = atom<Conversation[]>([]);
export const folderListAtom = atom<Folder[]>([]);
export const pinConversationListAtom = atom<Conversation[]>([]);
export const pinConversationIdSetAtom = selectAtom(
  pinConversationListAtom,
  (l) => new Set(l.map((c) => c.id))
);

export const currentConversationIdAtom = atom<string | null>("");

export const bgResponseStatusAtom = atom<{ status?: string; message?: string }>(
  {}
);

export const globalDialogAtom = atom<boolean>(false);
