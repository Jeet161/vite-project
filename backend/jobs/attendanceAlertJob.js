import { autoMarkAbsent } from "../services/attendanceService.js";

// Runs every day at 11:59 PM
// To use this, import and call startAttendanceCronJob() in server.js

let cronInterval = null;

const getMillisUntil2359 = () => {
  const now  = new Date();
  const next = new Date();
  next.setHours(23, 59, 0, 0);

  // If already past 11:59 PM today, schedule for tomorrow
  if (now >= next) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
};

export const startAttendanceCronJob = () => {
  const scheduleNext = () => {
    const ms = getMillisUntil2359();
    console.log(`[AttendanceJob] Next run in ${Math.round(ms / 60000)} minutes`);

    setTimeout(async () => {
      try {
        console.log("[AttendanceJob] Running auto-absent marking...");
        await autoMarkAbsent();
        console.log("[AttendanceJob] Done.");
      } catch (err) {
        console.error("[AttendanceJob] Error:", err);
      }
      // Schedule again for next day
      scheduleNext();
    }, ms);
  };

  scheduleNext();
};