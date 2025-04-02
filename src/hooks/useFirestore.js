import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  getUserTasks,
  getAttendanceRecords,
  getUserProfile,
  addTask,
  toggleTaskCompletion,
  deleteTask,
  addAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  updateCityProgress,
  getAttendanceByDate
} from '@/lib/firestore';

export function useFirestore() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth state change listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(user ? true : false);
    });
    
    return () => unsubscribe();
  }, []);

  // Fetch tasks when user changes
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (user) {
      unsubscribe = getUserTasks(user.uid, (data) => {
        setTasks(data);
        setLoading(false);
      });
    } else {
      setTasks([]);
    }
    
    return () => unsubscribe();
  }, [user]);

  // Fetch attendance when user changes
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (user) {
      unsubscribe = getAttendanceRecords(user.uid, (data) => {
        setAttendance(data);
        setLoading(false);
      });
    } else {
      setAttendance([]);
    }
    
    return () => unsubscribe();
  }, [user]);

  // Listen for user profile changes
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (user) {
      unsubscribe = getUserProfile(user.uid, (data) => {
        setProfile(data);
      });
    } else {
      setProfile(null);
    }
    
    return () => unsubscribe();
  }, [user]);

  // Task operations
  const handleAddTask = async (taskData) => {
    if (!user) return null;
    return addTask(user.uid, taskData);
  };

  const handleToggleTask = async (taskId, completed) => {
    if (!user) return;
    return toggleTaskCompletion(user.uid, taskId, completed);
  };

  const handleDeleteTask = async (taskId) => {
    if (!user) return;
    return deleteTask(user.uid, taskId);
  };

  // Attendance operations
  const handleAddAttendance = async (data) => {
    if (!user) return null;
    
    // Check if attendance already exists for this date
    const existingAttendance = await getAttendanceByDate(user.uid, data.date);
    
    if (existingAttendance) {
      // If exists, update it instead of creating a new one
      return updateAttendanceRecord(user.uid, existingAttendance.id, {
        date: data.date,
        attendedHours: Number(data.attendedHours),
        conductedHours: Number(data.conductedHours),
        status: calculateAttendanceStatus(data.attendedHours, data.conductedHours)
      });
    }
    
    // Otherwise create a new record
    return addAttendanceRecord(user.uid, {
      ...data,
      status: calculateAttendanceStatus(data.attendedHours, data.conductedHours)
    });
  };

  const handleUpdateAttendance = async (recordId, updates) => {
    if (!user) return;
    
    // Add attendance status to updates
    const updatesWithStatus = {
      ...updates,
      status: calculateAttendanceStatus(updates.attendedHours, updates.conductedHours)
    };
    
    return updateAttendanceRecord(user.uid, recordId, updatesWithStatus);
  };

  const handleDeleteAttendance = async (recordId) => {
    if (!user) return;
    return deleteAttendanceRecord(user.uid, recordId);
  };

  // Helper function to calculate attendance status
  const calculateAttendanceStatus = (attended, conducted) => {
    const attendedNum = Number(attended);
    const conductedNum = Number(conducted);
    
    if (attendedNum === 0) return 'absent';
    if (attendedNum < conductedNum) return 'partial';
    return 'full';
  };

  // City progress
  const handleUpdateCityProgress = async (progress) => {
    if (!user) return;
    return updateCityProgress(user.uid, progress);
  };
  
  // Check if a specific date has attendance
  const checkAttendanceForDate = (dateStr) => {
    if (!attendance || !Array.isArray(attendance)) return null;
    
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    
    return attendance.find(record => {
      if (!record.date) return false;
      
      // Handle Firestore timestamp objects
      const recordDate = new Date(
        record.date.seconds ? record.date.seconds * 1000 : record.date
      );
      recordDate.setHours(0, 0, 0, 0);
      
      return recordDate.getTime() === targetDate.getTime();
    });
  };

  return {
    user,
    tasks,
    attendance,
    profile,
    loading,
    addTask: handleAddTask,
    toggleTask: handleToggleTask,
    deleteTask: handleDeleteTask,
    addAttendance: handleAddAttendance,
    updateAttendance: handleUpdateAttendance,
    deleteAttendance: handleDeleteAttendance,
    updateCityProgress: handleUpdateCityProgress,
    checkAttendanceForDate  // New utility function
  };
}