/**
 * API-based storage utilities that replace localStorage
 * Falls back to localStorage if API is unavailable
 */

import { authAPI, userAPI, dataAPI, likesAPI, signOutAPI } from './api';

// Fallback to localStorage if API fails
const FALLBACK_MODE = false; // Set to true to use localStorage fallback

/**
 * Check if API is available
 */
const isAPIAvailable = () => {
  return !FALLBACK_MODE && process.env.REACT_APP_API_URL;
};

/**
 * Profile management
 */
export const getProfile = async () => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      const data = localStorage.getItem('zodiacCipherProfile');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  try {
    const response = await userAPI.getProfile();
    return {
      email: response.user.email,
      username: response.user.username,
      birthday: response.user.birthday,
      theme: response.user.theme,
    };
  } catch (error) {
    console.error('Failed to get profile from API, using localStorage fallback:', error);
    try {
      const data = localStorage.getItem('zodiacCipherProfile');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
};

export const saveProfile = async (profile) => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      localStorage.setItem('zodiacCipherProfile', JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
    return;
  }

  try {
    await userAPI.updateProfile({
      username: profile.username,
      theme: profile.theme,
      birthday: profile.birthday,
    });
    // Also save to localStorage as backup
    try {
      localStorage.setItem('zodiacCipherProfile', JSON.stringify(profile));
    } catch {}
  } catch (error) {
    console.error('Failed to save profile to API, using localStorage fallback:', error);
    try {
      localStorage.setItem('zodiacCipherProfile', JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  }
};

/**
 * User data management
 */
export const getUserData = async (accountId) => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      const key = `zodiacCipherUserData_${accountId}`;
      const data = localStorage.getItem(key);
      return data
        ? JSON.parse(data)
        : { points: 0, streak: 0, lastDeedDate: null, pastDeeds: [] };
    } catch {
      return { points: 0, streak: 0, lastDeedDate: null, pastDeeds: [] };
    }
  }

  try {
    return await dataAPI.getUserData();
  } catch (error) {
    console.error('Failed to get user data from API, using localStorage fallback:', error);
    try {
      const key = `zodiacCipherUserData_${accountId}`;
      const data = localStorage.getItem(key);
      return data
        ? JSON.parse(data)
        : { points: 0, streak: 0, lastDeedDate: null, pastDeeds: [] };
    } catch {
      return { points: 0, streak: 0, lastDeedDate: null, pastDeeds: [] };
    }
  }
};

export const saveUserData = async (accountId, data) => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      const key = `zodiacCipherUserData_${accountId}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save user data:', err);
    }
    return;
  }

  try {
    await dataAPI.saveUserData(data);
    // Also save to localStorage as backup
    try {
      const key = `zodiacCipherUserData_${accountId}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  } catch (error) {
    console.error('Failed to save user data to API, using localStorage fallback:', error);
    try {
      const key = `zodiacCipherUserData_${accountId}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save user data:', err);
    }
  }
};

/**
 * Leaderboard
 */
export const getAllUsersData = async () => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      const allUsers = [];
      const profiles = JSON.parse(localStorage.getItem('zodiacCipherProfiles') || '[]');
      const usernameMap = new Map();

      profiles.forEach((profile) => {
        const key = `zodiacCipherUserData_${profile.email}`;
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        const username = profile.username || profile.email.split('@')[0];
        const userEntry = {
          email: profile.email,
          name: username,
          points: userData.points || 0,
          streak: userData.streak || 0,
        };

        if (usernameMap.has(username.toLowerCase())) {
          const existing = usernameMap.get(username.toLowerCase());
          if (userEntry.points > existing.points) {
            usernameMap.set(username.toLowerCase(), userEntry);
          }
        } else {
          usernameMap.set(username.toLowerCase(), userEntry);
        }
      });

      const uniqueUsers = Array.from(usernameMap.values());
      return uniqueUsers.sort((a, b) => b.points - a.points);
    } catch {
      return [];
    }
  }

  try {
    return await dataAPI.getLeaderboard();
  } catch (error) {
    console.error('Failed to get leaderboard from API, using localStorage fallback:', error);
    // Fallback logic here (same as above)
    return [];
  }
};

/**
 * Community posts
 */
export const getAllPublicEntries = async () => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      const profiles = JSON.parse(localStorage.getItem('zodiacCipherProfiles') || '[]');
      const allEntries = [];

      profiles.forEach((profile) => {
        const key = `zodiacCipherUserData_${profile.email}`;
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        const username = profile.username || profile.email.split('@')[0];

        userData.pastDeeds?.forEach((deed) => {
          if (deed.image) {
            allEntries.push({
              entryId: `${profile.email}_${deed.date}`,
              email: profile.email,
              username: username,
              deed: deed.deed,
              date: deed.date,
              image: deed.image,
              solvePoints: deed.solvePoints || 0,
              uploadPoints: deed.uploadPoints || 0,
              totalPoints: deed.totalPoints || 0,
              streak: deed.streak || 0,
            });
          }
        });
      });

      return allEntries;
    } catch {
      return [];
    }
  }

  try {
    return await dataAPI.getCommunity();
  } catch (error) {
    console.error('Failed to get community from API, using localStorage fallback:', error);
    return [];
  }
};

/**
 * Likes management
 */
export const toggleLike = async (entryId, userEmail) => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      const likes = JSON.parse(localStorage.getItem('zodiacCipherLikes') || '{}');
      if (!likes[entryId]) {
        likes[entryId] = [];
      }

      const index = likes[entryId].indexOf(userEmail);
      if (index > -1) {
        likes[entryId].splice(index, 1);
      } else {
        likes[entryId].push(userEmail);
      }

      localStorage.setItem('zodiacCipherLikes', JSON.stringify(likes));
      return likes;
    } catch {
      return {};
    }
  }

  try {
    const response = await likesAPI.toggleLike(entryId);
    return response;
  } catch (error) {
    console.error('Failed to toggle like from API, using localStorage fallback:', error);
    // Fallback logic
    return {};
  }
};

export const hasUserLiked = async (entryId, userEmail) => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      const likes = JSON.parse(localStorage.getItem('zodiacCipherLikes') || '{}');
      return likes[entryId]?.includes(userEmail) || false;
    } catch {
      return false;
    }
  }

  try {
    const status = await likesAPI.getLikeStatus([entryId]);
    return status[entryId] || false;
  } catch (error) {
    console.error('Failed to get like status from API, using localStorage fallback:', error);
    try {
      const likes = JSON.parse(localStorage.getItem('zodiacCipherLikes') || '{}');
      return likes[entryId]?.includes(userEmail) || false;
    } catch {
      return false;
    }
  }
};

export const getLikeCount = async (entryId) => {
  if (!isAPIAvailable()) {
    // Fallback to localStorage
    try {
      const likes = JSON.parse(localStorage.getItem('zodiacCipherLikes') || '{}');
      return likes[entryId]?.length || 0;
    } catch {
      return 0;
    }
  }

  try {
    const counts = await likesAPI.getLikeCounts([entryId]);
    return counts[entryId] || 0;
  } catch (error) {
    console.error('Failed to get like count from API, using localStorage fallback:', error);
    try {
      const likes = JSON.parse(localStorage.getItem('zodiacCipherLikes') || '{}');
      return likes[entryId]?.length || 0;
    } catch {
      return 0;
    }
  }
};

/**
 * Get account ID from profile
 */
export const getAccountId = (profile) => {
  return profile?.email || null;
};

/**
 * Get all profiles (for fallback)
 */
export const getAllProfiles = () => {
  try {
    const data = localStorage.getItem('zodiacCipherProfiles');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Get profile by email (for fallback)
 */
export const getProfileByEmail = (email) => {
  const profiles = getAllProfiles();
  return profiles.find((p) => p.email === email) || null;
};

