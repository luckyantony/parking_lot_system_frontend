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
    <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-2">Your Vehicles</h2>
      {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}
      {vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles added yet.</p>
      ) : (
        <ul className="space-y-2">
          {vehicles.map((v) => (
            <li
              key={v.id}
              className="border p-2 bg-gray-100 rounded-md"
            >
              <span className="font-semibold text-gray-800">{v.plate_number}</span> - {v.type || "No Type"}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={fetchVehicles}
        className="mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
      >
        Refresh
      </button>
    </div>
  );
}

export default VehicleList;