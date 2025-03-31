"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOutUser } from "@/lib/auth";
import {
  Home,
  Calendar,
  ClipboardList,
  CheckSquare,
  ChevronRight,
  MenuIcon,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { collapsed, mobile, mobileOpen } = useSidebar();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhotoURL, setUserPhotoURL] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || 'User');
        setUserEmail(user.email || '');
        setUserPhotoURL(user.photoURL || '');
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/signin');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Sidebar className="fixed md:relative z-30 transition-all duration-300 ease-in-out">
      <SidebarHeader className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6 border-b border-gray-800">
        <div className="flex items-center gap-2 font-semibold overflow-hidden">
          <div className="h-6 w-6 flex-shrink-0 rounded-md bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">T</div>
          <span className={cn("transition-opacity duration-300", 
            collapsed ? "opacity-0 hidden" : "opacity-100")}>
            Tracko
          </span>
        </div>
        
        <SidebarTrigger className="ml-auto h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
          {collapsed ? <ChevronRight size={18} /> : <MenuIcon size={18} />}
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <nav className="space-y-1.5">
          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 bg-blue-900/20 transition-all hover:text-white hover:bg-blue-900/30"
          >
            <Home className="h-4 w-4 text-blue-400 flex-shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </Link>
          
          {/* Attendance Link */}
          <Link
            href="#"
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800/60"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Attendance</span>}
            </div>
            {!collapsed && (
              <span className="inline-flex h-5 items-center justify-center rounded-full bg-purple-900/40 px-2 text-xs font-medium text-purple-300 border border-purple-700/30">
                Today
              </span>
            )}
          </Link>
          
          {/* Deadlines Link */}
          <Link
            href="#"
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800/60"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Deadlines</span>}
            </div>
            {!collapsed && (
              <span className="inline-flex h-5 items-center justify-center rounded-full bg-blue-900/40 px-2 text-xs font-medium text-blue-300 border border-blue-700/30">
                3
              </span>
            )}
          </Link>
          
          {/* Tasks Link */}
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800/60"
          >
            <CheckSquare className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Tasks</span>}
          </Link>
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto p-4 border-t border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={cn(
              "flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-800 transition-colors",
              collapsed ? "justify-center" : "justify-between"
            )}>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-gray-700">
                  {userPhotoURL ? (
                    <AvatarImage src={userPhotoURL} alt={userName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-purple-700 to-blue-700 text-white">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-200">{userName}</span>
                    <span className="text-xs text-gray-400 truncate max-w-[140px]">{userEmail}</span>
                  </div>
                )}
              </div>
              
              {!collapsed && <ChevronRight size={16} className="text-gray-400" />}
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700 text-gray-200">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
              onClick={() => router.push('/settings')}
            >
              <Settings size={16} className="text-gray-400" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <>
                  <Sun size={16} className="text-gray-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={16} className="text-gray-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-400 cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
