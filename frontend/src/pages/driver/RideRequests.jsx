
import { useCallback, useEffect, useState } from "react";
import {
  getPendingRideRequests,
  assignDriver,
} from "../../services/rideService";

const DRIVER_ID = 2;

function RideRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingRideRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load ride requests:", err);
      setError("Unable to load ride requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAcceptRide = async (rideId) => {
    const confirmed = window.confirm(
      `Are you sure you want to accept Ride #${rideId}?`
    );

    if (!confirmed) return;

    try {
      setAcceptingId(rideId);
      setError("");
      setMessage("");

      await assignDriver(rideId, DRIVER_ID);

      setMessage(`You successfully accepted Ride #${rideId}.`);

      await loadRequests();
    } catch (err) {
      console.error("Failed to accept ride:", err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to accept this ride. It may already have been assigned, or you may be unavailable.";

      setError(backendMessage);
    } finally {
      setAcceptingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading ride requests...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Ride Requests
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and accept available passenger requests.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh Requests
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Request Count */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Available Ride Requests
        </p>
        <h2 className="mt-2 text-3xl font-bold text-blue-600">
          {requests.length}
        </h2>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            No Ride Requests Available
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            There are currently no pending passenger requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {requests.map((ride) => (
            <div
              key={ride.rideId}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  Ride #{ride.rideId}
                </h2>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  {ride.status}
                </span>
              </div>

              {/* Passenger */}
              <div className="mt-5 border-b border-gray-100 pb-4">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Passenger
                </p>
                <p className="mt-1 font-semibold text-gray-800">
                  {ride.passenger?.name || "Unknown Passenger"}
                </p>
                <p className="text-sm text-gray-500">
                  {ride.passenger?.phone || "No phone number"}
                </p>
                <p className="text-sm text-gray-500">
                  Rating: {ride.passenger?.rating ?? "N/A"}
                </p>
              </div>

              {/* Route */}
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Pickup Location
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {ride.pickupLocation?.address || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    Destination
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {ride.destinationLocation?.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* Booking Information */}
              <div className="flex flex-wrap justify-between gap-3 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Booking Time
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {formatDate(ride.bookingTime)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    Ride Fare
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {ride.fare == null
                      ? "Not yet determined"
                      : `₱${Number(ride.fare).toFixed(2)}`}
                  </p>
                </div>
              </div>

              {/* Accept Button */}
              <button
                onClick={() => handleAcceptRide(ride.rideId)}
                disabled={acceptingId !== null}
                className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {acceptingId === ride.rideId
                  ? "Accepting..."
                  : "Accept Ride"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RideRequests;
