"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { setupTokenRefresh } from "@/lib/auth";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";

// Mobile menu toggle button that appears at the top on small screens
function MobileSidebarToggle() {
  const { toggleMobileSidebar } = useSidebar();
  
  return (
    <div className="lg:hidden w-full bg-gray-800/95 backdrop-blur fixed top-0 z-30 p-3 flex items-center border-b border-gray-700/50">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleMobileSidebar} 
        className="text-gray-400 hover:text-white"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>
      <span className="ml-3 font-medium text-gray-200">Trackasaurus</span>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/signin');
      } else {
        // Set up token refresh for the authenticated user
        const cleanupRefresh = setupTokenRefresh(user);
        setLoading(false);
        
        // Clean up the refresh interval when component unmounts
        return () => {
          cleanupRefresh();
        };
      }
    });

    // Clean up the auth listener when component unmounts
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
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen bg-gray-900 overflow-hidden w-full max-w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-h-screen relative w-full">
              <MobileSidebarToggle />
              <main className="flex-1 pt-16 lg:pt-0 p-4 md:p-6 lg:p-8 w-full max-w-full">
                {children}
              </main>
            </div>
            <Toaster position="top-right" />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
