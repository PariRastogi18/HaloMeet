import { useState } from "react";
import { LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

export default function ResetPassword() {
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
      const response = await fetch(
        "http://localhost:5000/api/auth/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password: newPassword,
          }),
        },
      );

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
    <div className="min-h-screen bg-linear-to-br from-[#09090B] via-[#111827] to-[#1A1038] flex items-center justify-center px-6">
      {/* Background Glow */}

      <div className="absolute w-96 h-96 bg-purple-700/20 blur-[150px] rounded-full top-0 left-0"></div>

      <div className="absolute w-96 h-96 bg-fuchsia-700/20 blur-[150px] rounded-full bottom-0 right-0"></div>

      {/* Card */}

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#16131F]/90 backdrop-blur-xl border border-purple-500/20 p-8 shadow-[0_0_60px_rgba(124,58,237,.25)]">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
            <ShieldCheck className="text-white" size={30} />
          </div>
        </div>

        <h1 className="text-3xl text-center font-bold text-white mt-6">
          Reset Password
        </h1>

        <p className="text-center text-gray-400 mt-3">
          Create a strong password for your HaloMeet account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* New Password */}

          <div>
            <label className="text-gray-300">New Password</label>

            <div className="mt-2 flex items-center rounded-xl bg-[#23212d] border border-purple-500/20 px-4">
              <LockKeyhole className="text-purple-400" size={20} />

              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 bg-transparent px-4 py-4 text-white outline-none"
              />

              <button type="button" onClick={() => setShowNew(!showNew)}>
                {showNew ? (
                  <EyeOff className="text-gray-400" />
                ) : (
                  <Eye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}

          <div>
            <label className="text-gray-300">Confirm Password</label>

            <div className="mt-2 flex items-center rounded-xl bg-[#23212d] border border-purple-500/20 px-4">
              <LockKeyhole className="text-purple-400" size={20} />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent px-4 py-4 text-white outline-none"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeOff className="text-gray-400" />
                ) : (
                  <Eye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-4 rounded-xl text-white font-semibold"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
