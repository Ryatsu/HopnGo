import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, CarFront, ArrowLeft } from "lucide-react";
import { getAllLocations } from "../../services/locationService";
import { bookRide } from "../../services/rideService";

export default function BookRide() {
  const navigate = useNavigate();

  // Temporary passenger ID for development
  const passengerId = 1;

  const [locations, setLocations] = useState([]);
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [destinationLocationId, setDestinationLocationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        setLocations(data);
      } catch (err) {
        console.error("Failed to load locations:", err);
        setError("Unable to load locations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleBookRide = async (e) => {
    e.preventDefault();
    setError("");

    if (!pickupLocationId || !destinationLocationId) {
      setError("Please select both pickup and destination locations.");
      return;
    }

    if (pickupLocationId === destinationLocationId) {
      setError("Pickup and destination must be different.");
      return;
    }

    try {
      setSubmitting(true);

      await bookRide(
        passengerId,
        Number(pickupLocationId),
        Number(destinationLocationId)
      );

      alert("Ride booked successfully!");

      navigate("/passenger/my-rides");
    } catch (err) {
      console.error("Failed to book ride:", err);
      setError(
        err.response?.data?.message ||
        "Failed to book your ride. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate("/passenger")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            HOP'NGO PASSENGER
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Book a Ride
          </h1>
          <p className="mt-2 text-gray-500">
            Choose where your journey starts and where you want to go.
          </p>
        </div>

        <form
          onSubmit={handleBookRide}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="space-y-6">

            {/* Pickup Location */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin size={18} className="text-green-600" />
                Pickup Location
              </label>

              <select
                value={pickupLocationId}
                onChange={(e) => setPickupLocationId(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">
                  {loading ? "Loading locations..." : "Select pickup location"}
                </option>

                {locations.map((location) => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Navigation size={18} className="text-red-500" />
                Destination
              </label>

              <select
                value={destinationLocationId}
                onChange={(e) => setDestinationLocationId(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">
                  {loading ? "Loading locations..." : "Select destination"}
                </option>

                {locations.map((location) => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Route Preview */}
            {pickupLocationId && destinationLocationId && (
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="mb-3 text-sm font-semibold text-blue-800">
                  Your Route
                </p>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    {locations.find(
                      (location) =>
                        String(location.locationId) === pickupLocationId
                    )?.address}
                  </div>

                  <div className="ml-1.5 h-5 border-l-2 border-dashed border-blue-300" />

                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    {locations.find(
                      (location) =>
                        String(location.locationId) === destinationLocationId
                    )?.address}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {locations.length === 0 && !loading && !error && (
              <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
                No locations are available. Please contact the administrator.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || loading || locations.length < 2}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CarFront size={20} />
              {submitting ? "Booking Ride..." : "Confirm Booking"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}