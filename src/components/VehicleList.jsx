import { useEffect, useState } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${API_BASE_URL}${ENDPOINTS.vehicles}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) {
          if (r.status === 401) {
            logout();
            navigate("/");
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error("Failed to fetch vehicles");
        }
        return r.json();
      })
      .then(setVehicles)
      .catch((err) => setError(err.message));
  }, [logout, navigate]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Vehicle List</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles registered.</p>
      ) : (
        <ul className="space-y-2">
          {vehicles.map((v) => (
            <li key={v.id} className="border p-2 rounded">
              <strong>{v.plate_number}</strong> - {v.type || "Unknown Type"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}