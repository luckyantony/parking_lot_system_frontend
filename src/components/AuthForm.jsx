import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const action = mode === "login" ? login(email, password) : register(username, email, password);
    action
      .then(() => navigate("/dashboard"))
      .catch((err) => setError(err.message));
  };

  return (
    <div className="text-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {mode === "login" ? "Log In" : "Register"}
      </h2>
      {error && <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
            />
          </div>
        )}
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {mode === "login" ? "Log In" : "Register"}
        </button>
        <p className="text-center mt-2 text-gray-600">
          {mode === "login" ? "Need an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-indigo-500 ml-1 hover:text-indigo-700"
          >
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;