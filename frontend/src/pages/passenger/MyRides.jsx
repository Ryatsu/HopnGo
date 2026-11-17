import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CarFront,
  MapPin,
  Navigation,
  Clock,
  ArrowLeft,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  getRidesByPassenger,
  cancelRide,
} from "../../services/rideService";

export default function MyRides() {
  const navigate = useNavigate();

  // Temporary passenger ID for development
  const passengerId = 1;

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRides = useCallback(async () => {
    try {
      setError("");
      const data = await getRidesByPassenger(passengerId);
      setRides(data);
    } catch (err) {
      console.error("Failed to load rides:", err);
      setError("Unable to load your rides. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const handleCancelRide = async (rideId) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Ride #${rideId}?`
    );

    if (!confirmed) return;

    try {
      await cancelRide(rideId);
      alert("Ride cancelled successfully!");
      fetchRides();
    } catch (err) {
      console.error("Failed to cancel ride:", err);
      alert(
        err.response?.data?.message ||
        "Unable to cancel this ride. It may no longer be eligible for cancellation."
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/passenger")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                HOP'NGO PASSENGER
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                My Rides
              </h1>
              <p className="mt-2 text-gray-500">
                View and manage your ride bookings.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchRides}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button
                onClick={() => navigate("/passenger/book-ride")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <CarFront size={18} />
                Book a Ride
              </button>
            </div>
          </div>
        </div>

        {/* Ride Statistics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Rides",
              value: rides.length,
              color: "text-gray-900",
            },
            {
              label: "Requested",
              value: rides.filter((r) => r.status === "REQUESTED").length,
              color: "text-yellow-600",
            },
            {
              label: "In Progress",
              value: rides.filter((r) => r.status === "IN_PROGRESS").length,
              color: "text-purple-600",
            },
            {
              label: "Completed",
              value: rides.filter((r) => r.status === "COMPLETED").length,
              color: "text-green-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h2 className={`mt-2 text-3xl font-bold ${stat.color}`}>
                {loading ? "..." : stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Rides List */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Ride History
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              All your previous and current bookings
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading your rides...
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchRides}
                className="mt-4 font-semibold text-blue-600 hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : rides.length === 0 ? (
            <div className="p-12 text-center">
              <CarFront size={44} className="mx-auto text-gray-300" />
              <h3 className="mt-4 font-semibold text-gray-800">
                No rides found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Book your first ride to get started.
              </p>
              <button
                onClick={() => navigate("/passenger/book-ride")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Book a Ride
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rides.map((ride) => (
                <div key={ride.rideId} className="p-6">

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">
                        Ride #{ride.rideId}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={13} />
                        {formatDate(ride.bookingTime)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(ride.status)}`}
                    >
                      {ride.status}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={20}
                        className="mt-1 shrink-0 text-green-600"
                      />
                      <div>
                        <p className="text-xs text-gray-400">
                          Pickup Location
                        </p>
                        <p className="mt-1 font-medium text-gray-800">
                          {ride.pickupLocation?.address || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Navigation
                        size={20}
                        className="mt-1 shrink-0 text-red-500"
                      />
                      <div>
                        <p className="text-xs text-gray-400">
                          Destination
                        </p>
                        <p className="mt-1 font-medium text-gray-800">
                          {ride.destinationLocation?.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Driver and Fare */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Assigned Driver</p>
                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {ride.driver?.name || "Waiting for driver"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Fare</p>
                      <p className="mt-1 font-bold text-gray-900">
                        {ride.fare
                          ? `₱${Number(ride.fare).toFixed(2)}`
                          : "Not calculated"}
                      </p>
                    </div>

                    {["REQUESTED", "ACCEPTED"].includes(ride.status) && (
                      <button
                        onClick={() => handleCancelRide(ride.rideId)}
                        className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        <XCircle size={16} />
                        Cancel Ride
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}