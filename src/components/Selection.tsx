import { atom, useAtom } from "jotai";
import { Checkbox } from "@src/components/ui/checkbox";

export function SelectionIcon({
  icon,
  selectionEnabled,
  selected,
  toggle,
  id,
  size = 18,
}: {
  icon: React.ReactNode;
  selectionEnabled: boolean;
  selected: boolean;
  toggle: (id: string) => void;
  id: string;
  size?: 18 | 24;
}) {
  const handleToggle = (e) => {
    e.stopPropagation();
    toggle(id);
  };
  if (selectionEnabled) {
    return (
      <Checkbox
        id={id}
        checked={selected}
        onClick={handleToggle}
        style={{
          width: size,
          height: size,
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
          width: size,
          height: size,
        }}
        onClick={handleToggle}
      />
      <div className="absolute group-hover:opacity-0 trans">{icon}</div>
    </div>
  );
}
