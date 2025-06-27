import { useState, useEffect } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function SpotList() {
  const [spots, setSpots] = useState([]);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${API_BASE_URL}${ENDPOINTS.spots}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch spots");
        return r.json();
      })
      .then(setSpots)
      .catch((err) => setError(err.message));
  }, [navigate]);

  const handleUnbook = async (spotId) => {
    const token = localStorage.getItem("token");
    try {
      // Fetch tickets to find the active ticket for this spot
      const resTickets = await fetch(`${API_BASE_URL}${ENDPOINTS.tickets}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resTickets.ok) {
        if (resTickets.status === 401) {
          logout();
          navigate("/");
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to fetch tickets");
      }
      const tickets = await resTickets.json();
      const activeTicket = tickets.find(
        (t) => t.spot_id === spotId && !t.check_out
      );
      if (!activeTicket) {
        setError("No active ticket found for this spot");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}${ENDPOINTS.checkout}/${activeTicket.id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          logout();
          navigate("/");
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(data.error || "Failed to check out");
      }
      alert("Spot checked out successfully!");
      // Refresh spots
      fetch(`${API_BASE_URL}${ENDPOINTS.spots}`)
        .then((r) => r.json())
        .then(setSpots);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {error && <p className="text-red-500">{error}</p>}
      {spots.length === 0 ? (
        <p className="text-center text-gray-500">No parking spots available.</p>
      ) : (
        spots.map((spot) => (
          <div
            key={spot.id}
            className={`p-4 rounded shadow border ${
              spot.status === "available"
                ? "bg-green-100 border-green-400"
                : "bg-red-100 border-red-400"
            }`}
          >
            <p className="font-semibold text-lg">Spot #{spot.spot_number}</p>
            <p className="text-sm mb-1">
              Status:{" "}
              <span
                className={
                  spot.status === "available" ? "text-green-600" : "text-red-600"
                }
              >
                {spot.status === "available" ? "Available" : "Occupied"}
              </span>
            </p>
            {spot.status === "occupied" && (
              <button
                onClick={() => handleUnbook(spot.id)}
                className="mt-2 bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
              >
                Check Out
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}