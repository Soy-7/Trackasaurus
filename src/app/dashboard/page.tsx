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
  CheckCircle,
  Edit,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay, isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase"; // your Firestore instance
import { doc, collection, getDocs, deleteDoc, setDoc } from "firebase/firestore";

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
    updateAttendance,
    deleteAttendanceRecord,
    checkAttendanceForDate
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
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);
  const [currentAttendanceId, setCurrentAttendanceId] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

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
          <div className="absolute bottom-1 left-1 flex items-center">
            <div 
              className={`h-2 w-2 rounded-full mr-0.5
                ${Number(dayAttendance.attendedHours) === 0 
                  ? 'bg-red-500' // Absent
                  : Number(dayAttendance.attendedHours) < Number(dayAttendance.conductedHours)
                    ? 'bg-yellow-500' // Partial
                    : 'bg-green-500'}`} // Full
            />
            <span className="text-[0.6rem] text-gray-400">
              {Math.round(dayAttendance.attendedHours)}/{Math.round(dayAttendance.conductedHours)}
            </span>
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

  // Handler for date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    
    // Check if attendance exists for this date
    const existingAttendance = checkAttendanceForDate(selectedDate);
    
    if (existingAttendance) {
      // Switch to edit mode and populate the form
      setIsEditingAttendance(true);
      setCurrentAttendanceId(existingAttendance.id);
      setAttendanceData({
        date: selectedDate,
        attendedHours: existingAttendance.attendedHours.toString(),
        conductedHours: existingAttendance.conductedHours.toString(),
      });
      toast("You are editing an existing attendance record", {
        icon: "📝",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid rgba(59, 130, 246, 0.2)"
        }
      });
    } else {
      // Reset to add mode
      setIsEditingAttendance(false);
      setCurrentAttendanceId(null);
      setAttendanceData({
        date: selectedDate,
        attendedHours: "",
        conductedHours: "",
      });
      setAttendanceError('');
    }
  };

  // Add this function to handle input focus
  const handleInputFocus = () => {
    // Don't do anything if already in edit mode
    if (isEditingAttendance) return;
    
    // Check if the currently selected date has an attendance record
    const existingRecord = checkAttendanceForDate(attendanceData.date);
    
    if (existingRecord) {
      // Switch to edit mode and populate form
      setIsEditingAttendance(true);
      setCurrentAttendanceId(existingRecord.id);
      setAttendanceData({
        date: attendanceData.date,
        attendedHours: existingRecord.attendedHours.toString(),
        conductedHours: existingRecord.conductedHours.toString(),
      });
      
      toast("Editing existing attendance record", {
        icon: "📝",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid rgba(245, 158, 11, 0.2)"
        }
      });
    }
  };

  // Handler for adding or updating attendance record
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    
    // Input validation
    const attendedHours = parseFloat(attendanceData.attendedHours);
    const conductedHours = parseFloat(attendanceData.conductedHours);
    
    // Basic validation
    if (isNaN(attendedHours) || isNaN(conductedHours)) {
      setAttendanceError('Please enter valid numbers');
      return;
    }
    
    if (attendedHours < 0 || conductedHours < 0) {
      setAttendanceError('Hours cannot be negative');
      return;
    }
    
    if (attendedHours > conductedHours) {
      setAttendanceError('Attended hours cannot exceed conducted hours');
      return;
    }
    
    setAttendanceError('');
    
    try {
      if (isEditingAttendance && currentAttendanceId) {
        // Update existing record
        await updateAttendance(currentAttendanceId, {
          date: attendanceData.date,
          attendedHours: parseFloat(attendanceData.attendedHours),
          conductedHours: parseFloat(attendanceData.conductedHours)
        });
        toast.success("Attendance updated successfully!", {
          icon: "✓",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid rgba(74, 222, 128, 0.2)"
          }
        });
      } else {
        // Check again if record exists (for race conditions)
        const existingRecord = checkAttendanceForDate(attendanceData.date);
        
        if (existingRecord) {
          // Switch to edit mode if record found
          setIsEditingAttendance(true);
          setCurrentAttendanceId(existingRecord.id);
          setAttendanceError('Attendance already exists for this date. You can edit it instead.');
          return;
        }
        
        // Add new record
        await addAttendance({
          date: attendanceData.date,
          attendedHours: parseFloat(attendanceData.attendedHours),
          conductedHours: parseFloat(attendanceData.conductedHours)
        });
        toast.success("Attendance recorded successfully!", {
          icon: "✅",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid rgba(74, 222, 128, 0.2)"
          }
        });
      }
      
      // Reset the form
      setIsEditingAttendance(false);
      setCurrentAttendanceId(null);
      setAttendanceData({
        date: new Date().toISOString().split("T")[0],
        attendedHours: "",
        conductedHours: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to save attendance");
      console.error("Error saving attendance:", error);
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

  const handleReset = async () => {
    if (!user?.uid) return;
    const confirmed = window.confirm(
      "Are you sure you want to reset your attendance data for the new semester? This action cannot be undone."
    );
    if (!confirmed) return;

    setIsResetting(true);
    try {
      // Delete all docs in /users/{uid}/attendance
      const attendanceRef = collection(db, "users", user.uid, "attendance");
      const attendanceSnap = await getDocs(attendanceRef);
      const deleteAttendance = attendanceSnap.docs.map((docu) => deleteDoc(docu.ref));

      // Delete all docs in /users/{uid}/logs
      const logsRef = collection(db, "users", user.uid, "logs");
      const logsSnap = await getDocs(logsRef);
      const deleteLogs = logsSnap.docs.map((docu) => deleteDoc(docu.ref));

      // Delete all docs in /users/{uid}/percentages
      const percRef = collection(db, "users", user.uid, "percentages");
      const percSnap = await getDocs(percRef);
      const deletePerc = percSnap.docs.map((docu) => deleteDoc(docu.ref));

      await Promise.all([...deleteAttendance, ...deleteLogs, ...deletePerc]);

      // (Optional) Create a blank attendance doc/structure
      // await setDoc(doc(db, "users", user.uid, "attendance", "template"), {});

      toast.success("Your data has been reset for the new semester.");
      // Optionally, trigger a UI refresh here (refetch attendance data)
    } catch (err) {
      toast.error("Failed to reset data. Please try again.");
    } finally {
      setIsResetting(false);
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
          whileHover={{ 
            backgroundColor: "rgba(34, 197, 94, 0.15)",
            borderColor: "rgba(34, 197, 94, 0.3)",
          }}
        >
          <div className="bg-green-500/20 p-2 rounded-full mr-3">
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">Attendance Marked Successfully!</p>
            <p className="text-sm text-gray-300">You&apos;ve already recorded your attendance for today.</p>
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
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Attendance circle card */}
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
                  <motion.circle
                    cx="50" 
                    cy="50" 
                    r="40"
                    fill="transparent"
                    stroke="url(#gradient)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - (profile?.attendancePercentage || 0) / 100)
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: "easeOut",
                      delay: 0.3
                    }}
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
                
                {/* Animated percentage text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <motion.span 
                    className="text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={profile?.attendancePercentage || 0}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    {profile?.attendancePercentage || 0}%
                  </motion.span>
                  <motion.span 
                    className="text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    Attendance
                  </motion.span>
                </div>
              </div>
              
              {/* Details */}
              <div className="w-full grid grid-cols-2 gap-4 mt-4">
                <motion.div 
                  className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex flex-col items-center"
                  whileHover={{ 
                    scale: 1.03, 
                    backgroundColor: "rgba(31, 41, 55, 0.7)",
                    transition: { duration: 0.2 } 
                  }}
                >
                  <p className="text-xs text-gray-400">Attended</p>
                  <p className="text-xl font-medium">{Math.round(profile?.totalAttendedHours || 0)} hrs</p>
                </motion.div>
                <motion.div 
                  className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex flex-col items-center"
                  whileHover={{ 
                    scale: 1.03, 
                    backgroundColor: "rgba(31, 41, 55, 0.7)",
                    transition: { duration: 0.2 } 
                  }}
                >
                  <p className="text-xs text-gray-400">Conducted</p>
                  <p className="text-xl font-medium">{Math.round(profile?.totalConductedHours || 0)} hrs</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Attendance form card */}
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
              {isEditingAttendance ? (
                // Edit Mode
                <>
                  <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400">Date</label>
                        <div className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full flex items-center gap-1">
                          <Edit size={12} />
                          <span>Editing</span>
                        </div>
                      </div>
                      <input
                        type="date"
                        value={attendanceData.date}
                        onChange={handleDateChange}
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
                            onFocus={handleInputFocus}
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
                            onFocus={handleInputFocus}
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
                    
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className={`flex-1 p-2 rounded transition-all duration-300
                          ${attendanceError 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/20'}`}
                        disabled={!!attendanceError}
                      >
                        {attendanceError ? 'Fix Errors to Continue' : 'Update Attendance'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAttendance(false);
                          setCurrentAttendanceId(null);
                          setAttendanceData({
                            date: new Date().toISOString().split('T')[0],
                            attendedHours: '',
                            conductedHours: '',
                          });
                          setAttendanceError('');
                        }}
                        className="p-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                // Add Mode
                <>
                  <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Date</label>
                      <input
                        type="date"
                        value={attendanceData.date}
                        onChange={handleDateChange}
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
                            onFocus={handleInputFocus}
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
                            onFocus={handleInputFocus}
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
                </>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Current Month Statistics</p>
                  <p className="text-sm font-medium">
                    {getCurrentMonthAttendancePercentage(attendance || [])}%
                  </p>
                </div>
                <div className="h-2 bg-gray-800 mt-2 rounded overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${getCurrentMonthAttendancePercentage(attendance || [])}%` 
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Month Attended</p>
                    <p className="text-lg font-medium">{Math.round(getCurrentMonthAttendedHours(attendance || []))} hrs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Month Conducted</p>
                    <p className="text-lg font-medium">{Math.round(getCurrentMonthConductedHours(attendance || []))} hrs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Task card */}
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
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 012 2" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No tasks yet</p>
                    <p className="text-xs text-gray-500 mt-1">Add your first task using the form above</p>
                  </motion.div>
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

        <motion.div 
          className="lg:col-span-8 col-span-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Calendar card */}
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
                                    <div className="absolute bottom-1 left-1 flex items-center">
                                      <div 
                                        className={`h-2 w-2 rounded-full mr-0.5
                                          ${Number(dayAttendance.attendedHours) === 0 
                                            ? 'bg-red-500' // Absent
                                            : Number(dayAttendance.attendedHours) < Number(dayAttendance.conductedHours)
                                              ? 'bg-yellow-500' // Partial
                                              : 'bg-green-500'}`} // Full
                                      />
                                      <span className="text-[0.6rem] text-gray-400">
                                        {Math.round(dayAttendance.attendedHours)}/{Math.round(dayAttendance.conductedHours)}
                                      </span>
                                    </div>
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

      {/* Reset Attendance Button - Placed at the bottom for visibility */}
      <div className="mt-8">
        <Button 
          onClick={handleReset}
          disabled={isResetting}
          className="w-full px-5 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-60"
        >
          {isResetting ? "Resetting..." : "Reset Attendance Data"}
        </Button>
      </div>
    </main>
  );
}