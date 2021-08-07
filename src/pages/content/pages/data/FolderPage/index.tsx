import React, { useEffect, useState } from "react";
import { ListView } from "@src/components/ListView";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  ClearSelectionButton,
  SelectAllButton,
  SelectionActionBar,
} from "@src/components/SelectionActionBar";

import { Dialog, DialogTrigger } from "@src/components/ui/dialog";
import { DialogForm } from "@src/components/DialogForm";
import { useAtom } from "jotai";
import { createNewFolder, deleteFolder } from "@src/pages/content/messages";
import {
  bgResponseStatusAtom,
  folderListAtom,
} from "@src/pages/content/context";
import {
  FolderItem,
  FolderMoreOptionButton,
} from "../../../../../components/Folder";
import { FolderPlusIcon } from "@src/components/Icon";

type CreateNewFolderForm = {
  newFolderName: string;
  color?: string;
};

function CreateNewFolderButton() {
  const [open, setOpen] = useState(false);
  const [responseStatus, setResponseStatus] = useAtom(bgResponseStatusAtom);

  const onSubmit = (data: CreateNewFolderForm) => {
    console.log("create new folder", data);
    createNewFolder({ name: data.newFolderName, children: [] });
  };

  useEffect(() => {
    if (open && responseStatus.status === "SUCCESS") {
      setOpen(false);
    }
  }, [responseStatus]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="icon-container icon-container-md" role="button">
          <FolderPlusIcon size="sm" />
        </div>
        {/* <Button size="icon" variant="outline">
          <Plus className="icon-sm" />
        </Button> */}
      </DialogTrigger>
      <DialogForm
        title="Create a New Folder"
        inputs={[
          {
            label: "New Folder Name",
            name: "newFolderName",
            type: "text",
            placeholder: "Enter the name of the new folder",
            autoComplete: "off",
          },
        ]}
        onSubmit={onSubmit}
        setOpen={setOpen}
      />
    </Dialog>
  );
}

export function FolderPage() {
  const [folders] = useAtom(folderListAtom);
  return (
    <>
      <div className="flex items-center h-12">
        <CreateNewFolderButton />
      </div>
      <ListView
        dataAtom={folderListAtom}
        renderData={({ data, selection, toggle }) => (
          <div className="flex flex-col w-full">
            {data.map((item) => (
              <FolderItem
                key={item.id}
                folder={item}
                selected={selection.has(item.id)}
                toggle={toggle}
                selectionEnabled={selection.size !== 0}
                OptionButtons={FolderMoreOptionButton}
              />
            ))}
          </div>
        )}
        id="folder-list"
        renderSelectionBar={({ selection, setSelection }) => (
          <SelectionActionBar
            enabled={selection.size !== 0}
            selection={selection}
            left={() => {
              return (
                <>
                  <SelectAllButton
                    onClick={() => {
                      setSelection(new Set(folders.map((c: any) => c.id)));
                    }}
                  />
                  <ClearSelectionButton setSelection={setSelection} />
                </>
              );
            }}
            right={() => (
              <>
                <div
                  className="text-red-500 icon-container icon-container-sm"
                  onClick={() => {
                    console.log("delete folders", selection);
                    deleteFolder(Array.from(selection));
                    setSelection(new Set());
                  }}
                >
                  <Trash2 />
                </div>
                <div className="icon-container icon-container-sm">
                  <MoreHorizontal />
                </div>
              </>
            )}
          />
        )}
      />
    </>
  );
}
