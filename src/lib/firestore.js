import { db } from "./firebase";
import { 
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";

// =========== TASKS OPERATIONS ===========

// Get real-time tasks for a user
export const getUserTasks = (userId, callback) => {
  if (!userId) return () => {};
  
  const tasksRef = collection(db, `users/${userId}/tasks`);
  const tasksQuery = query(tasksRef, orderBy("dueDate"));
  
  return onSnapshot(tasksQuery, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate ? doc.data().dueDate.toDate() : null,
    }));
    callback(tasks);
  }, error => {
    console.error("Error getting tasks:", error);
    callback([]);
  });
};

// Add a task
export const addTask = async (userId, task) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    const tasksRef = collection(db, `users/${userId}/tasks`);
    const taskData = {
      text: task.text,
      dueDate: task.dueDate ? Timestamp.fromDate(new Date(task.dueDate)) : null,
      completed: false,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(tasksRef, taskData);
    return { id: docRef.id, ...taskData };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (userId, taskId, completed) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
    await updateDoc(taskRef, { completed });
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (userId, taskId) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// =========== ATTENDANCE OPERATIONS ===========

// Get attendance records for a user
export const getAttendanceRecords = (userId, callback) => {
  if (!userId) return () => {};
  
  const attendanceRef = collection(db, `users/${userId}/attendance`);
  const attendanceQuery = query(attendanceRef, orderBy("date", "desc"));
  
  return onSnapshot(attendanceQuery, (snapshot) => {
    const attendance = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date ? doc.data().date.toDate() : null,
    }));
    callback(attendance);
  }, error => {
    console.error("Error getting attendance:", error);
    callback([]);
  });
};

// Add attendance record
export const addAttendanceRecord = async (userId, attendanceData) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    const attendanceRef = collection(db, `users/${userId}/attendance`);
    const data = {
      date: Timestamp.fromDate(new Date(attendanceData.date)),
      attendedHours: Number(attendanceData.attendedHours) || 0,
      conductedHours: Number(attendanceData.conductedHours) || 0,
      createdAt: serverTimestamp()
    };
    
    // Add the attendance record
    const docRef = await addDoc(attendanceRef, data);
    
    // Update user's overall attendance stats
    await updateAttendanceStats(userId);
    
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding attendance:", error);
    throw error;
  }
};

// Update attendance record
export const updateAttendanceRecord = async (userId, recordId, updates) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    const recordRef = doc(db, `users/${userId}/attendance/${recordId}`);
    
    const updateData = { ...updates };
    if (updates.date) {
      updateData.date = Timestamp.fromDate(new Date(updates.date));
    }
    
    await updateDoc(recordRef, updateData);
    
    // Update user's overall attendance stats
    await updateAttendanceStats(userId);
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw error;
  }
};

// Delete attendance record
export const deleteAttendanceRecord = async (userId, recordId) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    const recordRef = doc(db, `users/${userId}/attendance/${recordId}`);
    await deleteDoc(recordRef);
    
    // Update user's overall attendance stats
    await updateAttendanceStats(userId);
  } catch (error) {
    console.error("Error deleting attendance:", error);
    throw error;
  }
};

// Update attendance statistics for user (attendance percentage)
export const updateAttendanceStats = async (userId) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    // Get all attendance records
    const attendanceRef = collection(db, `users/${userId}/attendance`);
    const attendanceSnap = await getDocs(attendanceRef);
    
    let totalAttended = 0;
    let totalConducted = 0;
    
    attendanceSnap.forEach(doc => {
      const data = doc.data();
      totalAttended += Number(data.attendedHours) || 0;
      totalConducted += Number(data.conductedHours) || 0;
    });
    
    // Calculate percentage (handle division by zero)
    const attendancePercentage = totalConducted > 0 
      ? Math.round((totalAttended / totalConducted) * 100) 
      : 0;
    
    // Update user document with new stats
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      attendancePercentage,
      totalAttendedHours: totalAttended,
      totalConductedHours: totalConducted
    });
    
    return {
      attendancePercentage,
      totalAttendedHours: totalAttended,
      totalConductedHours: totalConducted
    };
  } catch (error) {
    console.error("Error updating attendance stats:", error);
    throw error;
  }
};

// =========== USER PROFILE & STATS ===========

// Get user profile data
export const getUserProfile = (userId, callback) => {
  if (!userId) return () => {};
  
  const userRef = doc(db, "users", userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  }, error => {
    console.error("Error getting user profile:", error);
    callback(null);
  });
};

// Update city progress
export const updateCityProgress = async (userId, progress) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      cityProgress: Number(progress)
    });
  } catch (error) {
    console.error("Error updating city progress:", error);
    throw error;
  }
};