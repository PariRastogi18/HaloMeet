import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, LockKeyhole } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const BACKEND_URL = "http://localhost:5000/api/auth/sendOtp";
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
        credentials: "include",
      });
      if (response.ok) {
        navigate("/verifyOtp", {
          state: email,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#09090B] via-[#111827] to-[#1E1B4B] flex items-center justify-center px-4">
      {/* Background Blur */}
      <div className="absolute w-80 h-80 bg-purple-700/30 blur-[120px] rounded-full top-20 left-20"></div>
      <div className="absolute w-80 h-80 bg-fuchsia-700/20 blur-[120px] rounded-full bottom-10 right-10"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-purple-500/20 bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-600 flex items-center justify-center">
            <LockKeyhole className="text-white" size={30} />
          </div>

          <h1 className="text-3xl font-bold text-center text-white mt-6">
            Forgot Password?
          </h1>

          <p className="text-gray-400 text-center mt-3">
            Enter your registered email address and we'll send you a password
            reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm">Email Address</label>

              <div className="mt-2 flex items-center bg-zinc-900 border border-zinc-700 rounded-xl px-4">
                <Mail size={20} className="text-purple-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-3 py-4 text-white outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold text-white"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back */}
          <div className="mt-8 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <ArrowLeft size={18} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
