import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { InfoIcon } from "../Icon";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { cn } from "@src/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function formatDates(s: string): string {
  const date = new Date(s);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-foreground w-[84px]">{children}</div>;
}

function Value({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 min-h-0 truncate">{children}</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex text-xs text-muted-foreground">
      <Label>{label}</Label>
      <Value>{value}</Value>
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <div className="line-clamp-2 text-base text-foreground">{children}</div>;
}

export function ConversationDetailOptionButton({
  conversation,
  size = "sm",
  className = "",
}: {
  conversation: Conversation;
  size?: IconSize;
} & React.ComponentProps<typeof PopoverTrigger>) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(`icon-container icon-container-${size}`, className)}
      >
        <InfoIcon size={size} />
      </TooltipTrigger>
      <TooltipContent className="w-[320px] space-y-2">
        <Title>{conversation.title}</Title>
        <div>
          <Row
            label="Create time:"
            value={formatDates(conversation.create_time)}
          />
          <Row
            label="Update time:"
            value={formatDates(conversation.update_time)}
          />
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function ConversationDetailPopoverDropdown({
  conversation,
}: {
  conversation: Conversation;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <DropdownMenuItem>
          <InfoIcon size="sm" />
        </DropdownMenuItem>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <div className="text-sm text-muted-foreground">
            Create time: {formatDates(conversation.create_time)}
          </div>
          <div className="text-sm text-muted-foreground">
            Update time: {formatDates(conversation.update_time)}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
