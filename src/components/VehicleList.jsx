import { useEffect, useState } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useNavigate } from "react-router-dom";

function VehicleList({ refreshKey }) {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchVehicles = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${API_BASE_URL}${ENDPOINTS.vehicles}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            throw new Error("Please log in again");
          }
          throw new Error("Failed to fetch vehicles");
        }
        return response.json();
      })
      .then(setVehicles)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchVehicles();
  }, [refreshKey]);

  return (
    <div className="card">
      <h2>Your Vehicles</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {vehicles.length === 0 ? (
        <p>No vehicles added yet.</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>{v.plate_number} - {v.type || "No Type"}</li>
          ))}
        </ul>
      )}
      <button className="secondary-btn" onClick={fetchVehicles}>
        Refresh
      </button>
    </div>
  );
}

export default VehicleList;