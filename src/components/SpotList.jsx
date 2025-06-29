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
    <div className="card">
      <h2>Parking Spots</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {spots.length === 0 ? (
        <p>No spots available.</p>
      ) : (
        <div className="spot-grid">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className={`spot-card ${spot.status === "available" ? "available" : "occupied"}`}
            >
              <p>Spot #{spot.spot_number}</p>
              <p>Status: {spot.status === "available" ? "Available" : "Occupied"}</p>
              <p>Lot: {spot.lot}</p>
              {spot.status === "occupied" && (
                <button className="checkout-btn" onClick={() => handleUnbook(spot.id)}>
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