import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { bgResponseStatusAtom } from "../context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AddToFolderDropdown } from "../../../components/actions/AddToFolder";
import { cn } from "@src/lib/utils";
import { MoreIcon } from "@src/components/Icon";
import { DialogForm } from "@src/components/DialogForm";
import { Dialog } from "@src/components/ui/dialog";

function ConversationDropdownContent({
  setOpen,
  children,
  ...props
}: {
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenuContent>) {
  const [responseStatus, setResponseStatus] = useAtom(bgResponseStatusAtom);

  useEffect(() => {
    if (responseStatus.status) {
      console.log("Receive response", responseStatus);
      setOpen(false);
      setResponseStatus({});
    }
  }, [responseStatus]);

  return <DropdownMenuContent {...props}>{children}</DropdownMenuContent>;
}

export function MoreDropdownButton({
  children,
  OptionInputsMap = {},
  contentProps = {
    align: "end",
    className: "w-[200px]",
  },
  size = "sm",
}: {
  children:
    | React.ReactNode
    | (({
        setSelected,
      }: {
        setSelected: React.Dispatch<React.SetStateAction<string | null>>;
      }) => React.ReactNode);
  OptionInputsMap?: any;
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>;
  size?: IconSize;
}) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useAtom(bgResponseStatusAtom);

  // const OptionInputsMap = {
  //   rename: {
  //     title: "Rename folder",
  //     inputs: [
  //       {
  //         label: "New Name",
  //         name: "name",
  //         type: "text",
  //         placeholder: "Enter a new name",
  //         autoComplete: "off",
  //       },
  //     ],
  //     onSubmit: (data: any) => {
  //       console.log(`rename folder ${folderId}`, data);
  //       renameFolder(folderId, data.name);
  //     },
  //   },
  // };

  useEffect(() => {
    if (selectedOption) {
      console.log("setting dialog open to true");
      setDialogOpen(true);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (dialogOpen) {
      // when the dialog opens, close the dropdown
      setOpen(false);
    } else {
      // when the dialog closes, set the selected option to null
      setSelectedOption(null);
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (!responseStatus) {
      return;
    }
    if (open) {
      setOpen(false);
    }
    if (dialogOpen) {
      setDialogOpen(false);
    }
  }, [responseStatus]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              `icon-container icon-container-${size} text-foreground`
            )}
          >
            <MoreIcon size={size} />
          </div>
        </DropdownMenuTrigger>
        {open && (
          <DropdownMenuContent {...contentProps}>
            {typeof children === "function"
              ? children({ setSelected: setSelectedOption })
              : children}
          </DropdownMenuContent>
        )}
        {dialogOpen && !!OptionInputsMap[selectedOption] && (
          <DialogForm {...OptionInputsMap[selectedOption]} setOpen={setOpen} />
        )}
      </DropdownMenu>
    </Dialog>
  );
}

export function SimpleDropdownMenuItemWithIcon({
  onSelect,
  icon: Icon,
  children,
}: {
  onSelect: (e: Event) => void;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem onSelect={onSelect}>
      <Icon className="icon-dropdown-menu-item" size="sm" />
      <span>{children}</span>
    </DropdownMenuItem>
  );
}

// export function MoreDropdownButton1({
//   triggerClassName = "",
//   size = "sm",
//   contentProps = {
//     align: "end",
//     className: "w-[200px]",
//   },
//   children,
// }: {
//   triggerClassName?: string;
//   size?: IconSize;
//   contentProps?: React.ComponentProps<typeof DropdownMenuContent>;
//   children: React.ReactNode;
// }) {
//   const [open, setOpen] = useState(false);

//   // console.log("render MoreDropdownButton");

//   return (
//     <DropdownMenu open={open} onOpenChange={setOpen}>
//       <DropdownMenuTrigger>
//         <div
//           className={cn(
//             `icon-container icon-container-${size} text-foreground`,
//             triggerClassName
//           )}
//         >
//           <MoreIcon size={size} />
//         </div>
//       </DropdownMenuTrigger>
//       {open && (
//         <ConversationDropdownContent setOpen={setOpen} {...contentProps}>
//           {children}
//         </ConversationDropdownContent>
//       )}
//     </DropdownMenu>
//   );
// }
