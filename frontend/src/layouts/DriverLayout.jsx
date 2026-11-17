
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  CarFront,
  LayoutDashboard,
  ClipboardList,
  History,
  UserRound,
  ShieldCheck,
} from "lucide-react";

function DriverLayout() {
  const location = useLocation();

  const navLinks = [
    {
      name: "Dashboard",
      path: "/driver/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Ride Requests",
      path: "/driver/requests",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "My Trips",
      path: "/driver/my-trips",
      icon: <History size={18} />,
    },
    {
      name: "My Profile",
      path: "/driver/profile",
      icon: <UserRound size={18} />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/driver/dashboard" className="flex items-center gap-2">
            <CarFront className="text-blue-600" size={28} />
            <span className="text-2xl font-bold text-slate-900">
              Hop'nGo
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
              Driver
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <ShieldCheck size={18} />
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default DriverLayout;
