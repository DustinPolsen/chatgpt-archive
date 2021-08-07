import { atom } from "jotai";
import { SEARCH_TABS } from "./config";

export const SearchStateAtom = atom<{
  loading: boolean;
  result: SearchResult | null;
  showResult: boolean;
  query: string;
}>({
  loading: false,
  result: null,
  showResult: false,
  query: "",
});

export const SearchResultTabAtom = atom<keyof typeof SEARCH_TABS>("all");
