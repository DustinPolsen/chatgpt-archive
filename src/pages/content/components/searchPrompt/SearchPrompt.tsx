import { useRef, useEffect, useCallback, useState, memo } from "react";
import { useAtom } from "jotai";
import { searchOpenAtom } from "../../context";
import { useBgMessage } from "../../hook";
import { MESSAGE_ACTIONS } from "@src/constants";
import { search } from "../../messages";
// import { CommandLoading } from "cmdk";
import { loadConversation } from "@src/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@src/components/ui/tabs";
import { SearchForm, SearchFormValues } from "./SearchForm";
import { DIALOG_ANIMATION_DURATION, SEARCH_TABS } from "./config";
import ConversationTabContent from "./tabs/ConversationTabContent";
import AllTabContent from "./tabs/AllTabContent";
import FolderTabContent from "./tabs/FolderTabContent";
import { SearchResultTabAtom, SearchStateAtom } from "./context";
import CustomDialog from "@src/components/CustomDialog";
import { MessageTabContent } from "./tabs/MessagesTabContent";
import { Loading } from "./Loading";

const TabSubText = ({
  tab,
  result,
}: {
  tab: keyof typeof SEARCH_TABS;
  result: SearchResult;
}) => {
  return (
    <div className="mr-4 text-sm tracking-wide">
      {tab !== "all" && (
        <span>
          Total items:
          <span className="inline-block ml-2 font-medium">
            {result[tab].length}
          </span>
        </span>
      )}
    </div>
  );
};

export function TabContent() {
  const [{ result, loading, query }] = useAtom(SearchStateAtom);
  const [tab, setTab] = useAtom(SearchResultTabAtom);

  console.log("render search prompt tab content", result);

  function handleConversationSelect(conversationId: string) {
    loadConversation(conversationId);
  }

  return (
    <>
      <div
        className="bg-muted"
        style={{
          height: "1px",
          width: "100%",
        }}
      ></div>
      <Tabs
        defaultValue="all"
        value={tab}
        className="relative flex flex-col px-2"
        onValueChange={(v: keyof typeof SEARCH_TABS) => setTab(() => v)}
      >
        <div className="flex items-center justify-between flex-none pt-2">
          <TabsList>
            {Object.keys(SEARCH_TABS).map((t, i) => (
              <TabsTrigger value={t} key={i}>
                {SEARCH_TABS[t].label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabSubText tab={tab} result={result} />
        </div>

        <div
          style={{
            height: "500px",
            position: "relative",
          }}
        >
          {loading ? (
            <Loading />
          ) : (
            <>
              <TabsContent
                value="all"
                style={{
                  marginBottom: "8px",
                }}
              >
                <AllTabContent
                  result={result}
                  keyword={query}
                  setTab={setTab}
                  handleConversationSelect={handleConversationSelect}
                />
              </TabsContent>
              <TabsContent
                value="conversations"
                className="space-y-2"
                style={{
                  position: "absolute",
                  inset: 0,
                  overflowY: "scroll",
                  marginBottom: "8px",
                }}
              >
                <ConversationTabContent
                  conversations={result.conversations}
                  keyword={query}
                  handleConversationSelect={handleConversationSelect}
                />
              </TabsContent>
              <TabsContent
                value="messages"
                className="space-y-2"
                style={{
                  position: "absolute",
                  inset: 0,
                  overflowY: "scroll",
                  marginBottom: "8px",
                }}
              >
                <MessageTabContent messages={result.messages} keyword={query} />
              </TabsContent>
              <TabsContent
                value="folders"
                className="space-y-2"
                style={{
                  position: "absolute",
                  inset: 0,
                  overflowY: "scroll",
                  marginBottom: "8px",
                }}
              >
                <FolderTabContent folders={result.folders} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </>
  );
}

export const SearchPromptContent = memo(function SearchPromptContent() {
  const [state, setState] = useAtom(SearchStateAtom);
  const [_, setTab] = useAtom(SearchResultTabAtom);

  const handleSeachSubmit = useCallback((data: SearchFormValues) => {
    const trimedQuery = data.query.trim();
    if (trimedQuery === "") {
      setState(() => ({
        loading: false,
        result: null,
        showResult: false,
        query: "",
      }));
      setTab("all");
      return;
    }
    console.log("search form submitted", data);
    search(data.query);
    setState((p) => ({
      ...p,
      loading: true,
      query: data.query,
    }));
  }, []);

  useBgMessage({
    [MESSAGE_ACTIONS.SEARCH]: (request, sender, _) => {
      const data = request.data as SearchResult;
      console.log(
        "[useBgMessage][Type: Search][Component: SearchPrompt]",
        data
      );
      setState((p) => ({
        ...p,
        loading: false,
        showResult: true,
        result: data,
      }));
    },
  });

  console.log("render search prompt content", state);

  return (
    <div className="flex flex-col">
      <SearchForm
        onSubmit={handleSeachSubmit}
        query={state.query}
        setQuery={(v: string) => {
          setState((p) => ({
            ...p,
            query: v,
            showResult: p.showResult ? v !== "" : false,
            result: v === "" ? null : p.result,
          }));
        }}
      />
      {(state.loading || state.showResult) && <TabContent />}
    </div>
  );
});

export function SearchPrompt() {
  const [open] = useAtom(searchOpenAtom);

  return (
    <CustomDialog
      open={open}
      duration={DIALOG_ANIMATION_DURATION}
      openYOffset={"20vh"}
      closedYOffset={"21vh"}
      openXOffset="-50%"
      closedXOffset="-50%"
      className="fixed top-0 z-50 hidden w-full max-w-xl gap-4 p-0 overflow-hidden border rounded-lg shadow-lg left-1/2 bg-background sm:rounded-lg md:w-full search-prompt border-muted"
    >
      <SearchPromptContent />
    </CustomDialog>
  );
}
