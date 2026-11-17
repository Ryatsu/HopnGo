import api from "./api";

// Get all rides
export const getAllRides = async () => {
  const response = await api.get("/rides");
  return response.data;
};

// Get ride by passenger
export const getRidesByPassenger = async (passengerId) => {
  const response = await api.get(
    `/rides/passenger/${passengerId}`
  );
  return response.data;
};

// Get rides assigned to a driver
export const getRidesByDriver = async (driverId) => {
  const response = await api.get(`/rides/driver/${driverId}`);
  return response.data;
};

// Book a ride
export const bookRide = async (
  passengerId,
  pickupLocationId,
  destinationLocationId
) => {
  const response = await api.post("/rides/book", null, {
    params: {
      passengerId,
      pickupLocationId,
      destinationLocationId,
    },
  });

  return response.data;
};


// Assign driver
export const assignDriver = async (rideId, driverId) => {
  const response = await api.put(
    `/rides/${rideId}/assign/${driverId}`
  );

  return response.data;
};

// Start a trip
export const startRide = async (rideId) => {
  const response = await api.put(`/rides/${rideId}/start`);
  return response.data;
};

// Complete a trip
export const completeRide = async (rideId, fare) => {
  const response = await api.put(
    `/rides/${rideId}/complete`,
    null,
    { params: { fare } }
  );
  return response.data;
};

// Cancel ride
export const cancelRide = async (rideId) => {
  const response = await api.put(
    `/rides/${rideId}/cancel`
  );

  return response.data;
};
// Get pending ride requests
export const getPendingRideRequests = async () => {
  const response = await api.get("/rides/requests");
  return response.data;
};