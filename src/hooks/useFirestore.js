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
  updateCityProgress
} from '@/lib/firestore';

export function useFirestore() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for tasks changes
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (user) {
      unsubscribe = getUserTasks(user.uid, (data) => {
        setTasks(data);
      });
    } else {
      setTasks([]);
    }
    
    return () => unsubscribe();
  }, [user]);

  // Listen for attendance records
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (user) {
      unsubscribe = getAttendanceRecords(user.uid, (data) => {
        setAttendance(data);
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
    return addAttendanceRecord(user.uid, data);
  };

  const handleUpdateAttendance = async (recordId, updates) => {
    if (!user) return;
    return updateAttendanceRecord(user.uid, recordId, updates);
  };

  const handleDeleteAttendance = async (recordId) => {
    if (!user) return;
    return deleteAttendanceRecord(user.uid, recordId);
  };

  // City progress
  const handleUpdateCityProgress = async (progress) => {
    if (!user) return;
    return updateCityProgress(user.uid, progress);
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
    updateCityProgress: handleUpdateCityProgress
  };
}