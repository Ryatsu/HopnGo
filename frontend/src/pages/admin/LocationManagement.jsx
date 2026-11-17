import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  RefreshCw,
  X,
  MapPinned,
} from "lucide-react";

import {
  getAllLocations,
  createLocation,
} from "../../services/locationService";

function LocationManagement() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    latitude: "",
    longitude: "",
  });

  // Fetch locations from Spring Boot
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load location records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Register a location
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const locationData = {
        address: formData.address,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      await createLocation(locationData);

      setSuccess("Location registered successfully!");

      setFormData({
        address: "",
        latitude: "",
        longitude: "",
      });

      setShowForm(false);

      await fetchLocations();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to register location."
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Locations
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage pickup and destination locations.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Location
        </button>
      </div>

      {/* Success and Error Messages */}
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
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <MapPin size={25} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Locations
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              {locations.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Location Records */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">
            Location Records
          </h2>

          <button
            onClick={fetchLocations}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading locations...
          </p>
        ) : locations.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No location records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Latitude</th>
                  <th className="px-6 py-4">Longitude</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {locations.map((location) => (
                  <tr key={location.locationId}>

                    <td className="px-6 py-4">
                      {location.locationId}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="text-blue-600"
                        />
                        {location.address}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {location.latitude}
                    </td>

                    <td className="px-6 py-4">
                      {location.longitude}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Add Location Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Register Location
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter location address"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Latitude
                </label>

                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Example: 10.3157"
                  min="-90"
                  max="90"
                  step="any"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Longitude
                </label>

                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Example: 123.8854"
                  min="-180"
                  max="180"
                  step="any"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                <MapPinned size={18} className="mb-2" />
                Enter the geographic coordinates of this location.
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Register Location
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default LocationManagement;