import { useEffect, useState } from "react";
import {
  CarFront,
  Plus,
  RefreshCw,
  X,
  MapPin,
  UserRound,
  Clock,
} from "lucide-react";

import {
  getAllRides,
  bookRide,
  assignDriver,
  startRide,
  completeRide,
  cancelRide,
} from "../../services/rideService";

import { getAllPassengers } from "../../services/passengerService";
import { getAllDrivers, getAvailableDrivers } from "../../services/driverService";
import { getAllLocations } from "../../services/locationService";

function RideManagement() {
  const [rides, setRides] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [fareValues, setFareValues] = useState({});

  const [bookingData, setBookingData] = useState({
    passengerId: "",
    pickupLocationId: "",
    destinationLocationId: "",
  });

  // Fetch all required data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        rideData,
        passengerData,
        driverData,
        availableDriverData,
        locationData,
      ] = await Promise.all([
        getAllRides(),
        getAllPassengers(),
        getAllDrivers(),
        getAvailableDrivers(),
        getAllLocations(),
      ]);

      setRides(rideData);
      setPassengers(passengerData);
      setDrivers(driverData);
      setAvailableDrivers(availableDriverData);
      setLocations(locationData);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to load ride management data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Booking form changes
  const handleBookingChange = (e) => {
    const { name, value } = e.target;

    setBookingData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Book a ride
  const handleBookRide = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      if (
        bookingData.pickupLocationId ===
        bookingData.destinationLocationId
      ) {
        setError("Pickup and destination must be different.");
        return;
      }

      await bookRide(
        Number(bookingData.passengerId),
        Number(bookingData.pickupLocationId),
        Number(bookingData.destinationLocationId)
      );

      setSuccess("Ride booked successfully!");

      setBookingData({
        passengerId: "",
        pickupLocationId: "",
        destinationLocationId: "",
      });

      setShowBookingForm(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to book ride."
      );
    }
  };

  // Assign a driver
  const handleAssignDriver = async (rideId) => {
    try {
      setError("");
      setSuccess("");

      const driverId = selectedDriver[rideId];

      if (!driverId) {
        setError("Please select a driver first.");
        return;
      }

      await assignDriver(rideId, Number(driverId));

      setSuccess("Driver assigned successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to assign driver."
      );
    }
  };

  // Start a ride
  const handleStartRide = async (rideId) => {
    try {
      setError("");
      setSuccess("");

      await startRide(rideId);

      setSuccess("Trip started successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to start trip."
      );
    }
  };

  // Complete a ride
  const handleCompleteRide = async (rideId) => {
    try {
      setError("");
      setSuccess("");

      const fare = fareValues[rideId];

      if (fare === undefined || fare === "" || Number(fare) <= 0) {
        setError("Please enter a valid fare greater than zero.");
        return;
      }

      await completeRide(rideId, Number(fare));

      setSuccess("Trip completed successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to complete trip."
      );
    }
  };

  // Cancel a ride
  const handleCancelRide = async (rideId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this ride?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await cancelRide(rideId);

      setSuccess("Ride cancelled successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to cancel ride."
      );
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      REQUESTED: "bg-yellow-100 text-yellow-700",
      ACCEPTED: "bg-blue-100 text-blue-700",
      IN_PROGRESS: "bg-purple-100 text-purple-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-slate-100 text-slate-700";
  };

  const totalRides = rides.length;
  const requestedRides = rides.filter(
    (ride) => ride.status === "REQUESTED"
  ).length;
  const activeRides = rides.filter(
    (ride) =>
      ride.status === "ACCEPTED" ||
      ride.status === "IN_PROGRESS"
  ).length;
  const completedRides = rides.filter(
    (ride) => ride.status === "COMPLETED"
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Rides
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage bookings, driver assignments, and trips.
          </p>
        </div>

        <button
          onClick={() => setShowBookingForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Book a Ride
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[
          {
            label: "Total Rides",
            value: totalRides,
            icon: CarFront,
            color: "text-blue-600",
          },
          {
            label: "Requested",
            value: requestedRides,
            icon: Clock,
            color: "text-yellow-600",
          },
          {
            label: "Active Rides",
            value: activeRides,
            icon: UserRound,
            color: "text-purple-600",
          },
          {
            label: "Completed",
            value: completedRides,
            icon: MapPin,
            color: "text-green-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Icon size={25} className={item.color} />

              <p className="mt-3 text-sm text-slate-500">
                {item.label}
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Ride Records */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">
            Ride Records
          </h2>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading rides...
          </p>
        ) : rides.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No ride records found. Book your first ride.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">Ride ID</th>
                  <th className="px-5 py-4">Passenger</th>
                  <th className="px-5 py-4">Driver</th>
                  <th className="px-5 py-4">Pickup</th>
                  <th className="px-5 py-4">Destination</th>
                  <th className="px-5 py-4">Fare</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rides.map((ride) => (
                  <tr key={ride.rideId}>

                    <td className="px-5 py-4 font-medium">
                      #{ride.rideId}
                    </td>

                    <td className="px-5 py-4">
                      {ride.passenger?.name || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      {ride.driver?.name || "Not assigned"}
                    </td>

                    <td className="px-5 py-4">
                      {ride.pickupLocation?.address || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      {ride.destinationLocation?.address || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      {ride.fare != null
                        ? `₱${Number(ride.fare).toFixed(2)}`
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          ride.status
                        )}`}
                      >
                        {ride.status?.replace("_", " ")}
                      </span>
                    </td>

                    <td className="min-w-64 space-y-2 px-5 py-4">

                      {ride.status === "REQUESTED" && (
                        <>
                          <select
                            value={selectedDriver[ride.rideId] || ""}
                            onChange={(e) =>
                              setSelectedDriver((previous) => ({
                                ...previous,
                                [ride.rideId]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs"
                          >
                            <option value="">Select available driver</option>

                            {availableDrivers.map((driver) => (
                              <option
                                key={driver.userId}
                                value={driver.userId}
                              >
                                {driver.name}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() =>
                              handleAssignDriver(ride.rideId)
                            }
                            disabled={availableDrivers.length === 0}
                            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                          >
                            Assign Driver
                          </button>
                        </>
                      )}

                      {ride.status === "ACCEPTED" && (
                        <button
                          onClick={() =>
                            handleStartRide(ride.rideId)
                          }
                          className="w-full rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white"
                        >
                          Start Trip
                        </button>
                      )}

                      {ride.status === "IN_PROGRESS" && (
                        <>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Enter fare (₱)"
                            value={fareValues[ride.rideId] || ""}
                            onChange={(e) =>
                              setFareValues((previous) => ({
                                ...previous,
                                [ride.rideId]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                          />

                          <button
                            onClick={() =>
                              handleCompleteRide(ride.rideId)
                            }
                            className="w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white"
                          >
                            Complete Trip
                          </button>
                        </>
                      )}

                      {["REQUESTED", "ACCEPTED"].includes(ride.status) && (
                        <button
                          onClick={() =>
                            handleCancelRide(ride.rideId)
                          }
                          className="w-full rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Cancel Ride
                        </button>
                      )}

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Ride Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Book a Ride
              </h2>

              <button
                onClick={() => setShowBookingForm(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleBookRide} className="space-y-4 p-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Passenger
                </label>

                <select
                  name="passengerId"
                  value={bookingData.passengerId}
                  onChange={handleBookingChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                >
                  <option value="">Select passenger</option>

                  {passengers.map((passenger) => (
                    <option
                      key={passenger.userId}
                      value={passenger.userId}
                    >
                      {passenger.name} ({passenger.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Pickup Location
                </label>

                <select
                  name="pickupLocationId"
                  value={bookingData.pickupLocationId}
                  onChange={handleBookingChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                >
                  <option value="">Select pickup location</option>

                  {locations.map((location) => (
                    <option
                      key={location.locationId}
                      value={location.locationId}
                    >
                      {location.address}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Destination
                </label>

                <select
                  name="destinationLocationId"
                  value={bookingData.destinationLocationId}
                  onChange={handleBookingChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                >
                  <option value="">Select destination</option>

                  {locations.map((location) => (
                    <option
                      key={location.locationId}
                      value={location.locationId}
                    >
                      {location.address}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default RideManagement;