/**
 * API client utilities for backend communication
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Get auth token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Set auth token in localStorage
 */
const setToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

/**
 * Authentication API
 */
export const authAPI = {
  register: async (email, password, birthday, username) => {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, birthday, username }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  login: async (identifier, password) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },
};

/**
 * User API
 */
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/api/user/profile');
  },

  updateProfile: async (updates) => {
    return apiRequest('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiRequest('/api/user/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  deleteAccount: async () => {
    const response = await apiRequest('/api/user/account', {
      method: 'DELETE',
    });
    setToken(null); // Clear token after account deletion
    return response;
  },
};

/**
 * Data API
 */
export const dataAPI = {
  getUserData: async () => {
    const response = await apiRequest('/api/data/userdata');
    return response.data;
  },

  saveUserData: async (data) => {
    const response = await apiRequest('/api/data/userdata', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await apiRequest('/api/data/leaderboard');
    return response.leaderboard;
  },

  getCommunity: async () => {
    const response = await apiRequest('/api/data/community');
    return response.entries;
  },
};

/**
 * Likes API
 */
export const likesAPI = {
  toggleLike: async (entryId) => {
    return apiRequest('/api/likes/toggle', {
      method: 'POST',
      body: JSON.stringify({ entryId }),
    });
  },

  getLikeStatus: async (entryIds) => {
    const response = await apiRequest('/api/likes/status', {
      method: 'POST',
      body: JSON.stringify({ entryIds }),
    });
    return response.status;
  },

  getLikeCounts: async (entryIds) => {
    const response = await apiRequest('/api/likes/counts', {
      method: 'POST',
      body: JSON.stringify({ entryIds }),
    });
    return response.counts;
  },
};

/**
 * Sign out (clear token)
 */
export const signOutAPI = () => {
  setToken(null);
};

