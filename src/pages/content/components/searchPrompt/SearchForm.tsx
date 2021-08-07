import { Input } from "@src/components/ui/input";
import { useAtom } from "jotai";
import { Search, X } from "lucide-react";
import React from "react";
import { searchOpenAtom } from "../../context";
import { useEffect } from "react";
import { DIALOG_ANIMATION_DURATION } from "./config";

export type SearchFormValues = {
  query: string;
};

export const SearchForm = React.memo(function SearchForm({
  onSubmit,
  query,
  setQuery,
}: {
  onSubmit: (data: SearchFormValues) => void;
  query: string;
  setQuery: (v: string) => void;
}) {
  const [open, setOpen] = useAtom(searchOpenAtom);
  console.log("render SearchForm");
  const ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && open) {
      console.log("focus search input");
      setTimeout(() => {
        ref.current.focus();
        ref.current.value = query;
      }, DIALOG_ANIMATION_DURATION);
    }
  }, [ref.current, open]);

  return (
    <form
      className="flex items-center px-3 py-1"
      onSubmit={(e) => {
        e.preventDefault();
        const query = ref.current?.value || "";
        console.log("submit search form", { query });
        onSubmit({ query });
      }}
    >
      <Search className="w-4 h-4 mr-2 opacity-50 shrink-0" />
      <Input
        ref={ref}
        className={
          "flex h-10 w-full rounded-md bg-transparent py-2 px-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none"
        }
        placeholder="Search conversations, folders, and more"
        type="text"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <div
        className="icon-container icon-container-sm opacity-50 hover:opacity-100 trans"
        onClick={() => setOpen(!open)}
      >
        <X />
      </div>
    </form>
  );
});
