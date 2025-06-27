import { useState, useEffect } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useNavigate } from "react-router-dom";

function SpotList({ refreshKey }) {
  const [spots, setSpots] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchSpots = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${API_BASE_URL}${ENDPOINTS.spots}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to get spots");
        return response.json();
      })
      .then(setSpots)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchSpots();
  }, [refreshKey]);

  const handleUnbook = (spotId) => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}${ENDPOINTS.tickets}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            throw new Error("Please log in again");
          }
          throw new Error("Failed to get tickets");
        }
        return response.json();
      })
      .then((tickets) => {
        const activeTicket = tickets.find((t) => t.spot_id === spotId && !t.check_out);
        if (!activeTicket) {
          setError("No active ticket for this spot");
          return;
        }
        fetch(`${API_BASE_URL}${ENDPOINTS.checkout}/${activeTicket.id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
                throw new Error("Please log in again");
              }
              return response.json().then((data) => {
                throw new Error(data.error || "Failed to check out");
              });
            }
            return response.json();
          })
          .then(() => {
            alert("Spot checked out!");
            fetchSpots();
          })
          .catch((err) => setError(err.message));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="mt-4 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Parking Spots</h2>
      {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}
      {spots.length === 0 ? (
        <p className="text-gray-500">No spots available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className={`p-2 border border-gray-200 rounded-md ${spot.status === "available" ? "bg-green-50" : "bg-red-50"}`}
            >
              <p className="text-lg font-semibold text-gray-800">Spot #{spot.spot_number}</p>
              <p className="text-gray-600">
                Status: <span className={spot.status === "available" ? "text-green-600" : "text-red-600"}>
                  {spot.status === "available" ? "Available" : "Occupied"}
                </span>
              </p>
              <p className="text-gray-600">Lot: {spot.lot}</p>
              {spot.status === "occupied" && (
                <button
                  onClick={() => handleUnbook(spot.id)}
                  className="mt-2 bg-gray-700 text-white py-1 px-2 rounded hover:bg-gray-800 transition"
                >
                  Check Out
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpotList;