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
    <div className="min-h-screen bg-linear-to-br from-[#09090B] via-[#111827] to-[#1E1B4B] flex items-center justify-center px-4 py-8 overflow-hidden selection:bg-purple-600 selection:text-white">
      {/* Background Blur */}
      <div className="absolute w-40 h-40 sm:w-80 sm:h-80 bg-purple-700/30 blur-[80px] sm:blur-[120px] rounded-full top-10 left-5 sm:top-20 sm:left-20"></div>
      <div className="absolute w-40 h-40 sm:w-80 sm:h-80 bg-fuchsia-700/20 blur-[80px] sm:blur-[120px] rounded-full bottom-5 right-5 sm:bottom-10 sm:right-10"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="rounded-2xl sm:rounded-3xl border border-purple-500/20 bg-white/5 backdrop-blur-xl p-5 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          {/* Icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-purple-600 flex items-center justify-center">
            <LockKeyhole className="text-white" size={26} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mt-5 sm:mt-6">
            Forgot Password?
          </h1>

          <p className="text-gray-400 text-sm sm:text-base text-center mt-2 sm:mt-3 px-1">
            Enter your registered email address and we'll send you a password
            reset link.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-8 space-y-5 sm:space-y-6"
          >
            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm">Email Address</label>

              <div className="mt-2 flex items-center bg-zinc-900 border border-zinc-700 rounded-xl px-3 sm:px-4">
                <Mail size={18} className="text-purple-400 shrink-0" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full min-w-0 bg-transparent px-3 py-3.5 sm:py-4 text-white outline-none text-sm sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold text-white text-sm sm:text-base"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm sm:text-base"
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
