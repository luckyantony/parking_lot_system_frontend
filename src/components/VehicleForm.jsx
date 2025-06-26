import { useState } from "react";

const BASE_URL = "https://parking-lot-system-3g7g.onrender.com/";

export default function VehicleForm({ onAddVehicle }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const handleSubmit = async () => {
    const newVehicle = { plate_number: plateNumber, owner_name: ownerName, vehicle_type: vehicleType };
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newVehicle),
    });

    if (res.ok) {
      const data = await res.json();
      onAddVehicle(data);
      setPlateNumber("");
      setOwnerName("");
      setVehicleType("");
    } else {
      console.error("Failed to add vehicle");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Register Vehicle</h2>
      <input
        type="text"
        placeholder="Plate Number"
        className="w-full mb-2 p-2 border rounded"
        value={plateNumber}
        onChange={(e) => setPlateNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Owner Name"
        className="w-full mb-2 p-2 border rounded"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Vehicle Type"
        className="w-full mb-4 p-2 border rounded"
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}
