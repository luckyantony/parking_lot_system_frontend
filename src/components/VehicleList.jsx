import { useEffect, useState } from "react";

const BASE_URL = "https://parking-lot-system-3g7g.onrender.com/";

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Vehicle List</h2>
      <ul className="space-y-2">
        {vehicles.map((v) => (
          <li key={v.id} className="border p-2 rounded">
            <strong>{v.plate_number}</strong> - {v.vehicle_type} (Owner: {v.owner_name})
          </li>
        ))}
      </ul>
    </div>
  );
}
