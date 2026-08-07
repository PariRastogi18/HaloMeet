import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LandingPage from "./LandingPage";

function Dashboard() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { user, logout, accessToken } = useAuth();

  const handleLogout = async () => {
    try {
      const token = accessToken;
      const BACKEND_LOGOUT_URL = `${API}/api/auth/logout`;

      await fetch(BACKEND_LOGOUT_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      logout();
      navigate("/signIn");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
            {user && (
              <p className="text-zinc-400 mt-2">
                Welcome,{" "}
                <span className="text-purple-400">
                  {user.username || user.email}
                </span>
                !
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
