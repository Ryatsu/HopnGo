import { useCallback, useEffect, useState } from "react";
import {
  getRidesByDriver,
  startRide,
  completeRide,
} from "../../services/rideService";

const DRIVER_ID = 2;

function MyTrips() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRidesByDriver(DRIVER_ID);
      setRides(data);
    } catch (err) {
      console.error("Failed to load trips:", err);
      setError("Unable to load your trips. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const acceptedTrips = rides.filter(
    (ride) => ride.status === "ACCEPTED"
  );

  const activeTrips = rides.filter(
    (ride) => ride.status === "IN_PROGRESS"
  );

  const completedTrips = rides.filter(
    (ride) => ride.status === "COMPLETED"
  );

  const totalEarnings = completedTrips.reduce(
    (total, ride) => total + Number(ride.fare || 0),
    0
  );

  const handleStartTrip = async (rideId) => {
    if (!window.confirm(`Start Ride #${rideId}?`)) return;

    try {
      setProcessingId(rideId);
      setError("");
      setMessage("");

      await startRide(rideId);

      setMessage(`Ride #${rideId} has started successfully.`);

      await loadTrips();
    } catch (err) {
      console.error("Failed to start trip:", err);

      setError(
        err.response?.data?.message ||
        "Unable to start this trip. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleCompleteTrip = async (rideId) => {
    const fareInput = window.prompt(
      `Enter the fare for Ride #${rideId}:`
    );

    if (fareInput === null) return;

    const fare = Number(fareInput);

    if (!Number.isFinite(fare) || fare <= 0) {
      setError("Please enter a valid fare greater than zero.");
      setMessage("");
      return;
    }

    if (!window.confirm(
      `Complete Ride #${rideId} with a fare of ₱${fare.toFixed(2)}?`
    )) {
      return;
    }

    try {
      setProcessingId(rideId);
      setError("");
      setMessage("");

      await completeRide(rideId, fare);

      setMessage(`Ride #${rideId} has been completed successfully.`);

      await loadTrips();
    } catch (err) {
      console.error("Failed to complete trip:", err);

      setError(
        err.response?.data?.message ||
        "Unable to complete this trip. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-purple-100 text-purple-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading your trips...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Trips
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your assigned rides and trip history.
          </p>
        </div>

        <button
          onClick={loadTrips}
          disabled={processingId !== null}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Refresh
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

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Assigned Trips</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {rides.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Accepted Trips</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-600">
            {acceptedTrips.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Ongoing Trips</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {activeTrips.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            ₱{totalEarnings.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>
      </div>

      {/* Trip List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Assigned Trips
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View your accepted, ongoing, and completed rides.
          </p>
        </div>

        {rides.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold text-gray-800">
              No Assigned Trips
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven't accepted any ride requests yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {[...rides]
              .sort(
                (a, b) =>
                  new Date(b.bookingTime || 0) -
                  new Date(a.bookingTime || 0)
              )
              .map((ride) => (
                <div key={ride.rideId} className="space-y-4 p-5">
                  {/* Ride Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Ride #{ride.rideId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(ride.bookingTime)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        ride.status
                      )}`}
                    >
                      {ride.status}
                    </span>
                  </div>

                  {/* Passenger */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase text-gray-400">
                      Passenger
                    </p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {ride.passenger?.name || "Unknown Passenger"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ride.passenger?.phone || "No phone number"}
                    </p>
                  </div>

                  {/* Route */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                  {/* Fare and Trip Times */}
                  <div className="flex flex-wrap gap-6 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Fare</p>
                      <p className="mt-1 font-semibold text-gray-800">
                        {ride.fare == null
                          ? "Not yet determined"
                          : `₱${Number(ride.fare).toFixed(2)}`}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Trip Started</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {formatDate(ride.startTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Trip Ended</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {formatDate(ride.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {ride.status === "ACCEPTED" && (
                    <button
                      onClick={() => handleStartTrip(ride.rideId)}
                      disabled={processingId !== null}
                      className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processingId === ride.rideId
                        ? "Processing..."
                        : "Start Trip"}
                    </button>
                  )}

                  {ride.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => handleCompleteTrip(ride.rideId)}
                      disabled={processingId !== null}
                      className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processingId === ride.rideId
                        ? "Processing..."
                        : "Complete Trip"}
                    </button>
                  )}

                  {ride.status === "COMPLETED" && (
                    <div className="rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                      Trip completed successfully.
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;