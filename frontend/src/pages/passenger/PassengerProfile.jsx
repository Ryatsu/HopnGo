import { useEffect, useState } from "react";
import { UserRound, Mail, Phone, Star, Save } from "lucide-react";
import {
  getPassengerById,
  updatePassenger,
} from "../../services/passengerService";

function PassengerProfile() {
  const passengerId = 1; // Temporary passenger ID

  const [passenger, setPassenger] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPassengerById(passengerId);

        setPassenger(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load passenger profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedPassenger = await updatePassenger(passengerId, {
        ...formData,
        rating: passenger.rating,
      });

      setPassenger(updatedPassenger);
      setMessage("Your profile has been updated successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!passenger) {
    return (
      <div className="rounded-lg bg-red-50 p-5 text-red-600">
        {error || "Passenger profile not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Profile
        </h1>
        <p className="mt-1 text-slate-500">
          View and manage your personal information.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <UserRound size={32} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {passenger.name}
            </h2>
            <p className="text-sm text-slate-500">
              Passenger ID: #{passenger.userId}
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-lg bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <Star className="fill-amber-400 text-amber-400" />
            <div>
              <p className="font-medium text-slate-800">
                Passenger Rating
              </p>
              <p className="text-xs text-slate-500">
                Your current rating
              </p>
            </div>
          </div>

          <span className="text-xl font-bold text-amber-600">
            {Number(passenger.rating).toFixed(1)} / 5.0
          </span>
        </div>

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PassengerProfile;