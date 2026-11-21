import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CarFront,
  MapPin,
  Clock,
  CreditCard,
  ArrowRight,
  Navigation,
} from "lucide-react";
import { getRidesByPassenger } from "../../services/rideService";

export default function PassengerDashboard() {
  const navigate = useNavigate();

  // Temporary passenger ID for development
  const passengerId = 1;

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data = await getRidesByPassenger(passengerId);
        setRides(data);
      } catch (error) {
        console.error("Failed to load passenger rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const completedRides = rides.filter(
    (ride) => ride.status === "COMPLETED"
  ).length;

  const activeRide = rides.find((ride) =>
    ["REQUESTED", "ACCEPTED", "IN_PROGRESS"].includes(ride.status)
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const statusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-blue-600">
            HOP'NGO PASSENGER
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Welcome to Hop'nGo!
          </h1>
          <p className="mt-2 text-gray-500">
            Book your next ride and travel with ease.
          </p>
        </div>

        {/* Book Ride Banner */}
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-blue-600 p-8 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Where would you like to go?
            </h2>
            <p className="mt-2 text-blue-100">
              Book a ride and let Hop'nGo take you there.
            </p>
          </div>

          <button
            onClick={() => navigate("/passenger/book-ride")}
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            <CarFront size={20} />
            Book a Ride
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Rides</p>
              <CarFront className="text-blue-600" />
            </div>
            <h3 className="mt-3 text-3xl font-bold text-gray-900">
              {loading ? "..." : rides.length}
            </h3>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Completed Rides</p>
              <Navigation className="text-green-600" />
            </div>
            <h3 className="mt-3 text-3xl font-bold text-gray-900">
              {loading ? "..." : completedRides}
            </h3>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Active Ride</p>
              <Clock className="text-orange-600" />
            </div>
            <h3 className="mt-3 text-3xl font-bold text-gray-900">
              {loading ? "..." : activeRide ? "1" : "0"}
            </h3>
          </div>
        </div>

        {/* Active Ride */}
        {activeRide && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-900">
                Your Active Ride
              </h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(activeRide.status)}`}>
                {activeRide.status}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="mt-1 font-medium text-gray-800">
                  {activeRide.pickupLocation?.address || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="mt-1 font-medium text-gray-800">
                  {activeRide.destinationLocation?.address || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Rides */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Rides
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your latest ride activity
              </p>
            </div>

            <button
              onClick={() => navigate("/passenger/my-rides")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">
              Loading your rides...
            </p>
          ) : rides.length === 0 ? (
            <div className="p-10 text-center">
              <CarFront className="mx-auto text-gray-300" size={40} />
              <p className="mt-3 font-medium text-gray-700">
                No rides yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Your booked rides will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rides.slice(0, 5).map((ride) => (
                <div
                  key={ride.rideId}
                  className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
                >
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">
                      Ride #{ride.rideId}
                    </p>
                    <div className="flex items-start gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="mt-0.5 shrink-0" />
                      <span>
                        {ride.pickupLocation?.address || "N/A"}
                        {" → "}
                        {ride.destinationLocation?.address || "N/A"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatDate(ride.bookingTime)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(ride.status)}`}>
                      {ride.status}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {ride.fare
                        ? `₱${Number(ride.fare).toFixed(2)}`
                        : "—"}
                    </span>
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