import { cn } from "@src/lib/utils";
import React, { useRef, useEffect } from "react";

export default function CustomDialog({
  duration,
  closedXOffset = "0px",
  closedYOffset = "0px",
  openXOffset = "0px",
  openYOffset = "0px",
  open,
  children,
  className,
  style = {},
  ...props
}: {
  duration: number;
  closedXOffset?: string;
  closedYOffset?: string;
  openXOffset?: string;
  openYOffset?: string;
  open: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"div">) {
  const initRef = useRef<boolean>(true);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initRef.current) {
      initRef.current = false;
      return;
    }
    if (dialogRef.current) {
      if (!open) {
        dialogRef.current.setAttribute("data-state", "closed");
        setTimeout(() => {
          dialogRef.current.setAttribute("data-state", "");
        }, duration);
      } else {
        dialogRef.current.setAttribute("data-state", "open");
      }
    }
  }, [open]);

  return (
    <div
      ref={dialogRef}
      className={cn("custom-dialog", className)}
      style={
        {
          "--duration": duration + "ms",
          "--closed-x-offset": closedXOffset,
          "--closed-y-offset": closedYOffset,
          "--open-x-offset": openXOffset,
          "--open-y-offset": openYOffset,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
