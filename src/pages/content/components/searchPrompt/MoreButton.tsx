import { ALL_TAB_GROUP_SIZE } from "./config";

export function MoreButton({
  data,
  name: key,
  onSelect,
}: {
  data: any[];
  name: string;
  onSelect: () => void;
}) {
  console.log("render more button", { key, data });
  return (
    data &&
    data.length > ALL_TAB_GROUP_SIZE && (
      <div
        // key={key + "-more"}
        // value={key + "-more"}
        // onSelect={onSelect}
        onClick={() => onSelect()}
        className="flex items-center justify-center card cursor-pointer"
      >
        <span className="text-sm  text-muted-foreground select-none">
          See all {data.length} results
        </span>
      </div>
    )
  );
}
