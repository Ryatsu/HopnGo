import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CarFront,
  MapPin,
  CarTaxiFront,
  Wallet,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { name: "Passengers", path: "/admin/passengers", icon: Users },
  { name: "Drivers", path: "/admin/drivers", icon: CarFront },
  { name: "Locations", path: "/admin/locations", icon: MapPin },
  { name: "Rides", path: "/admin/rides", icon: CarTaxiFront },
  { name: "Payments", path: "/admin/payments", icon: Wallet },
];

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">

      {/* Sidebar */}
      <aside className="w-full bg-slate-900 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-2xl font-bold text-blue-400">
            Hop'nGo
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 p-4 md:mt-8">
          <NavLink
            to="/passenger"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
          >
            <LogOut size={19} />
            Passenger View
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">
              Hop'nGo Management
            </h2>
            <p className="text-xs text-slate-500">
              Ride-hailing system
            </p>
          </div>

          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Administrator
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default AdminLayout;