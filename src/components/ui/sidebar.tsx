"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

// Create a context for the sidebar state
const SidebarContext = createContext({
  collapsed: false,
  toggleCollapse: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, ...props }) {
  const { collapsed } = useSidebar();
  return (
    <div
      className={cn(
        "border-r bg-muted/40 h-screen transition-width duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6", className)}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }) {
  return (
    <div
      className={cn("flex-1 overflow-auto", className)}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }) {
  return (
    <div
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-auto p-4", className)}
      {...props}
    />
  );
}

export function SidebarTrigger({ className, ...props }) {
  const { toggleCollapse } = useSidebar();
  return (
    <button
      onClick={toggleCollapse}
      className={cn("p-2 rounded-md hover:bg-accent", className)}
      {...props}
    >
      ☰
    </button>
  );
}
