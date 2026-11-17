import api from "./api";

// Get all locations
export const getAllLocations = async () => {
  const response = await api.get("/locations");
  return response.data;
};

// Get location by ID
export const getLocationById = async (locationId) => {
  const response = await api.get(`/locations/${locationId}`);
  return response.data;
};

// Create a new location
export const createLocation = async (locationData) => {
  const response = await api.post("/locations", locationData);
  return response.data;
};