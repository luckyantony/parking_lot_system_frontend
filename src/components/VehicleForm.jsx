import { useState } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function VehicleForm({ onAddVehicle }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!plateNumber) {
      setError("Plate number is required");
      return;
    }

    const newVehicle = { plate_number: plateNumber, type: type || null };
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.vehicles}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVehicle),
      });
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          logout();
          navigate("/");
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(data.error || "Failed to add vehicle");
      }
      const data = await res.json();
      onAddVehicle(data);
      setPlateNumber("");
      setType("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Register Vehicle</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Plate Number (e.g., KCN123X)"
        className="w-full mb-2 p-2 border rounded"
        value={plateNumber}
        onChange={(e) => setPlateNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Vehicle Type (e.g., SUV)"
        className="w-full mb-4 p-2 border rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}