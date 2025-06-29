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
    <div className="card">
      <h2>Add Vehicle</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="form-group">
        <label>Plate Number</label>
        <input
          type="text"
          placeholder="e.g., KCN123X"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Vehicle Type</label>
        <input
          type="text"
          placeholder="e.g., SUV"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
      <button className="primary-btn" onClick={handleSubmit}>
        Add Vehicle
      </button>
    </div>
  );
}

export default VehicleForm;