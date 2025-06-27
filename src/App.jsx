import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth } from "./AuthContext";
import SpotList from "./components/SpotList";
import VehicleList from "./components/VehicleList";
import VehicleForm from "./components/VehicleForm";
import BookingForm from "./components/BookingForm";
import UserProfile from "./components/UserProfile";
import { Navigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const { token, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);

  const handleAddVehicle = (newVehicle) => {
    setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
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
            <div className="p-4 max-w-7xl mx-auto">
              <button
                onClick={logout}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UserProfile />
                <VehicleForm onAddVehicle={handleAddVehicle} />
                <VehicleList vehicles={vehicles} setVehicles={setVehicles} />
                <BookingForm />
                <SpotList />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;