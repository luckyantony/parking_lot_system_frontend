import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth } from "./AuthContext";
// import SpotList from "./components/SpotList";
import { Navigate } from "react-router-dom";

function App() {
  const { token, logout } = useAuth();

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="p-4">
              <button
                onClick={logout}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
              {/* <SpotList /> */}
            </div>
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
