// LocalStorage utilities - Account-based storage
export const STORAGE_KEY_PREFIX = "zodiacCipherUserData_";
export const PROFILE_KEY = "zodiacCipherProfile";
export const PROFILES_KEY = "zodiacCipherProfiles"; // Store all profiles

/**
 * Get storage key for a specific account
 * @param {string} accountId - Email for signed-in users, "guest" for guests
 * @returns {string} Storage key
 */
const getAccountKey = (accountId) => `${STORAGE_KEY_PREFIX}${accountId}`;

/**
 * Get account ID from profile or return "guest"
 * @param {Object|null} profile - User profile
 * @returns {string} Account ID
 */
export const getAccountId = (profile) => {
  return profile?.email || "guest";
};

/**
 * Get user data for a specific account
 * @param {string} accountId - Account ID (email or "guest")
 * @returns {Object} User data
 */
export const getUserData = (accountId = "guest") => {
  try {
    const key = getAccountKey(accountId);
    const data = localStorage.getItem(key);
    return data
      ? JSON.parse(data)
      : { points: 0, streak: 0, lastDeedDate: null, pastDeeds: [], leaderboard: [] };
  } catch {
    return { points: 0, streak: 0, lastDeedDate: null, pastDeeds: [], leaderboard: [] };
  }
};

/**
 * Save user data for a specific account
 * @param {string} accountId - Account ID (email or "guest")
 * @param {Object} data - User data to save
 */
export const saveUserData = (accountId, data) => {
  try {
    const key = getAccountKey(accountId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save user data:", err);
  }
};

/**
 * Get all user data from all accounts for leaderboard
 * @returns {Array} Array of {email, points, streak} objects
 */
export const getAllUsersData = () => {
  try {
    const allUsers = [];
    const profiles = getAllProfiles();
    
    // Get data for all registered users
    profiles.forEach((profile) => {
      const userData = getUserData(profile.email);
      if (userData.points > 0) {
        allUsers.push({
          email: profile.email,
          name: profile.username || profile.email.split("@")[0], // Use username if available, else email prefix
          points: userData.points,
          streak: userData.streak,
        });
      }
    });
    
    // Also include guest if they have points
    const guestData = getUserData("guest");
    if (guestData.points > 0) {
      allUsers.push({
        email: "guest",
        name: "Guest",
        points: guestData.points,
        streak: guestData.streak,
      });
    }
    
    // Sort by points descending
    return allUsers.sort((a, b) => b.points - a.points);
  } catch {
    return [];
  }
};

/**
 * Get current profile (legacy support)
 * @returns {Object|null} Profile object
 */
export const getProfile = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Save current profile (legacy support)
 * @param {Object} profile - Profile object
 */
export const saveProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    // Also save to profiles list
    const profiles = getAllProfiles();
    const existingIndex = profiles.findIndex((p) => p.email === profile.email);
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error("Failed to save profile:", err);
  }
};

/**
 * Get all saved profiles
 * @returns {Array} Array of profile objects
 */
export const getAllProfiles = () => {
  try {
    const data = localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Find profile by email
 * @param {string} email - Email address
 * @returns {Object|null} Profile object or null
 */
export const getProfileByEmail = (email) => {
  const profiles = getAllProfiles();
  return profiles.find((p) => p.email === email) || null;
};
