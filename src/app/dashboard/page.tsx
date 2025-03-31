"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, subDays, addDays } from "date-fns";
import { 
  Check, 
  Clock, 
  Calendar as CalendarIcon,
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  Ban,
  CheckCircle2,
  Bell,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

// ShadCN UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// Example data - you can replace with actual data from your backend
const attendanceData = {
  offDaysLeft: 4,
  attendancePercentage: 64,
  attendedHours: 165,
  conductedHours: 240
};

// Example to-do items
const initialTodos = [
  { id: 1, text: "Complete project documentation", deadline: "Aug 25", completed: false },
  { id: 2, text: "Review pull requests", deadline: "Aug 22", completed: true },
  { id: 3, text: "Attend team meeting", deadline: "Today", completed: false },
];

// Example projects data
const projects = [
  { id: 1, name: "Web Development", progress: 75, status: "In Progress", dueDate: "Oct 15, 2023" },
  { id: 2, name: "Mobile App", progress: 45, status: "In Progress", dueDate: "Nov 20, 2023" },
  { id: 3, name: "Database Migration", progress: 90, status: "Almost Complete", dueDate: "Oct 5, 2023" }
];

// Animation variants for elements
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    // Get time of day for personalized greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // If no user is logged in, redirect to signin
        router.replace('/signin');
      } else {
        setUserName(user.displayName?.split(' ')[0] || '');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const toggleTodoCompletion = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTodo,
        deadline: "Soon",
        completed: false
      };
      setTodos([...todos, newTask]);
      setNewTodo("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111827]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-4 border-b-4 border-purple-300 animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 rounded-full border-t-4 border-b-4 border-purple-200 animate-spin animation-delay-300"></div>
          </div>
          <p className="mt-6 text-purple-300 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#111827] font-['Inter',sans-serif] text-gray-100">
        {/* Header Section */}
        <motion.header 
          className="p-6 flex justify-between items-center border-b border-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">DASHBOARD</h1>
            <p className="text-sm text-gray-400 mt-1">All your tracking in one place</p>
          </div>
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm md:text-base text-gray-300 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700">
              Hey <span className="text-purple-400 font-medium">{userName}</span>! {greeting}
            </p>
          </motion.div>
        </motion.header>
        
        <div className="max-w-[1440px] mx-auto p-4 md:p-8">
          {/* Attendance Overview Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Percentage Card - Now First (Left) Position */}
            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl overflow-hidden h-full">
                <div className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
                  
                  <div className="relative w-32 h-32 mb-2">
                    {/* Circle progress bar */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="64" cy="64" r="56" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="transparent"
                        className="text-gray-800"
                      />
                      {/* Animated progress circle */}
                      <motion.circle 
                        cx="64" cy="64" r="56" 
                        stroke="url(#blue-purple-gradient)" 
                        strokeWidth="8" 
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 56}
                        strokeDashoffset={2 * Math.PI * 56 * (1 - attendanceData.attendancePercentage / 100)}
                        initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - attendanceData.attendancePercentage / 100) }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="blue-purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Percentage text in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span 
                        className="text-3xl font-bold text-white"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        {attendanceData.attendancePercentage}%
                      </motion.span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-base">Attendance Percentage</p>
                </div>
              </Card>
            </motion.div>
            
            {/* Off Days Card - Now Second Position */}
            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl overflow-hidden h-full">
                <div className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                  
                  <div className="p-3 rounded-full bg-gray-800/80 border border-gray-700 mb-4 backdrop-blur-sm">
                    <Ban className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-gray-400 text-lg mb-2">Off days left</p>
                  <div className="flex items-end">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                      {attendanceData.offDaysLeft}
                    </h2>
                    <span className="text-lg text-gray-400 ml-2 mb-1">Days</span>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Hours Card - Now Third Position */}
            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl overflow-hidden h-full">
                <div className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                  
                  <div className="p-3 rounded-full bg-gray-800/80 border border-gray-700 mb-4 backdrop-blur-sm">
                    <Clock className="h-8 w-8 text-blue-400" />
                  </div>
                  
                  <div className="text-center mb-4 w-full">
                    <div className="flex items-center justify-center mb-1">
                      <h2 className="text-3xl font-bold text-white">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {attendanceData.attendedHours}
                        </motion.span>
                        <span className="text-gray-500">/</span>
                        {attendanceData.conductedHours}
                      </h2>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Attended hours</span>
                      <span>Conducted hours</span>
                    </div>
                  </div>
                  <Progress 
                    value={(attendanceData.attendedHours / attendanceData.conductedHours) * 100} 
                    className={cn("h-2 bg-gray-800", "after:bg-gradient-to-r after:from-blue-500 after:to-purple-500")}
                  />
                </div>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* To-do List Section */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gray-900/80 border-gray-800 shadow-xl h-full backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">TO-DO LIST</CardTitle>
                    <Badge className="bg-gray-800 text-gray-400 border border-gray-700">
                      {todos.filter(t => t.completed).length}/{todos.length}
                    </Badge>
                  </div>
                  
                  {/* Add task input */}
                  <div className="flex mb-6 relative group">
                    <input
                      type="text"
                      placeholder="Add new task..."
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 p-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 placeholder-gray-500"
                    />
                    <Button 
                      onClick={addTodo}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-1.5 rounded-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                      disabled={!newTodo.trim()}
                      size="icon"
                    >
                      <Plus size={18} className={!newTodo.trim() ? "opacity-50" : "opacity-100"} />
                    </Button>
                  </div>
                  
                  {/* Todo items list */}
                  <motion.div 
                    className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {todos.length > 0 ? (
                      todos.map((todo) => (
                        <motion.div 
                          key={todo.id} 
                          className="flex items-center justify-between p-3 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-colors group"
                          variants={fadeIn}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                          <div className="flex items-center">
                            <motion.div 
                              onClick={() => toggleTodoCompletion(todo.id)}
                              className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer mr-3 transition-all duration-300 ${
                                todo.completed 
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-transparent' 
                                  : 'border-gray-600 hover:border-gray-400'
                              }`}
                              whileTap={{ scale: 0.9 }}
                            >
                              {todo.completed && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                  <Check size={12} color="white" />
                                </motion.div>
                              )}
                            </motion.div>
                            <span className={`transition-all duration-200 ${
                              todo.completed 
                                ? 'line-through text-gray-500' 
                                : 'text-gray-200'
                            }`}>
                              {todo.text}
                            </span>
                          </div>
                          <Badge className={`text-xs ${
                            todo.deadline === "Today" 
                              ? "bg-purple-900/30 text-purple-300 border border-purple-500/30" 
                              : "bg-gray-800 text-gray-400 border border-gray-700"
                          }`}>
                            {todo.deadline}
                          </Badge>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500 italic">
                        <p>No tasks yet</p>
                        <p className="text-sm mt-1">Add some tasks to start tracking</p>
                      </div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Calendar Section - Using ShadCN Calendar */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gray-900/80 border-gray-800 shadow-xl h-full backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                      CALENDAR
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="text-gray-400 border-gray-700 flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-sm">
                            <CalendarIcon className="h-4 w-4 text-purple-400" />
                            <span className="truncate max-w-[120px]">
                              {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="bg-gray-900 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Track your schedule and events
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="rounded-lg border border-gray-800">
                    <div className="flex justify-between items-center p-4 bg-gray-800/50">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={prevMonth}
                        className="h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="text-base md:text-lg font-medium">
                        {format(currentMonth, 'MMMM yyyy')}
                      </h3>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={nextMonth}
                        className="h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-7 text-center text-xs md:text-sm bg-gray-800/30">
                      {[
                        {id: 'mon', label: 'M'}, 
                        {id: 'tue', label: 'T'}, 
                        {id: 'wed', label: 'W'}, 
                        {id: 'thu', label: 'T'}, 
                        {id: 'fri', label: 'F'}, 
                        {id: 'sat', label: 'S'}, 
                        {id: 'sun', label: 'S'}
                      ].map((day) => (
                        <div key={day.id} className="py-2 text-gray-400 font-medium border-b border-gray-800">
                          {day.label}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-900/20">
                      {generateCalendarDays(currentMonth).map((week, i) => (
                        <div key={i} className="grid grid-cols-7">
                          {week.map((day, j) => (
                            <Tooltip key={`${i}-${j}`}>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`
                                    h-12 md:h-14 p-1 border border-gray-800 relative
                                    transition-colors
                                    ${!isSameMonth(day, currentMonth) ? 'text-gray-600' : ''}
                                    ${isToday(day) ? 'bg-purple-900/20' : 'hover:bg-gray-800/50'}
                                  `}
                                >
                                  <span className={`
                                    absolute top-1 right-1 text-xs
                                    ${isToday(day) ? 'bg-purple-500 text-white w-5 h-5 flex items-center justify-center rounded-full' : ''}
                                  `}>
                                    {day.getDate()}
                                  </span>
                                  
                                  {isEventDay(day) && (
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 border-gray-700 text-sm">
                                {format(day, 'EEE, MMM d')}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Daily Summary - visible on all screens */}
                  <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 p-3 rounded-lg flex items-center border border-gray-700">
                      <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                        <Clock className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Hours</p>
                        <p className="font-medium text-white">4.5 hrs</p>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg flex items-center border border-gray-700">
                      <div className="bg-purple-900/30 p-2 rounded-lg mr-3">
                        <Bell className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Events</p>
                        <p className="font-medium text-white">2 today</p>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg flex items-center border border-gray-700">
                      <div className="bg-teal-900/30 p-2 rounded-lg mr-3">
                        <CheckCircle2 className="h-4 w-4 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Tasks</p>
                        <p className="font-medium text-white">3 completed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Projects Table */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gray-900/80 border-gray-800 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                    PROJECTS
                  </CardTitle>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 flex items-center gap-1">
                    <Plus size={16} />
                    New Project
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Track your project progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border border-gray-800">
                  <Table>
                    <TableHeader className="bg-gray-800/50">
                      <TableRow className="hover:bg-gray-800/70 border-gray-800">
                        <TableHead className="text-gray-400 font-medium">Project</TableHead>
                        <TableHead className="text-gray-400 font-medium">Progress</TableHead>
                        <TableHead className="text-gray-400 font-medium">Status</TableHead>
                        <TableHead className="text-gray-400 font-medium">Due Date</TableHead>
                        <TableHead className="text-gray-400 font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id} className="hover:bg-gray-800/30 border-gray-800">
                          <TableCell className="font-medium text-gray-200">{project.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <Progress
                                  value={project.progress}
                                  className={cn(
                                    "h-2 bg-gray-800",
                                    project.progress > 70 ? "after:bg-emerald-500" :
                                    project.progress > 40 ? "after:bg-yellow-500" : "after:bg-red-500"
                                  )}
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-9">
                                {project.progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              project.status === "Almost Complete" 
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : project.status === "In Progress"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            }>
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">{project.dueDate}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="h-7 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
        
        @keyframes spin {
          to {transform: rotate(360deg);}
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </TooltipProvider>
  );
}

// Helper function to create calendar days
function generateCalendarDays(date: Date) {
  const firstDay = startOfMonth(date);
  const lastDay = endOfMonth(date);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  // Adjust the days array to start on Monday
  const dayOfWeek = firstDay.getDay(); 
  const start = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday (0) to 6, others to day-1
  
  // Add days from previous month to fill the first week
  const prevMonthDays = start > 0 
    ? Array(start).fill(null).map((_, i) => subDays(firstDay, start - i))
    : [];
  
  // Add days from next month to complete the last week
  const totalDaysToShow = Math.ceil((days.length + prevMonthDays.length) / 7) * 7;
  const nextMonthDays = totalDaysToShow - (days.length + prevMonthDays.length);
  const nextMonth = Array(nextMonthDays).fill(null).map((_, i) => 
    addDays(lastDay, i + 1)
  );
  
  // Combine all days and split into weeks
  const allDays = [...prevMonthDays, ...days, ...nextMonth];
  const weeks = [];
  
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  
  return weeks;
}

// Helper to check if a day has events
function isEventDay(date: Date): boolean {
  // Example: Return true for specific dates (replace with your event logic)
  return date.getDate() === 15 || date.getDate() === 22;
}