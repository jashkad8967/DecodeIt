/**
 * Authentication helpers using API (replaces authHelpers.js)
 */

import { authAPI, userAPI, signOutAPI } from './api';

/**
 * Clears the user profile
 */
export const clearProfile = () => {
  signOutAPI();
  if (typeof window !== "undefined") {
    localStorage.removeItem("zodiacCipherProfile");
  }
};

/**
 * Signs out the user
 */
export const signOut = () => {
  clearProfile();
  return {
    profile: null,
    isSignedIn: false,
    email: "",
    birthday: "",
    birthdayParts: { month: "", day: "", year: "" },
    step: 1,
    view: "home",
  };
};

/**
 * Signs in a user with email/username and password
 */
export const signIn = async (identifier, password) => {
  if (!identifier) {
    throw new Error("Please enter your email or username.");
  }
  if (!password || password.length < 4) {
    throw new Error("Password must be at least 4 characters.");
  }

  try {
    const response = await authAPI.login(identifier, password);
    const profile = {
      email: response.user.email,
      username: response.user.username,
      birthday: response.user.birthday,
      theme: response.user.theme || 'dark',
    };

    // Save to localStorage as backup
    if (typeof window !== "undefined") {
      localStorage.setItem("zodiacCipherProfile", JSON.stringify(profile));
    }

    return profile;
  } catch (error) {
    throw new Error(error.message || "Login failed. Please try again.");
  }
};

/**
 * Registers a new user
 */
export const register = async (email, password, isoBirthday, username) => {
  if (!email || !email.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  if (!password || password.length < 4) {
    throw new Error("Password must be at least 4 characters.");
  }
  if (!isoBirthday) {
    throw new Error("Please provide your birthday.");
  }

  try {
    const response = await authAPI.register(email, password, isoBirthday, username);
    const profile = {
      email: response.user.email,
      username: response.user.username,
      birthday: response.user.birthday,
      theme: response.user.theme || 'dark',
    };

    // Save to localStorage as backup
    if (typeof window !== "undefined") {
      localStorage.setItem("zodiacCipherProfile", JSON.stringify(profile));
    }

    return profile;
  } catch (error) {
    throw new Error(error.message || "Registration failed. Please try again.");
  }
};

/**
 * Updates user profile
 */
export const updateProfile = async (email, updates) => {
  try {
    const response = await userAPI.updateProfile(updates);
    const profile = {
      email: response.user.email,
      username: response.user.username,
      birthday: response.user.birthday,
      theme: response.user.theme,
    };

    // Update localStorage backup
    if (typeof window !== "undefined") {
      localStorage.setItem("zodiacCipherProfile", JSON.stringify(profile));
    }

    return profile;
  } catch (error) {
    throw new Error(error.message || "Failed to update profile.");
  }
};

/**
 * Resets user password
 */
export const resetPassword = async (currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required.");
  }
  if (newPassword.length < 4) {
    throw new Error("New password must be at least 4 characters.");
  }

  try {
    await userAPI.changePassword(currentPassword, newPassword);
  } catch (error) {
    throw new Error(error.message || "Failed to change password.");
  }
};

/**
 * Deletes user account
 */
export const deleteAccount = async (email) => {
  try {
    await userAPI.deleteAccount();
    clearProfile();
  } catch (error) {
    throw new Error(error.message || "Failed to delete account.");
  }
};

