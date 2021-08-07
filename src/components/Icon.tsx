import {
  Check,
  ChevronRight,
  Delete,
  Folder,
  FolderEdit,
  FolderPlus,
  Info,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@src/lib/utils";

export function SuccessIcon() {
  return (
    <div className="flex items-center justify-center rounded-full select-none bg-primary w-7 h-7">
      <Check size={20} />
    </div>
  );
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function MessageIcon({
  size = "md",
}: {
  size: "sm" | "md" | "lg" | number;
}) {
  return (
    <MessageSquare
      className="flex-none"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
    />
  );
}

export function FolderIcon({ size }: { size: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  return (
    <Folder
      className="flex-none"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
    />
  );
}

export function ToggleIcon({
  onClick,
  style,
  className,
  open,
  ...props
}: {
  open: boolean;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "transition-transform icon-container icon-container-sm",
        className
      )}
      onClick={onClick}
      style={{
        transform: open ? "rotate(90deg)" : "",
        ...style,
      }}
      {...props}
    >
      <ChevronRight
        style={{
          width: 20,
          height: 20,
        }}
      />
    </div>
  );
}

export function PinIcon({
  pinned,
  size = "md",
  className,
  ...rest
}: {
  pinned: boolean;
  size?: "sm" | "md" | "lg";
} & React.ComponentPropsWithoutRef<typeof Pin>) {
  return pinned ? (
    <PinOff
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={cn("text-red-500 cursor-pointer", className)}
      {...rest}
    />
  ) : (
    <Pin
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={cn("text-yellow-500 cursor-pointer", className)}
      {...rest}
    />
  );
}

export function MessageIconWithSelection({
  size = "md",
  selected,
  enabled,
  id,
  handleToggle,
}: {
  size?: "sm" | "md" | "lg";
  selected: boolean;
  enabled: boolean;
  id: string;
  handleToggle: React.MouseEventHandler<HTMLButtonElement>;
}) {
  if (enabled) {
    return (
      <Checkbox
        id={id}
        checked={selected}
        onClick={handleToggle}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
        }}
      />
    );
  }
  return (
    <div className="relative group fcenter">
      <Checkbox
        id={id}
        checked={selected}
        className="relative z-10 opacity-0 group-hover:opacity-100"
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
        }}
        onClick={handleToggle}
      />
      <MessageSquare
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
        }}
        className="absolute group-hover:opacity-0 trans"
      />
    </div>
  );
}

export function InfoIcon({ size }: { size: "sm" | "md" | "lg" }) {
  return (
    <Info
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
    />
  );
}

export function DeleteIcon({
  size = "md",
  className,
}: { size?: "sm" | "md" | "lg" } & React.ComponentPropsWithoutRef<
  typeof Delete
>) {
  return (
    <Trash2
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={cn("text-red-500", className)}
    />
  );
}

export function MoreIcon({
  size = "md",
}: { size?: "sm" | "md" | "lg" } & React.ComponentPropsWithoutRef<
  typeof MoreHorizontal
>) {
  return (
    <MoreHorizontal
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
    />
  );
}

export function RenameFolderIcon({
  size = "md",
  className,
}: { size?: "sm" | "md" | "lg" } & React.ComponentPropsWithoutRef<
  typeof FolderEdit
>) {
  return (
    <FolderEdit
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={className}
    />
  );
}

export function MessageCircleIcon({
  size = "md",
  className,
}: { size?: "sm" | "md" | "lg" } & React.ComponentPropsWithoutRef<
  typeof MessageSquare
>) {
  return (
    <MessageCircle
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={className}
    />
  );
}

export function ForceRefreshIcon({
  size = "md",
  className,
}: { size?: "sm" | "md" | "lg" } & React.ComponentPropsWithoutRef<
  typeof RefreshCcw
>) {
  return (
    <RefreshCcw
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={className}
    />
  );
}

export function FolderPlusIcon({
  size = "md",
  className,
  ...props
}: { size?: "sm" | "md" | "lg" } & React.ComponentPropsWithoutRef<
  typeof RefreshCcw
>) {
  return (
    <FolderPlus
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={className}
      {...props}
    />
  );
}

export function RenameIcon({
  size = "md",
  className,
}: { size?: "sm" | "md" | "lg" } & React.ComponentPropsWithoutRef<
  typeof FolderEdit
>) {
  return (
    <Pencil
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={className}
    />
  );
}
