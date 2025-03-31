"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mobile menu toggle button that appears at the top on small screens
function MobileSidebarToggle() {
  const { toggleMobileSidebar } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden fixed top-4 left-4 z-50 bg-gray-800/80 text-white border border-gray-700"
      onClick={toggleMobileSidebar}
    >
      <MenuIcon size={18} />
    </Button>
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/signin');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-900 overflow-hidden w-full max-w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen relative w-full">
          <MobileSidebarToggle />
          <main className="flex-1 p-4 md:p-6 bg-gray-900 text-white pt-16 md:pt-6 overflow-y-auto overflow-x-hidden w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
