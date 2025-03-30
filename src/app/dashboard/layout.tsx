"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
        <AppSidebar />
        <div className="flex flex-col">
          <main className="flex-1 p-6 bg-gray-900 text-white">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
