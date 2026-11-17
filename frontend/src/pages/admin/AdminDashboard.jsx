
import {
  Users,
  CarFront,
  CarTaxiFront,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

const statistics = [
  {
    title: "Total Passengers",
    value: "0",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Drivers",
    value: "0",
    icon: CarFront,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Total Rides",
    value: "0",
    icon: CarTaxiFront,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Total Payments",
    value: "₱0.00",
    icon: Wallet,
    color: "bg-orange-100 text-orange-600",
  },
];

function AdminDashboard() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome to your Hop'nGo administration dashboard.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-3 ${item.color}`}>
                  <Icon size={23} />
                </div>

                <ArrowUpRight className="text-slate-400" size={20} />
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Activity
        </h2>

        <div className="mt-6 py-10 text-center">
          <CarTaxiFront
            size={40}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 font-medium text-slate-600">
            No recent rides yet
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Ride activity will appear here once data is connected.
          </p>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
