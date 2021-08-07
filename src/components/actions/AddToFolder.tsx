import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@src/components/ui/command";
import { useAtom } from "jotai";
import { folderListAtom } from "../../pages/content/context";
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@src/components/ui/dropdown-menu";
import { Check, FolderInput } from "lucide-react";
import { addConversationsToFolder } from "../../pages/content/messages";

export function AddToFolderDropdown({
  conversationIdList,
}: {
  conversationIdList: string[];
}) {
  const [folders] = useAtom(folderListAtom);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <FolderInput className="icon-dropdown-menu-item" />
        <span>Add to folder</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="p-0">
        <Command>
          <CommandInput placeholder="Choose a folder" autoFocus />
          <CommandList>
            <CommandEmpty>No folders found</CommandEmpty>
            <CommandGroup>
              {folders.map((f, i) => {
                const fChildren = f.children.map((c) => c.id);
                const notAdded = conversationIdList.filter(
                  (cId) => !fChildren.includes(cId)
                );
                console.log("render folder", { f, notAdded });
                return (
                  <CommandItem
                    key={i}
                    disabled={notAdded.length === 0}
                    className={
                      "flex items-center justify-between" +
                      (notAdded.length === 0 ? " opacity-50" : "")
                    }
                    onSelect={() => {
                      addConversationsToFolder(notAdded, f.id);
                    }}
                  >
                    {f.name}
                    {notAdded.length === 0 && <Check className={"w-4 h-4"} />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
