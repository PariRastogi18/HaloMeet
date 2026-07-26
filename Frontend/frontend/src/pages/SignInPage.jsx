import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFromData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  let handleInputChange = (event) => {
    setFromData((currData) => {
      return { ...currData, [event.target.name]: event.target.value };
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const BACKEND_URL = "http://localhost:5000/api/auth/login";
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "User logged in successfully",
        });

        // Store token and user data using auth context
        login(data.accessToken, data.user);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Login failed",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Server error. Please try again later.",
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black dark:bg-gray-900 text-white font-sans selection:bg-purple-600 selection:text-white">
      {/* Navbar */}
      <Navbar />
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative z-10 mx-auto my-8 ">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20 mx-auto mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-linear-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Welcome Back to HaloMeet
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Sign in to start or join a secure meeting
          </p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div
            className={`p-3 rounded-xl text-sm mb-4 border ${
              message.type === "success"
                ? "bg-emerald-950/50 border-emerald-800 text-emerald-400"
                : "bg-rose-950/50 border-rose-800 text-rose-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              id="email"
              placeholder="name@example.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-400"
                htmlFor="password"
              >
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              id="password"
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-600/10 active:scale-[0.98]"
          >
            {loading ? "Login..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-zinc-800"></div>
          <span className="px-3 text-xs uppercase tracking-widest text-zinc-600 font-medium">
            Or continue with
          </span>
          <div className="flex-1 border-t border-zinc-800"></div>
        </div>

        {/* Google OAuth Button */}
        <button className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-all text-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500 mt-8">
          Don't have an account?{" "}
          <Link
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            to={"/signUp"}
          >
            Create an account
          </Link>
        </p>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
