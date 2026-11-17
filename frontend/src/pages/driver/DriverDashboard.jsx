import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDriverById } from "../../services/driverService";
import { getRidesByDriver } from "../../services/rideService";

const DRIVER_ID = 2;

function DriverDashboard() {
  const [driver, setDriver] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [driverData, rideData] = await Promise.all([
        getDriverById(DRIVER_ID),
        getRidesByDriver(DRIVER_ID),
      ]);

      setDriver(driverData);
      setRides(rideData);
    } catch (err) {
      console.error("Failed to load driver dashboard:", err);
      setError("Unable to load dashboard information. Please check your backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const completedRides = rides.filter(
    (ride) => ride.status === "COMPLETED"
  );

  const activeRides = rides.filter(
    (ride) => ["ACCEPTED", "IN_PROGRESS"].includes(ride.status)
  );

  const requestedRides = rides.filter(
    (ride) => ride.status === "REQUESTED"
  );

  const totalEarnings = completedRides.reduce(
    (total, ride) => total + Number(ride.fare || 0),
    0
  );

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const statusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "ACCEPTED":
        return "bg-purple-100 text-purple-700";
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading driver dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
          <button
            onClick={loadDashboard}
            className="ml-3 font-semibold underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Driver Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {driver?.name || "Driver"}!
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Driver Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {driver?.name}
            </h2>
            <p className="text-sm text-gray-500">
              {driver?.email}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              License No: {driver?.licenseNo || "N/A"}
            </p>
          </div>

          <div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                driver?.available
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {driver?.available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Trips</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {rides.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed Trips</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {completedRides.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Trips</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {activeRides.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            ₱{totalEarnings.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/driver/requests"
          className="rounded-xl bg-blue-600 p-5 text-white shadow-sm transition hover:bg-blue-700"
        >
          <h3 className="text-lg font-semibold">Ride Requests</h3>
          <p className="mt-1 text-sm text-blue-100">
            View available ride requests ({requestedRides.length})
          </p>
        </Link>

        <Link
          to="/driver/my-trips"
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            My Trips
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            View your ride history and trip details
          </p>
        </Link>
      </div>

      {/* Recent Rides */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Trips
          </h2>

          <Link
            to="/driver/my-trips"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {rides.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No trips found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3">Ride ID</th>
                  <th className="px-5 py-3">Passenger</th>
                  <th className="px-5 py-3">Pickup</th>
                  <th className="px-5 py-3">Destination</th>
                  <th className="px-5 py-3">Fare</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {[...rides]
                  .sort(
                    (a, b) =>
                      new Date(b.bookingTime || 0) -
                      new Date(a.bookingTime || 0)
                  )
                  .slice(0, 5)
                  .map((ride) => (
                    <tr key={ride.rideId} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-800">
                        #{ride.rideId}
                      </td>
                      <td className="px-5 py-4">
                        {ride.passenger?.name || "N/A"}
                      </td>
                      <td className="px-5 py-4">
                        {ride.pickupLocation?.address || "N/A"}
                      </td>
                      <td className="px-5 py-4">
                        {ride.destinationLocation?.address || "N/A"}
                      </td>
                      <td className="px-5 py-4">
                        ₱{Number(ride.fare || 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                            ride.status
                          )}`}
                        >
                          {ride.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {formatDate(ride.bookingTime)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverDashboard;