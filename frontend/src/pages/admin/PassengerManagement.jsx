import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";

import {
  getAllPassengers,
  createPassenger,
} from "../../services/passengerService";

function PassengerManagement() {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    rating: 5.0,
  });

  // Fetch passengers from Spring Boot
  const fetchPassengers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllPassengers();
      setPassengers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load passenger records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Register passenger
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const passengerData = {
        ...formData,
        rating: Number(formData.rating),
      };

      await createPassenger(passengerData);

      setSuccess("Passenger registered successfully!");

      setFormData({
        name: "",
        phone: "",
        email: "",
        rating: 5.0,
      });

      setShowForm(false);

      await fetchPassengers();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to register passenger."
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Passengers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage registered Hop'nGo passengers.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Passenger
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
            <Users size={25} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Passengers
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              {passengers.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Passenger Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">
            Passenger Records
          </h2>

          <button
            onClick={fetchPassengers}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading passengers...
          </p>
        ) : passengers.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No passenger records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rating</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {passengers.map((passenger) => (
                  <tr key={passenger.userId}>
                    <td className="px-6 py-4">
                      {passenger.userId}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      {passenger.name}
                    </td>

                    <td className="px-6 py-4">
                      {passenger.phone}
                    </td>

                    <td className="px-6 py-4">
                      {passenger.email}
                    </td>

                    <td className="px-6 py-4">
                      {passenger.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Passenger Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Register Passenger
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
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter passenger name"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Rating
                </label>

                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
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
                  Register Passenger
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default PassengerManagement;