import * as LucideIcon from "lucide-react";
import { cn } from "../../../lib/utils";
import { PANEL_NAV_ITEMS } from "../config";
import { NavLink } from "react-router-dom";

export default function BottomNavBar() {
  return (
    <div className="flex gap-1 my-2">
      {PANEL_NAV_ITEMS.map((item) => {
        const Comp = LucideIcon[item.icon];
        return (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center flex-1 py-3 rounded-md trans bottom-nav-item cursor-pointer hover:bg-slate-400/50",
                isActive ? "nav-item-active" : ""
              )
            }
            key={item.name}
          >
            <Comp className="w-6 h-6 trans" strokeWidth={1.75} />
            {/* <div className="mt-2 text-xs">{item.name}</div> */}
          </NavLink>
        );
      })}
    </div>
  );
}
