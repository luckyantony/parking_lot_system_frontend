import AuthForm from "../components/AuthForm";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

function Home() {
  const { token } = useAuth();

  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto my-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome to SafeSpot Parking</h1>
        <AuthForm />
      </div>
    </div>
  );
}

export default Home;