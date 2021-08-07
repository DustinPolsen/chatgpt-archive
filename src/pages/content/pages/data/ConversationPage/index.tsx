import { conversationListAtom } from "@src/pages/content/context";
import { ListGroup, ListView } from "@src/components/ListView";
import { categorizeConversations } from "@src/utils";
import { useState } from "react";
import { useAtom } from "jotai";
// import { ArrowUpDown, MoreHorizontal } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectTrigger,
//   SelectItem,
// } from "@src/components/ui/select";
import {
  ClearSelectionButton,
  SelectAllButton,
  SelectionActionBar,
} from "@src/components/SelectionActionBar";
import { MoreDropdownButton } from "@src/pages/content/components/MoreDropdownButton";
import { AddToFolderDropdown } from "@src/components/actions/AddToFolder";
import { ConversationItem } from "../../../../../components/Conversation";

const SortByOptions: Record<
  string,
  {
    label: string;
    key: SortAttribute;
    params: {
      sortBy: SortAttribute;
      desc: boolean;
    };
    sortFunction: (a: Conversation, b: Conversation) => number;
  }
> = {
  update_time_asc: {
    label: "Last updated (1 → 9)",
    key: "update_time",
    params: {
      sortBy: "update_time",
      desc: false,
    },
    sortFunction: (a: Conversation, b: Conversation) => {
      return (
        new Date(b.update_time).getTime() - new Date(a.update_time).getTime()
      );
    },
  },
  update_time_desc: {
    label: "Last updated (9 → 1)",
    key: "update_time",
    params: {
      sortBy: "update_time",
      desc: true,
    },
    sortFunction: (a: Conversation, b: Conversation) => {
      return (
        new Date(a.update_time).getTime() - new Date(b.update_time).getTime()
      );
    },
  },
  create_time_asc: {
    label: "Created time (1 → 9)",
    key: "create_time",
    params: {
      sortBy: "create_time",
      desc: false,
    },
    sortFunction: (a: Conversation, b: Conversation) => {
      return (
        new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
      );
    },
  },
  create_time_desc: {
    label: "Created time (9 → 1)",
    key: "create_time",
    params: {
      sortBy: "create_time",
      desc: true,
    },
    sortFunction: (a: Conversation, b: Conversation) => {
      return (
        new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
      );
    },
  },
};

export function ConversationPage() {
  const [sortByKey, setSortByKey] = useState<keyof typeof SortByOptions>(
    "update_time_asc" as keyof typeof SortByOptions
  );
  const [conversationList, setConversationList] = useAtom(conversationListAtom);

  // useEffect(() => {
  //   console.log("sort by", sortByKey);
  //   const { sortBy, desc } = SortByOptions[sortByKey].params;
  //   fetchConversations(sortBy, desc);
  //   // setConversationList((p) => p.sort(SortByOptions[sortByKey].sortFunction));
  // }, [sortByKey]);

  return (
    <>
      {/* <div className="flex items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(v) => {
                setSortByKey(v as keyof typeof SortByOptions);
              }}
              defaultValue="update_time_desc"
            >
              <SelectTrigger>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <span className="mr-2 text-sm">Order by</span>
              </SelectTrigger>
              <SelectContent align="end">
                {Object.keys(SortByOptions).map((key) => (
                  <SelectItem key={key} value={key}>
                    {SortByOptions[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div> */}
      <ListView
        dataAtom={conversationListAtom}
        renderData={({ data, selection, toggle }) =>
          data.length === 0 ? (
            <div className="flex justify-center mt-8">No data</div>
          ) : (
            categorizeConversations(data, SortByOptions[sortByKey].key).map(
              ([key, value], i) => {
                if (value.length === 0) return <></>;
                return (
                  <ListGroup title={key} i={i} count={value.length}>
                    {value.map((item: Conversation) => (
                      <ConversationItem
                        conversation={item}
                        selectionEnabled={selection.size !== 0}
                        selected={selection.has(item.id)}
                        toggle={toggle}
                      />
                    ))}
                  </ListGroup>
                );
              }
            )
          )
        }
        id="con-list"
        renderSelectionBar={({ selection, setSelection }) => (
          <SelectionActionBar
            enabled={selection.size !== 0}
            selection={selection}
            left={() => {
              return (
                <>
                  <SelectAllButton
                    onClick={() => {
                      setSelection(
                        new Set(conversationList.map((c: any) => c.id))
                      );
                    }}
                  />
                  <ClearSelectionButton setSelection={setSelection} />
                </>
              );
            }}
            right={() => (
              <>
                <div className="icon-container icon-container-sm">
                  <MoreDropdownButton
                    contentProps={{
                      side: "top",
                    }}
                  >
                    <AddToFolderDropdown
                      conversationIdList={new Array(...selection)}
                    />
                  </MoreDropdownButton>
                </div>
              </>
            )}
          />
        )}
      />
    </>
  );
}
