import { useEffect, useState } from "react";
import {
  CarFront,
  Plus,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

import {
  getAllDrivers,
  createDriver,
} from "../../services/driverService";

function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    licenseNo: "",
    rating: "5.0",
    available: true,
  });

  // Fetch all drivers
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllDrivers();
      setDrivers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load driver records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Register driver
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const driverData = {
        ...formData,
        rating: Number(formData.rating),
        available: true,
      };

      await createDriver(driverData);

      setSuccess("Driver registered successfully!");

      setFormData({
        name: "",
        phone: "",
        email: "",
        licenseNo: "",
        rating: "5.0",
        available: true,
      });

      setShowForm(false);

      await fetchDrivers();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to register driver."
      );
    }
  };

  // Filter drivers
  const filteredDrivers = drivers.filter((driver) => {
    if (filter === "AVAILABLE") return driver.available === true;
    if (filter === "UNAVAILABLE") return driver.available === false;

    return true;
  });

  const availableCount = drivers.filter(
    (driver) => driver.available === true
  ).length;

  const unavailableCount = drivers.filter(
    (driver) => driver.available === false
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Drivers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage registered Hop'nGo drivers.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Driver
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
      <div className="grid gap-5 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <CarFront className="text-blue-600" size={25} />
          <p className="mt-3 text-sm text-slate-500">
            Total Drivers
          </p>
          <h2 className="text-2xl font-bold">
            {drivers.length}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle className="text-green-600" size={25} />
          <p className="mt-3 text-sm text-slate-500">
            Available Drivers
          </p>
          <h2 className="text-2xl font-bold">
            {availableCount}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Clock className="text-orange-600" size={25} />
          <p className="mt-3 text-sm text-slate-500">
            Unavailable Drivers
          </p>
          <h2 className="text-2xl font-bold">
            {unavailableCount}
          </h2>
        </div>

      </div>

      {/* Driver Records */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">

          <h2 className="font-semibold text-slate-900">
            Driver Records
          </h2>

          <div className="flex flex-wrap items-center gap-2">

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ALL">All Drivers</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>

            <button
              onClick={fetchDrivers}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading drivers...
          </p>
        ) : filteredDrivers.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No driver records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Driver Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">License No.</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Availability</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.userId}>

                    <td className="px-6 py-4">
                      {driver.userId}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      {driver.name}
                    </td>

                    <td className="px-6 py-4">
                      {driver.phone}
                    </td>

                    <td className="px-6 py-4">
                      {driver.email}
                    </td>

                    <td className="px-6 py-4">
                      {driver.licenseNo}
                    </td>

                    <td className="px-6 py-4">
                      {driver.rating}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          driver.available
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {driver.available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Add Driver Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Register Driver
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
                  placeholder="Enter driver name"
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
                  License Number
                </label>

                <input
                  type="text"
                  name="licenseNo"
                  value={formData.licenseNo}
                  onChange={handleChange}
                  placeholder="Enter driver's license number"
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
                  Register Driver
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default DriverManagement;