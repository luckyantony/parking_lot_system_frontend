import { useEffect, useState } from "react";

const BASE_URL = "https://parking-lot-system-3g7g.onrender.com/api/";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border p-2 rounded">
            <strong>{user.username}</strong> ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
