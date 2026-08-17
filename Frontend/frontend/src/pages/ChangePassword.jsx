import { useState } from "react";
import { LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

export default function ResetPassword() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state;
  if (!email) {
    return <Navigate to={"/forgotPassword"} replace />;
  }

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API}/api/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/signin");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#09090B] via-[#111827] to-[#1A1038] flex items-center justify-center px-4 sm:px-6 py-8 selection:bg-purple-600 selection:text-white">
      {/* Background Glow */}
      <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-purple-700/20 blur-[100px] sm:blur-[150px] rounded-full top-0 left-0"></div>
      <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-fuchsia-700/20 blur-[100px] sm:blur-[150px] rounded-full bottom-0 right-0"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-[#16131F]/90 backdrop-blur-xl border border-purple-500/20 p-6 sm:p-8 shadow-[0_0_60px_rgba(124,58,237,.25)]">
        <div className="flex justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-600 flex items-center justify-center">
            <ShieldCheck className="text-white" size={26} />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl text-center font-bold text-white mt-5 sm:mt-6">
          Reset Password
        </h1>

        <p className="text-center text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base px-2">
          Create a strong password for your HaloMeet account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 sm:mt-8 space-y-5 sm:space-y-6"
        >
          {/* New Password */}
          <div>
            <label className="text-gray-300 text-sm sm:text-base">
              New Password
            </label>
            <div className="mt-2 flex items-center rounded-xl bg-[#23212d] border border-purple-500/20 px-3 sm:px-4">
              <LockKeyhole className="text-purple-400 shrink-0" size={18} />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 min-w-0 bg-transparent px-3 sm:px-4 py-3 sm:py-4 text-white outline-none text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="shrink-0"
              >
                {showNew ? (
                  <EyeOff className="text-gray-400" size={18} />
                ) : (
                  <Eye className="text-gray-400" size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-300 text-sm sm:text-base">
              Confirm Password
            </label>
            <div className="mt-2 flex items-center rounded-xl bg-[#23212d] border border-purple-500/20 px-3 sm:px-4">
              <LockKeyhole className="text-purple-400 shrink-0" size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 min-w-0 bg-transparent px-3 sm:px-4 py-3 sm:py-4 text-white outline-none text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="shrink-0"
              >
                {showConfirm ? (
                  <EyeOff className="text-gray-400" size={18} />
                ) : (
                  <Eye className="text-gray-400" size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-3.5 sm:py-4 rounded-xl text-white font-semibold text-sm sm:text-base"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
