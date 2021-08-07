import React from "react";

export function Tabs({
  tabs,
}: {
  tabs: {
    label: string | React.ReactNode;
    content: React.ReactNode;
  }[];
}) {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <div>
      <div className="flex gap-2">
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={index}
            onClick={() => setActiveTab(index)}
            data-active={index === activeTab ? "true" : "false"}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={i}
          className="pure-tabs-content"
          data-active={i === activeTab ? "true" : "false"}
        >
          {tabs[activeTab].content}
        </div>
      ))}
    </div>
  );
}

export function TabsTrigger({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[hsl(var(--background))] data-[state=active]:text-foreground data-[state=active]:shadow-sm pure-tabs-trigger"
      {...props}
    >
      {children}
    </button>
  );
}
