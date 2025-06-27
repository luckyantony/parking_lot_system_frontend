import React from 'react';

const API_URL = 'https://parking-lot-system-3g7g.onrender.com/';

export default function SpotsList({ spots, onUnbook }) {
  if (!spots || spots.length === 0) {
    return <p className="text-center text-gray-500">No parking spots available.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {spots.map((spot) => (
        <div
          key={spot.id}
          className={`p-4 rounded shadow border ${
            spot.is_available ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
          }`}
        >
          <p className="font-semibold text-lg">Slot #{spot.slot_number}</p>
          <p className="text-sm mb-1">
            Status:{' '}
            <span className={spot.is_available ? 'text-green-600' : 'text-red-600'}>
              {spot.is_available ? 'Available' : 'Occupied'}
            </span>
          </p>
          {!spot.is_available && (
            <>
              <p className="text-sm">Vehicle: {spot.vehicle_number}</p>
              {/* Optional: Show timestamp if backend supports it */}
              {/* <p className="text-xs text-gray-600">Checked in: {spot.checked_in_at}</p> */}
              <button
                onClick={() => onUnbook(spot.id)}
                className="mt-2 bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
              >
                Unbook / Check-out
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
