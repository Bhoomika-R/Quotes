import axios from 'axios';

const API_BASE_URL = 'https://assignment.stage.crafto.app';
const MEDIA_UPLOAD_URL = 'https://crafto.app/crafto/v1.0/media/assignment/upload';

export const login = async (username, otp) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { username, otp });
  return response.data;
};

export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(MEDIA_UPLOAD_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const createQuote = async (text, mediaUrl, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/postQuote`,
    { text, mediaUrl },
    { headers: { Authorization: token } }
  );
  return response.data;
};

export const getQuotes = async (limit, offset, token) => {
  const response = await axios.get(`${API_BASE_URL}/getQuotes`, {
    params: { limit, offset },
    headers: { Authorization: token },
  });
  return response.data;
};

