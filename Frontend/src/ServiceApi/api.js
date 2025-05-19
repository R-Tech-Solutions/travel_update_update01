// src/service/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/travel/api', // Updated to match the backend API
  withCredentials: true,
});

// Add place
export const addPlace = async (formData) => {
  return api.post('/places/add/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get all places
export const getPlaces = async () => {
  try {
    const response = await api.get('/places/'); // Fetch all places
    return response; // Return the response
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error; // Re-throw the error for handling in the component
  }
};

// Fetch all places
export const fetchPlaces = async () => {
  try {
    const response = await api.get('/places/');
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

// Get single place
export const getPlaceDetail = async (id) => {
  return api.get(`/places/${id}/`);
};