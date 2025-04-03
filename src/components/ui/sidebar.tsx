"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Create a context for the sidebar state
const SidebarContext = createContext({
  collapsed: false,
  mobile: false,
  mobileOpen: false,
  toggleCollapse: () => {},
  toggleMobileSidebar: () => {}
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  
  // Check if we're on mobile based on window width
  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false); // Close mobile drawer when resizing to desktop
      }
    };
    
    // Initialize
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <SidebarContext.Provider value={{ 
      collapsed, 
      mobile, 
      mobileOpen, 
      toggleCollapse, 
      toggleMobileSidebar 
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, ...props }) {
  const { collapsed, mobile, mobileOpen } = useSidebar();
  
  return (
    <>
      {/* Mobile overlay for when sidebar is open */}
      {mobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20"
          onClick={() => useSidebar().toggleMobileSidebar()}
        />
      )}
      
      <div
        className={cn(
          "bg-gray-900 h-screen transition-all duration-300 ease-in-out border-r border-gray-800",
          // Mobile styles
          mobile ? "fixed top-0 bottom-0 left-0 z-30" : "",
          mobile && mobileOpen ? "translate-x-0" : mobile && !mobileOpen ? "-translate-x-full" : "",
          // Desktop styles
          !mobile && collapsed ? "w-16" : !mobile ? "w-64" : "w-[280px]",
          className
        )}
        {...props}
      />
    </>
  );
}

export function SidebarHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex h-14 items-center px-4 lg:h-[60px] lg:px-6", className)}
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

export function SidebarTrigger({ className, children, ...props }) {
  const { toggleCollapse, mobile, toggleMobileSidebar } = useSidebar();
  
  return (
    <button
      onClick={mobile ? toggleMobileSidebar : toggleCollapse}
      className={cn("p-2 rounded-md hover:bg-accent", className)}
      {...props}
    >
      {children || "☰"}
    </button>
  );
}

// Correct usage
const SidebarComponent = () => {
  const sidebar = useSidebar(); // Move hook to component level
  
  return (
    <button onClick={() => {
      // Use sidebar value here instead of calling the hook
      sidebar.toggleCollapse();
    }}>
      Toggle
    </button>
  );
};
