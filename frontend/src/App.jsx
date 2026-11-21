
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import PassengerLayout from "./layouts/PassengerLayout";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApiTest from "./pages/admin/ApiTest";
import PassengerManagement from "./pages/admin/PassengerManagement";
import DriverManagement from "./pages/admin/DriverManagement";
import LocationManagement from "./pages/admin/LocationManagement";
import RideManagement from "./pages/admin/RideManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";

// Passenger pages
import PassengerHome from "./pages/passenger/PassengerHome";
import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import BookRide from "./pages/passenger/BookRide";
import MyRides from "./pages/passenger/MyRides";
import PaymentHistory from "./pages/passenger/PaymentHistory";
import PassengerProfile from "./pages/passenger/PassengerProfile";

// Driver pages
import DriverLayout from "./layouts/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import RideRequests from "./pages/driver/RideRequests";
import MyTrips from "./pages/driver/MyTrips";
import DriverProfile from "./pages/driver/DriverProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default page */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="passengers" element={<PassengerManagement />} />
          <Route path="drivers" element={<DriverManagement />} />
          <Route path="locations" element={<LocationManagement />} />
          <Route path="rides" element={<RideManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
        </Route>

        {/* API Test */}
        <Route path="/api-test" element={<ApiTest />} />

        {/* Passenger routes */}
        <Route path="/passenger" element={<PassengerLayout />}>
          <Route index element={<PassengerHome />} />
          <Route path="dashboard" element={<PassengerDashboard />} />
          <Route path="book-ride" element={<BookRide />} />
          <Route path="my-rides" element={<MyRides />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="profile" element={<PassengerProfile />} />
        </Route>

        {/* Driver routes */}
        <Route path="/driver" element={<DriverLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="requests" element={<RideRequests />} />
          <Route path="my-trips" element={<MyTrips />} />
          <Route path="profile" element={<DriverProfile />} />
        </Route>

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/admin" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
