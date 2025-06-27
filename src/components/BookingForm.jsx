import { useState, useEffect } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function BookingForm() {
  const [vehicles, setVehicles] = useState([]);
  const [spots, setSpots] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [parkingSpotId, setParkingSpotId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Fetch vehicles
    fetch(`${API_BASE_URL}${ENDPOINTS.vehicles}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch vehicles");
        return r.json();
      })
      .then(setVehicles)
      .catch((err) => setError(err.message));

    // Fetch spots
    fetch(`${API_BASE_URL}${ENDPOINTS.spots}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch spots");
        return r.json();
      })
      .then((data) => setSpots(data.filter((spot) => spot.status === "available")))
      .catch((err) => setError(err.message));
  }, [logout, navigate]);

  const handleBooking = async () => {
    if (!vehicleId || !parkingSpotId) {
      setError("Please select a vehicle and parking spot");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.tickets}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicle_id: parseInt(vehicleId), parking_spot_id: parseInt(parkingSpotId) }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          logout();
          navigate("/");
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(data.error || "Failed to book spot");
      }
      const data = await res.json();
      alert(`Spot booked successfully! Ticket ID: ${data.ticket_id}`);
      setVehicleId("");
      setParkingSpotId("");
      // Refresh spots
      fetch(`${API_BASE_URL}${ENDPOINTS.spots}`)
        .then((r) => r.json())
        .then((data) => setSpots(data.filter((spot) => spot.status === "available")));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Book a Parking Spot</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <select
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select Vehicle</option>
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.plate_number} ({v.type || "Unknown"})
          </option>
        ))}
      </select>
      <select
        value={parkingSpotId}
        onChange={(e) => setParkingSpotId(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select Parking Spot</option>
        {spots.map((s) => (
          <option key={s.id} value={s.id}>
            {s.spot_number} ({s.lot})
          </option>
        ))}
      </select>
      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Booking..." : "Book Spot"}
      </button>
    </div>
  );
}