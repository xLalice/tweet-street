import axios from 'axios';

interface PostData {
    content: string;
    scheduledTime: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get the token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Set up the default headers with the token for every request
axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch scheduled posts with token in Authorization header
export const fetchScheduledPosts = async () => {
  const response = await axios.get(`${BASE_URL}/api/posts`);
  return response.data;
};

// Create a new post with token in Authorization header
export const createPost = async (postData: PostData) => {
  const response = await axios.post(`${BASE_URL}/api/posts/schedule`, postData);
  return response.data;
};

// Update a post with token in Authorization header
export const updatePost = async (postId: number, postData: PostData) => {
  const response = await axios.put(`${BASE_URL}/api/posts/${postId}`, postData);
  return response.data;
};

// Verify authentication with token in Authorization header
export const verifyAuth = async () => {
  const response = await axios.get(`${BASE_URL}/auth/verify`);
  return response.data;
};

// Logout user (token won't be needed for this request if it clears the session)
export const logoutUser = async () => {
  const response = await axios.post(`${BASE_URL}/auth/logout`);
  return response.data;
};
