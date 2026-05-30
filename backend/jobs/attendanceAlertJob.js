import { autoMarkAbsent } from "../services/attendanceService.js";

// Runs every 5 minutes to auto-mark absent for expired sessions
// Also runs once at 11:59 PM as a final sweep
let cronInterval = null;

const getMillisUntil2359 = () => {
  const now  = new Date();
  const next = new Date();
  next.setHours(23, 59, 0, 0);

  if (now >= next) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
};

export const startAttendanceCronJob = () => {
  // Run every 5 minutes to catch sessions as they expire
  cronInterval = setInterval(async () => {
    try {
      console.log("[AttendanceJob] Running per-session absent sweep...");
      await autoMarkAbsent();
      console.log("[AttendanceJob] Sweep done.");
    } catch (err) {
      console.error("[AttendanceJob] Error:", err);
    }
  }, 5 * 60 * 1000); // every 5 minutes

  // Also schedule a daily final sweep at 11:59 PM
  const scheduleFinal = () => {
    const ms = getMillisUntil2359();
    console.log(`[AttendanceJob] Final sweep in ${Math.round(ms / 60000)} min`);

    setTimeout(async () => {
      try {
        console.log("[AttendanceJob] Running end-of-day final sweep...");
        await autoMarkAbsent();
        console.log("[AttendanceJob] End-of-day sweep done.");
      } catch (err) {
        console.error("[AttendanceJob] Final sweep error:", err);
      }
      scheduleFinal(); // schedule for next day
    }, ms);
  };

  scheduleFinal();
};