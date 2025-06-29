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
            <div className="dashboard-container">
              <div className="dashboard-header">
                SafeSpot Parking Dashboard
              </div>
              <a href="#" className="logout-btn" onClick={logout}>
                Logout
              </a>
              <VehicleForm triggerRefresh={triggerRefresh} className="card" />
              <VehicleList refreshKey={refreshKey} className="card" />
              <BookingForm triggerRefresh={triggerRefresh} className="card" />
              <SpotList refreshKey={refreshKey} className="spot-grid card" />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;