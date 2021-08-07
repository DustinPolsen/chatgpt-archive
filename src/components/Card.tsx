import { cn } from "@src/lib/utils";
import React from "react";

export const CardContainer = React.memo(function CardContainer({
  icon,
  children,
  props = {
    container: {},
  },
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  props?: {
    container: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > & { [key: `data-${string}`]: string };
  };
}) {
  const { className: containerClassName = "", ...containerProps } =
    props.container;
  return (
    <div
      className={"card " + containerClassName}
      {...containerProps}
      data-state="fi"
    >
      <div className="card-icon">{icon}</div>
      {children}
    </div>
  );
});

export function CardContent({
  className = "",
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("card-content", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...titleProps
}: {
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={"card-title " + className} {...titleProps}>
      {children}
    </div>
  );
}

export function CardDescription({
  children,
  className = "",
  ...descriptionProps
}: {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={"card-description " + className} {...descriptionProps}>
      {children}
    </div>
  );
}

export function CardRightOptions({
  hoverShow = true,
  children,
  className = "",
  ...props
}: {
  hoverShow?: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        `card-right-container`,
        hoverShow && "card-hover-show",
        className
      )}
      {...props}
    >
      <div className="card-right-before"></div>
      <div className="card-right">{children}</div>
    </div>
  );
}
