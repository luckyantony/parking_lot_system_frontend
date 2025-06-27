import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth } from "./AuthContext";
import SpotList from "./components/SpotList";
import VehicleList from "./components/VehicleList";
import VehicleForm from "./components/VehicleForm";
import BookingForm from "./components/BookingForm";
import { Navigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const { token, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={logout}
                  className="text-indigo-500 hover:text-indigo-700"
                >
                  Logout
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">SafeSpot Parking Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
                <VehicleForm triggerRefresh={triggerRefresh} />
                <VehicleList refreshKey={refreshKey} />
                <BookingForm triggerRefresh={triggerRefresh} />
                <SpotList refreshKey={refreshKey} />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;