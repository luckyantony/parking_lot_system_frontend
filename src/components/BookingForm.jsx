import { useState } from 'react';

const API_URL = 'https://parking-lot-system-3g7g.onrender.com';

export default function BookingForm({ onBook }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!vehicleNumber) return alert('Please enter your vehicle number');

    setLoading(true);
    try {
      await onBook(vehicleNumber);
      setVehicleNumber('');
    } catch (err) {
      console.error(err);
      alert('Failed to book spot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Check-in Vehicle</h2>
      <input
        type="text"
        placeholder="Vehicle Number (e.g. KDA123A)"
        className="border p-2 rounded w-full mb-2"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
      />
      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Booking...' : 'Assign to Spot'}
      </button>
    </div>
  );
}

