import { PANEL_NAV_ITEMS } from "@src/pages/content/config";
import { NavLink, Outlet } from "react-router-dom";
import { PinConversationList } from "../../../components/PinConversation";

export function DataPage() {
  return (
    <>
      <PinConversationList />
      <div className="flex h-[48px]" id="data-page-header">
        <div className="pill-group">
          {PANEL_NAV_ITEMS[0].children.map((item, i) => {
            return (
              <NavLink
                to={item.path}
                key={i}
                style={({ isActive }) => ({
                  backgroundColor: isActive
                    ? "hsl(var(--background))"
                    : "transparent",
                })}
                className={({ isActive }) =>
                  isActive ? "pill active" : "pill"
                }
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>
      <Outlet />
    </>
  );
}
