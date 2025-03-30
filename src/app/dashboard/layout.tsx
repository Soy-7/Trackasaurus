"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/signin');
      } else {
        setAuthenticated(true);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>;
  }

  if (!authenticated) return null;

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
