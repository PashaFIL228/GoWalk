import axios from 'axios';

export const API_BASE = 'http://localhost:5000/api';

export const getPlacesByCity = (cityName) =>
    axios.get(`${API_BASE}/places/city/${cityName}`);

export const getRandomPlace = () =>
    axios.get(`${API_BASE}/places/random`);

export const getPlaceById = (id) =>
    axios.get(`${API_BASE}/places/${id}`);

export const addReview = (placeId, review) =>
    axios.post(`${API_BASE}/places/${placeId}/reviews`, review);

export const getPopularPlaces = () =>
    axios.get(`${API_BASE}/places/popular`);