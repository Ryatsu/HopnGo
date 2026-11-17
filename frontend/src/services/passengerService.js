
import api from "./api";

// Get all passengers
export const getAllPassengers = async () => {
  const response = await api.get("/passengers");
  return response.data;
};

// Get passenger by ID
export const getPassengerById = async (passengerId) => {
  const response = await api.get(`/passengers/${passengerId}`);
  return response.data;
};

// Create passenger
export const createPassenger = async (passengerData) => {
  const response = await api.post("/passengers", passengerData);
  return response.data;
};

// Update passenger profile
export const updatePassenger = async (passengerId, passengerData) => {
  const response = await api.put(
    `/passengers/${passengerId}`,
    passengerData
  );
  return response.data;
};
