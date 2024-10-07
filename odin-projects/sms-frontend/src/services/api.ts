import axios from 'axios';

interface PostData {
    content: string;
    scheduledTime: string;
}


axios.defaults.withCredentials = true;

// Get the base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 
export const fetchScheduledPosts = async () => {
  const response = await axios.get(`${BASE_URL}/api/posts`);
  return response.data;
};

export const createPost = async (postData: PostData) => {
  const response = await axios.post(`${BASE_URL}/api/posts/schedule`, postData);
  return response.data;
};

export const updatePost = async (postId: number, postData: PostData) => {
  const response = await axios.put(`${BASE_URL}/api/posts/${postId}`, postData);
  return response.data;
};

export const verifyAuth = async () => {
  const response = await axios.get(`${BASE_URL}/auth/verify`);
  return response.data;
}

export const logoutUser = async () => {
  const response = await axios.post(`${BASE_URL}/auth/logout`);
  return response.data;
}

