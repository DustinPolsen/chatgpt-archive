import { BsClockHistory } from "react-icons/bs";
import { useAtom } from "jotai";
import { panelOpenAtom } from "../context";
import { SpinnerIcon } from "@src/components/Spinner";
import { useRefresh } from "../hook";
import { Logo } from "@src/components/Logo";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { deleteReactRoot, reactShadowRoot } from "../root";

const DRAGGING_STATES = {
  DRAGGING: "dragging",
};
const STICK_SIDE_STATES = {
  LEFT: "left",
  RIGHT: "right",
};

export function Thumb() {
  const [open, setOpen] = useAtom(panelOpenAtom);
  const { refreshing } = useRefresh();
  const thumbRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!thumbRef.current) return;
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    const handleDragMove = (e: DragEvent) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      thumbRef.current.style.top = thumbRef.current.offsetTop - pos2 + "px";
      thumbRef.current.style.left = thumbRef.current.offsetLeft - pos1 + "px";
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      thumbRef.current.setAttribute(
        "data-drag-state",
        DRAGGING_STATES.DRAGGING
      );
      thumbRef.current.setAttribute(
        "data-drag-start-y",
        thumbRef.current.offsetTop + "px"
      );
      thumbRef.current.setAttribute(
        "data-drag-start-x",
        thumbRef.current.offsetLeft + "px"
      );
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    };

    function handleDragEnd(e: DragEvent) {
      e.preventDefault();
      if (
        thumbRef.current.getAttribute("data-drag-state") ===
        DRAGGING_STATES.DRAGGING
      ) {
        thumbRef.current.setAttribute("data-drag-state", "");
        const side =
          e.clientX > window.innerWidth / 2
            ? STICK_SIDE_STATES.RIGHT
            : STICK_SIDE_STATES.LEFT;
        thumbRef.current.setAttribute("data-side", side);
        if (side === STICK_SIDE_STATES.LEFT) {
          thumbRef.current.style.left = "0px";
        } else {
          thumbRef.current.style.left = "calc(100% - var(--thumb-width))";
        }
        thumbRef.current.setAttribute("data-drag-start-y", "");
        thumbRef.current.setAttribute("data-drag-start-x", "");
      }
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    }

    thumbRef.current.addEventListener("mousedown", handleDragStart);
    return () => {
      thumbRef.current.removeEventListener("mousedown", handleDragStart);
    };
  }, []);

  return (
    <div
      ref={thumbRef}
      className="thumb group"
      data-state={open ? "hidden" : "show"}
    >
      <span
        className="invisible group-hover:visible bg-black/40 hover:bg-black/60 z-10"
        style={{
          top: "-4px",
          left: "-4px",
          position: "absolute",
          height: 16,
          width: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "50%",
          color: "white",
          transition: "background-color 0.2s ease-in-out",
        }}
        onClick={() => {
          deleteReactRoot();
        }}
      >
        <X size={12} />
      </span>
      <div
        role="button"
        className="thumb-item hover:text-background hover:bg-primary-400 dark:hover:bg-primary"
        onMouseUp={() => {
          // console.log("mouse up thumb button", {
          //   state: thumbRef.current.getAttribute("data-drag-state"),
          //   startY: thumbRef.current.getAttribute("data-drag-start-y"),
          //   thumbOffsetTop: thumbRef.current.offsetTop + "px",
          // });
          if (
            thumbRef.current.getAttribute("data-drag-start-y") !==
            thumbRef.current.offsetTop + "px"
          ) {
            return;
          }
          setOpen((p) => !p);
        }}
      >
        {refreshing ? (
          <SpinnerIcon size={20} />
        ) : (
          <BsClockHistory
            className=""
            style={{
              width: "20px",
              height: "20px",
            }}
          />
          // <Logo
          //   style={{
          //     width: "28px",
          //     height: "28px",
          //   }}
          // />
        )}
      </div>
    </div>
  );
}
