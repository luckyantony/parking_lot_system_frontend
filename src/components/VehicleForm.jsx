import { useState } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useNavigate } from "react-router-dom";

function VehicleForm({ triggerRefresh }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!plateNumber) {
      setError("Plate number is required");
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}${ENDPOINTS.vehicles}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plate_number: plateNumber, type: type || null }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            throw new Error("Please log in again");
          }
          return response.json().then((data) => {
            throw new Error(data.error || "Failed to add vehicle");
          });
        }
        return response.json();
      })
      .then(() => {
        setPlateNumber("");
        setType("");
        setError("");
        alert("Vehicle added!");
        triggerRefresh();
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-2">Add Vehicle</h2>
      {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Plate Number</label>
          <input
            type="text"
            placeholder="e.g., KCN123X"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Vehicle Type</label>
          <input
            type="text"
            placeholder="e.g., SUV"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
      >
        Add Vehicle
      </button>
    </div>
  );
}

export default VehicleForm;