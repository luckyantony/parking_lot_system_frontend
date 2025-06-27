import { createContext, useContext, useState } from "react";
import { API_BASE_URL, ENDPOINTS } from "./config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const register = (username, email, password) => {
    return fetch(`${API_BASE_URL}${ENDPOINTS.register}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Registration failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      });
  };

  const login = (email, password) => {
    return fetch(`${API_BASE_URL}${ENDPOINTS.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Login failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);