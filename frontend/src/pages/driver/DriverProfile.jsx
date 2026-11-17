
import { useEffect, useState } from "react";
import { User, Mail, Phone, ShieldCheck, Star, Save, Pencil, X } from "lucide-react";
import { getDriverById, updateDriver } from "../../services/driverService";

const DRIVER_ID = 2;

function DriverProfile() {
  const [driver, setDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDriver();
  }, []);

  const loadDriver = async () => {
    try {
      setLoading(true);
      const data = await getDriverById(DRIVER_ID);

      setDriver(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
      });
    } catch (err) {
      setError("Unable to load driver profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedData = {
        ...formData,
        licenseNo: driver.licenseNo,
        rating: driver.rating,
        available: driver.available,
      };

      const updatedDriver = await updateDriver(DRIVER_ID, updatedData);

      setDriver(updatedDriver);
      setFormData({
        name: updatedDriver.name || "",
        phone: updatedDriver.phone || "",
        email: updatedDriver.email || "",
      });

      setEditing(false);
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update driver profile."
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: driver.name || "",
      phone: driver.phone || "",
      email: driver.email || "",
    });
    setEditing(false);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading driver profile...
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || "Driver profile not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal and driver information.
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => {
              setEditing(true);
              setSuccess("");
              setError("");
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Notifications */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Driver Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User size={44} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              {driver.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">Driver ID: {driver.userId}</p>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700">
              <Star size={16} className="fill-yellow-500 text-yellow-500" />
              {Number(driver.rating).toFixed(1)} Rating
            </div>

            <div
              className={`mt-3 rounded-full px-3 py-1.5 text-sm font-medium ${
                driver.available
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {driver.available ? "Available" : "Currently Unavailable"}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">License Number</p>
                <p className="text-sm font-semibold text-gray-800">
                  {driver.licenseNo}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your contact details below.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Read-only Driver Information */}
            <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Driver License
                </label>
                <input
                  type="text"
                  value={driver.licenseNo || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Driver Rating
                </label>
                <input
                  type="text"
                  value={`${Number(driver.rating).toFixed(1)} / 5.0`}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                />
              </div>
            </div>

            {editing && (
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default DriverProfile;