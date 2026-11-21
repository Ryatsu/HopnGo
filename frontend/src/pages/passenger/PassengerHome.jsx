
import { CarFront, MapPin, ShieldCheck } from "lucide-react";

function PassengerHome() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">

      <div>
        <p className="font-semibold text-blue-600">
          WELCOME TO HOP'NGO
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          Your ride,
          <span className="text-blue-600"> your way.</span>
        </h1>

        <p className="mt-5 max-w-lg leading-7 text-slate-500">
          Book a ride, choose your destination, and let Hop'nGo
          take you where you need to go.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="text-blue-600" />
            <span className="text-slate-700">
              Convenient pickup and destination selection
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CarFront className="text-blue-600" />
            <span className="text-slate-700">
              Driver assignment and ride tracking
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="text-blue-600" />
            <span className="text-slate-700">
              Simple and convenient ride management
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <CarFront size={28} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Book a Ride
            </h2>
            <p className="text-sm text-slate-500">
              Your next journey starts here.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Pickup Location
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3">
              <MapPin size={18} className="text-green-600" />
              <span className="text-sm text-slate-400">
                Pickup location will appear here
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Destination
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3">
              <MapPin size={18} className="text-red-500" />
              <span className="text-sm text-slate-400">
                Destination will appear here
              </span>
            </div>
          </div>

          <p className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            Booking functionality will be connected to your
            Spring Boot backend in a later step.
          </p>
        </div>
      </div>

    </div>
  );
}

export default PassengerHome;
