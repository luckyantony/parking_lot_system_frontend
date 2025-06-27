import { useState, useEffect } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useNavigate } from "react-router-dom";

function BookingForm({ triggerRefresh }) {
  const [vehicles, setVehicles] = useState([]);
  const [spots, setSpots] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [parkingSpotId, setParkingSpotId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${API_BASE_URL}${ENDPOINTS.vehicles}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to get vehicles");
        return response.json();
      })
      .then(setVehicles)
      .catch((err) => setError(err.message));

    fetch(`${API_BASE_URL}${ENDPOINTS.spots}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to get spots");
        return response.json();
      })
      .then((data) => setSpots(data.filter((spot) => spot.status === "available")))
      .catch((err) => setError(err.message));
  }, [navigate]);

  const handleBooking = () => {
    if (!vehicleId || !parkingSpotId) {
      setError("Select a vehicle and spot");
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}${ENDPOINTS.tickets}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vehicle_id: parseInt(vehicleId), parking_spot_id: parseInt(parkingSpotId) }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            throw new Error("Please log in again");
          }
          return response.json().then((data) => {
            throw new Error(data.error || "Failed to book spot");
          });
        }
        return response.json();
      })
      .then((data) => {
        alert(`Spot booked! Ticket ID: ${data.ticket_id}`);
        setVehicleId("");
        setParkingSpotId("");
        fetch(`${API_BASE_URL}${ENDPOINTS.spots}`)
          .then((r) => r.json())
          .then((data) => setSpots(data.filter((spot) => spot.status === "available")))
          .then(() => triggerRefresh());
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-2">Book a Spot</h2>
      {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-gray-700 mb-1">Select Vehicle</label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Choose a Vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate_number} ({v.type || "No Type"})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Select Spot</label>
          <select
            value={parkingSpotId}
            onChange={(e) => setParkingSpotId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Choose a Spot</option>
            {spots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.spot_number} ({s.lot})
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleBooking}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
      >
        Book Spot
      </button>
    </div>
  );
}

export default BookingForm;