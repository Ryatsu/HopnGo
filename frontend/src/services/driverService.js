import api from "./api";

// Get all drivers
export const getAllDrivers = async () => {
  const response = await api.get("/drivers");
  return response.data;
};

// Get available drivers
export const getAvailableDrivers = async () => {
  const response = await api.get("/drivers/available");
  return response.data;
};

// Get driver by ID
export const getDriverById = async (driverId) => {
  const response = await api.get(`/drivers/${driverId}`);
  return response.data;
};

// Register new driver
export const createDriver = async (driverData) => {
  const response = await api.post("/drivers", driverData);
  return response.data;
};

// Update driver availability
export const updateDriverAvailability = async (driverId, available) => {
  const response = await api.put(
    `/drivers/${driverId}/availability`,
    null,
    { params: { available } }
  );
  return response.data;
};

// Update driver profile
export const updateDriver = async (driverId, driverData) => {
  const response = await api.put(`/drivers/${driverId}`, driverData);
  return response.data;
};