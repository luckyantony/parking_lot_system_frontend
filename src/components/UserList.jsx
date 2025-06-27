import { useEffect, useState } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${API_BASE_URL}${ENDPOINTS.me}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) {
          if (r.status === 401) {
            logout();
            navigate("/");
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error("Failed to fetch user profile");
        }
        return r.json();
      })
      .then(setUser)
      .catch((err) => setError(err.message));
  }, [logout, navigate]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user ? (
        <div className="border p-2 rounded">
          <strong>{user.username}</strong> ({user.email})
        </div>
      ) : (
        <p className="text-gray-500">Loading user profile...</p>
      )}
    </div>
  );
}