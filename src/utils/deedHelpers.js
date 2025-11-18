/**
 * Good deed and points calculation utilities
 */

import { getTodayDate, isSameDay } from "./dateHelpers";

/**
 * Calculates the new streak based on the last deed date
 * @param {string|null} lastDeedDate - ISO date string of last deed
 * @param {number} currentStreak - Current streak count
 * @returns {number} New streak count
 */
export const calculateStreak = (lastDeedDate, currentStreak) => {
  if (!lastDeedDate) return 1;

  const lastDate = new Date(lastDeedDate);
  const todayDate = new Date(getTodayDate());
  const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return currentStreak + 1;
  } else if (diffDays > 1) {
    return 1;
  } else {
    return currentStreak;
  }
};

/**
 * Calculates points for solving the puzzle on consecutive days
 * Base: 5 points, Bonus: streak points
 * @param {number} streak - Current streak count
 * @returns {number} Points for solving (5 + streak)
 */
export const calculateSolvePoints = (streak) => {
  return 5 + streak;
};

/**
 * Calculates points for uploading image on consecutive days
 * Base: 5 points, Bonus: streak points
 * @param {number} streak - Current streak count
 * @returns {number} Points for uploading (5 + streak)
 */
export const calculateUploadPoints = (streak) => {
  return 5 + streak;
};

/**
 * Checks if user has already completed today's deed
 * @param {Object} userData - User data object
 * @returns {boolean} True if deed already completed today
 */
export const hasCompletedToday = (userData) => {
  const today = getTodayDate();
  return (
    isSameDay(userData.lastDeedDate, today) &&
    userData.pastDeeds.some((d) => d.date === today)
  );
};

/**
 * Creates a new deed object
 * @param {string} deed - The good deed text
 * @param {number} solvePoints - Points earned for solving
 * @param {number} uploadPoints - Points earned for uploading
 * @param {number} streak - Current streak
 * @param {string|null} image - Image data URL (optional)
 * @returns {Object} New deed object
 */
export const createDeed = (deed, solvePoints, uploadPoints, streak, image = null) => {
  return {
    date: getTodayDate(),
    deed,
    solvePoints,
    uploadPoints,
    totalPoints: solvePoints + uploadPoints,
    streak,
    ...(image && { image }),
  };
};
