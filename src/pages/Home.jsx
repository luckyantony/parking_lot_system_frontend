import AuthForm from "../components/AuthForm";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

function Home() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Welcome to SafeSpot
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          Reserve your perfect parking spot.
        </p>
        <AuthForm />
      </div>
    </div>
  );
}

export default Home;
