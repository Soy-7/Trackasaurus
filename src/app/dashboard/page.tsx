"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrashIcon, 
  CheckIcon, 
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay, isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

// Helper functions for attendance calculations
const getCurrentMonthAttendedHours = (attendanceRecords) => {
  if (!attendanceRecords || !Array.isArray(attendanceRecords)) return 0;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return attendanceRecords
    .filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear;
    })
    .reduce((total, record) => total + Number(record.attendedHours), 0);
};

const getCurrentMonthConductedHours = (attendanceRecords) => {
  if (!attendanceRecords || !Array.isArray(attendanceRecords)) return 0;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return attendanceRecords
    .filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear;
    })
    .reduce((total, record) => total + Number(record.conductedHours), 0);
};

const getCurrentMonthAttendancePercentage = (attendanceRecords) => {
  const attended = getCurrentMonthAttendedHours(attendanceRecords);
  const conducted = getCurrentMonthConductedHours(attendanceRecords);
  
  return conducted > 0 ? Math.round((attended / conducted) * 100) : 0;
};

export default function Dashboard() {
  const {
    user,
    tasks,
    attendance,
    profile,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    addAttendance,
    deleteAttendanceRecord,
  } = useFirestore();

  const [newTask, setNewTask] = useState({ text: "", dueDate: "" });
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split("T")[0],
    attendedHours: "",
    conductedHours: "",
  });
  const [attendanceError, setAttendanceError] = useState('');
  const [date, setDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calendar navigation functions
  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  // Generate calendar days
  const generateCalendarDays = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7; // Adjust for Monday start (0 becomes 7)
    startDay--; // Convert to 0-indexed for Monday start

    const totalDays = lastDay.getDate();
    const weeks = Math.ceil((totalDays + startDay) / 7);
    const calendar = [];

    let dayCounter = 1;
    const prevMonth = new Date(year, monthIndex, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = 0; i < weeks; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          // Previous month days
          const day = prevMonthDays - (startDay - j) + 1;
          week.push(new Date(year, monthIndex - 1, day));
        } else if (dayCounter > totalDays) {
          // Next month days
          week.push(new Date(year, monthIndex + 1, dayCounter - totalDays));
          dayCounter++;
        } else {
          // Current month days
          week.push(new Date(year, monthIndex, dayCounter));
          dayCounter++;
        }
      }
      calendar.push(week);
    }

    return calendar;
  };

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  // Check if a day has an event (task or attendance)
  const isEventDay = (day) => {
    // Check if there's a task due on this day
    const hasTask = tasks && tasks.some(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), day)
    );
    
    // Check if there's an attendance record for this day
    const hasAttendance = attendance && attendance.some(record => 
      record.date && isSameDay(new Date(record.date), day)
    );
    
    return hasTask || hasAttendance;
  };

  // Generate day content with indicators
  const generateDayContent = (day) => {
    // Safe checks since your data might be loading
    const tasksDue = tasks && Array.isArray(tasks) ? tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), day)
    ) : [];
    
    const dayAttendance = attendance && Array.isArray(attendance) ? attendance.find(record => 
      record.date && isSameDay(new Date(record.date), day)
    ) : null;
    
    const hasTask = tasksDue.length > 0;
    
    return (
      <>
        {hasTask && (
          <div className="absolute bottom-1 right-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          </div>
        )}
        
        {dayAttendance && (
          <div className="absolute bottom-1 left-1">
            <div 
              className={`w-1.5 h-1.5 rounded-full 
                ${Number(dayAttendance.attendedHours) >= Number(dayAttendance.conductedHours) 
                  ? 'bg-green-500' : 'bg-yellow-500'}`}
            />
          </div>
        )}
      </>
    );
  };

  const hasTodayAttendance = () => {
    const today = new Date();
    return attendance && attendance.some(record => 
      record.date && isSameDay(new Date(record.date), today)
    );
  };

  // Add loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handler for adding new task
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTask(newTask);
      setNewTask({ text: "", dueDate: "" });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // Handler for adding attendance record
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    
    // First validate the hours
    const attendedHours = parseFloat(attendanceData.attendedHours);
    const conductedHours = parseFloat(attendanceData.conductedHours);
    
    if (attendedHours > conductedHours) {
      setAttendanceError('Attended hours cannot exceed conducted hours');
      return;
    }
    
    setAttendanceError('');
    
    try {
      await addAttendance(attendanceData);
      toast.success("Attendance recorded successfully!", {
        icon: "✅",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid rgba(74, 222, 128, 0.2)"
        }
      });
      setAttendanceData({
        date: new Date().toISOString().split("T")[0],
        attendedHours: "",
        conductedHours: "",
      });
    } catch (error) {
      toast.error("Failed to add attendance");
      console.error("Failed to add attendance:", error);
    }
  };

  const handleAttendedHoursChange = (e) => {
    const attendedHours = e.target.value;
    const conductedHours = attendanceData.conductedHours;
    
    setAttendanceData({...attendanceData, attendedHours});
    
    // Validate only if both fields have values
    if (attendedHours && conductedHours) {
      if (parseFloat(attendedHours) > parseFloat(conductedHours)) {
        setAttendanceError('Attended hours cannot exceed conducted hours');
      } else {
        setAttendanceError('');
      }
    }
  };

  return (
    <main className="p-6 bg-gray-900 text-white">
      {/* Add this attendance confirmation banner */}
      {hasTodayAttendance() && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center"
        >
          <div className="bg-green-500/20 p-2 rounded-full mr-3">
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">Attendance Marked Successfully!</p>
            <p className="text-sm text-gray-300">You've already recorded your attendance for today.</p>
          </div>
          {/* Optional: Add a way to view today's record */}
          <button 
            onClick={() => setDate(new Date())} 
            className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 py-1 px-3 rounded-md ml-4 transition-colors"
          >
            View Details
          </button>
        </motion.div>
      )}
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Attendance Percentage Circle Card */}
        <motion.div className="lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gray-900/80 border-gray-800 shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                ATTENDANCE SCORE
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your overall attendance performance
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="relative w-48 h-48 mb-4">
                {/* Circular background */}
                <div className="absolute inset-0 rounded-full bg-gray-800"></div>
                
                {/* Progress circle - this creates the circular progress */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50" 
                    cy="50" 
                    r="40"
                    fill="transparent"
                    stroke="#1F2937"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50" 
                    cy="50" 
                    r="40"
                    fill="transparent"
                    stroke="url(#gradient)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (profile?.attendancePercentage || 0) / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{profile?.attendancePercentage || 0}%</span>
                  <span className="text-sm text-gray-400">Attendance</span>
                </div>
              </div>
              
              {/* Details */}
              <div className="w-full grid grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex flex-col items-center">
                  <p className="text-xs text-gray-400">Attended</p>
                  <p className="text-xl font-medium">{profile?.totalAttendedHours || 0} hrs</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex flex-col items-center">
                  <p className="text-xs text-gray-400">Conducted</p>
                  <p className="text-xl font-medium">{profile?.totalConductedHours || 0} hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Form Component */}
        <motion.div className="lg:col-span-4">
          <Card className="bg-gray-900/80 border-gray-800 shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                ADD ATTENDANCE
              </CardTitle>
              <CardDescription className="text-gray-400">
                Record your daily attendance
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Date</label>
                  <input
                    type="date"
                    value={attendanceData.date}
                    onChange={(e) => setAttendanceData({...attendanceData, date: e.target.value})}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-500" />
                      Hours Attended
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0"
                        value={attendanceData.attendedHours}
                        onChange={handleAttendedHoursChange}
                        className={`w-full p-2 pl-3 bg-gray-800 border rounded text-white transition-all duration-200
                          ${attendanceError 
                            ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' 
                            : 'border-gray-700'}`} 
                        min="0"
                        step="1"
                        required
                      />
                      {attendanceError && (
                        <motion.div 
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </motion.div>
                      )}
                      {attendanceData.attendedHours && attendanceData.conductedHours && 
                      parseFloat(attendanceData.attendedHours) <= parseFloat(attendanceData.conductedHours) && (
                        <motion.div 
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1/2 right-2 -translate-y-1/2 text-green-500"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-500" />
                      Hours Conducted
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0"
                        value={attendanceData.conductedHours}
                        onChange={(e) => {
                          const conductedHours = e.target.value;
                          setAttendanceData({...attendanceData, conductedHours});
                          
                          if (attendanceData.attendedHours && conductedHours) {
                            if (parseFloat(attendanceData.attendedHours) > parseFloat(conductedHours)) {
                              setAttendanceError('Attended hours cannot exceed conducted hours');
                            } else {
                              setAttendanceError('');
                            }
                          }
                        }}
                        className={`w-full p-2 pl-3 bg-gray-800 border rounded text-white transition-all duration-200
                          ${attendanceError 
                            ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' 
                            : 'border-gray-700'}`}
                        min="0"
                        step="1"
                        required
                      />
                      {attendanceError && (
                        <motion.div 
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </motion.div>
                      )}
                      {attendanceData.attendedHours && attendanceData.conductedHours && 
                      parseFloat(attendanceData.attendedHours) <= parseFloat(attendanceData.conductedHours) && (
                        <motion.div 
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1/2 right-2 -translate-y-1/2 text-green-500"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {attendanceError && (
                    <motion.div 
                      className="bg-red-900/20 border border-red-500/30 rounded-md p-2 flex items-start gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-200">{attendanceError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button
                  type="submit"
                  className={`w-full p-2 rounded mt-3 transition-all duration-300
                    ${attendanceError 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/20'}`}
                  disabled={!!attendanceError}
                >
                  {attendanceError ? 'Fix Errors to Continue' : 'Add Attendance Record'}
                </button>
              </form>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Current Month Statistics</p>
                  <p className="text-sm font-medium">
                    {getCurrentMonthAttendancePercentage(attendance || [])}%
                  </p>
                </div>
                <Progress 
                  value={getCurrentMonthAttendancePercentage(attendance || [])} 
                  className="h-2 bg-gray-800 mt-2" 
                />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Month Attended</p>
                    <p className="text-lg font-medium">{getCurrentMonthAttendedHours(attendance || [])}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Month Conducted</p>
                    <p className="text-lg font-medium">{getCurrentMonthConductedHours(attendance || [])}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Task Component - Fix Date Input Overflow */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gray-900/80 border-gray-800 shadow-xl h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                  TASKS
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              {/* Add Task Form - FIXED LAYOUT */}
              <form onSubmit={handleTaskSubmit} className="mb-4">
                {/* Changed from flex to grid for better control */}
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="New task..."
                    value={newTask.text}
                    onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                  
                  {/* Date picker with proper sizing */}
                  <div className="relative">
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded"
                >
                  Add Task
                </button>
              </form>

              {/* Task List - Updated with overflow handling */}
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {tasks && tasks.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No tasks yet</div>
                ) : (
                  tasks && tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-3"
                    >
                      <div
                        className={`min-w-[20px] h-5 w-5 rounded border ${
                          task.completed
                            ? "bg-blue-500 border-blue-600"
                            : "border-gray-600"
                        } 
                        flex items-center justify-center cursor-pointer`}
                        onClick={() => toggleTask(task.id, !task.completed)}
                      >
                        {task.completed && <CheckIcon className="w-3 h-3 text-white" />}
                      </div>
                      
                      <div className="flex-1 min-w-0"> {/* This ensures text truncation works */}
                        <p className={`${task.completed ? 'line-through text-gray-500' : 'text-white'} truncate`}>
                          {task.text}
                        </p>
                        {task.dueDate && (
                          <p className="text-xs text-gray-400 truncate">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => deleteTask(task.id)} 
                        className="text-gray-500 hover:text-red-400 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar Section - Using ShadCN Calendar with improved sizing */}
        <motion.div 
          className="lg:col-span-8 col-span-12"
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
            
            {/* Improved calendar container with better sizing */}
            <CardContent className="p-0">
              <div className="rounded-lg border border-gray-800">
                {/* Calendar Header */}
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-800/50">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      const prevMonth = new Date(currentMonth);
                      prevMonth.setMonth(prevMonth.getMonth() - 1);
                      setCurrentMonth(prevMonth);
                    }}
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
                    onClick={() => {
                      const nextMonth = new Date(currentMonth);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setCurrentMonth(nextMonth);
                    }}
                    className="h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Day names header */}
                <div className="grid grid-cols-7 text-center bg-gray-800/30">
                  {[
                    {id: 'mon', label: 'M'}, 
                    {id: 'tue', label: 'T'}, 
                    {id: 'wed', label: 'W'}, 
                    {id: 'thu', label: 'Th'}, 
                    {id: 'fri', label: 'F'}, 
                    {id: 'sat', label: 'S'}, 
                    {id: 'sun', label: 'Su'}
                  ].map((day) => (
                    <div key={day.id} className="py-2 text-gray-400 font-medium border-b border-gray-800">
                      {day.label}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid with better sizing */}
                <div className="bg-gray-900/20">
                  {generateCalendarDays(currentMonth).map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7">
                      {week.map((day, dayIndex) => {
                        const tasksDue = tasks && Array.isArray(tasks) ? tasks.filter(task => 
                          task.dueDate && isSameDay(new Date(task.dueDate), day)
                        ) : [];
                        
                        const dayAttendance = attendance && Array.isArray(attendance) ? attendance.find(record => 
                          record.date && isSameDay(new Date(record.date), day)
                        ) : null;
                        
                        const isToday = isSameDay(day, new Date());
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        
                        return (
                          <Tooltip key={`${weekIndex}-${dayIndex}`}>
                            <TooltipTrigger asChild>
                              <div 
                                onClick={() => setDate(day)}
                                className={`
                                  min-h-[40px] sm:min-h-[50px] md:min-h-[60px] p-1 sm:p-2 
                                  border border-gray-800 relative cursor-pointer
                                  ${!isCurrentMonth ? 'text-gray-600 bg-gray-900/40' : ''}
                                  ${isToday ? 'bg-purple-900/20' : 'hover:bg-gray-800/50'}
                                  ${isSameDay(day, date) ? 'bg-gray-700/50 border-purple-500' : ''}
                                `}
                              >
                                {/* Date number */}
                                <span className={`
                                  absolute top-1 right-1 text-sm font-medium
                                  ${isToday ? 'bg-purple-500 text-white h-6 w-6 flex items-center justify-center rounded-full' : ''}
                                `}>
                                  {format(day, 'd')}
                                </span>
                                
                                {/* Event indicators with better positioning */}
                                <div className="absolute bottom-1 left-1 flex space-x-1">
                                  {tasksDue.length > 0 && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  )}
                                  
                                  {dayAttendance && (
                                    <div 
                                      className={`h-2 w-2 rounded-full 
                                        ${Number(dayAttendance.attendedHours) >= Number(dayAttendance.conductedHours) 
                                          ? 'bg-green-500' : 'bg-yellow-500'}`}
                                    />
                                  )}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700 text-xs p-2 z-50">
                              <div className="font-medium">{format(day, 'EEE, MMM d')}</div>
                              
                              {tasksDue.length > 0 && (
                                <div className="text-blue-400 mt-1">{tasksDue.length} task{tasksDue.length !== 1 ? 's' : ''}</div>
                              )}
                              
                              {dayAttendance && (
                                <div className="text-green-400 mt-1">
                                  {dayAttendance.attendedHours}/{dayAttendance.conductedHours} hrs
                                </div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Selected Day Details - More compact design */}
              {date && (
                <div className="mt-3 p-3 border-t border-gray-800">
                  <h3 className="text-sm font-medium mb-2">
                    {format(date, "EEEE, MMMM d, yyyy")}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Attendance Record */}
                    <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                      <h4 className="text-xs font-medium mb-1.5">Attendance</h4>
                      
                      {(() => {
                        const dayAttendance = attendance && Array.isArray(attendance) ? 
                          attendance.find(record => record.date && isSameDay(new Date(record.date), date)) : null;
                        
                        if (dayAttendance) {
                          return (
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs text-gray-400">Attended</p>
                                <p className="text-sm font-medium">{dayAttendance.attendedHours} hrs</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Conducted</p>
                                <p className="text-sm font-medium">{dayAttendance.conductedHours} hrs</p>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <p className="text-gray-500 text-xs">No attendance record</p>
                          );
                        }
                      })()}
                    </div>
                    
                    {/* Tasks */}
                    <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                      <h4 className="text-xs font-medium mb-1.5">Tasks</h4>
                      
                      {(() => {
                        const dayTasks = tasks && Array.isArray(tasks) ? 
                          tasks.filter(task => task.dueDate && isSameDay(new Date(task.dueDate), date)) : [];
                        
                        if (dayTasks.length > 0) {
                          return (
                            <div className="space-y-1 max-h-16 overflow-y-auto pr-1">
                              {dayTasks.map(task => (
                                <div key={task.id} className="flex items-center text-xs">
                                  <div 
                                    className={`min-w-[8px] h-2 mr-1.5 rounded-full 
                                      ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                                  />
                                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                    {task.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <p className="text-gray-500 text-xs">No tasks due</p>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}