import api from "./api";

// Get all payments
export const getAllPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

// Process payment
export const processPayment = async (rideId, method) => {
  const response = await api.post(
    `/payments/process/${rideId}`,
    null,
    {
      params: { method },
    }
  );

  return response.data;
};

// Confirm payment
export const confirmPayment = async (paymentId) => {
  const response = await api.put(
    `/payments/${paymentId}/confirm`
  );

  return response.data;
};

// Refund payment
export const refundPayment = async (paymentId) => {
  const response = await api.put(
    `/payments/${paymentId}/refund`
  );

  return response.data;
};

// Get payment history for a specific passenger
export const getPaymentsByPassenger = async (passengerId) => {
  const response = await api.get(`/payments/passenger/${passengerId}`);
  return response.data;
};