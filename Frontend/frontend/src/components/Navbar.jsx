import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, loading, user, logout, accessToken } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Features", to: "/features" },
    { label: "About", to: "/about" },
    { label: "Pricing", to: "/pricing" },
  ];

  const handleLogout = async () => {
    try {
      const token = accessToken;
      const BACKEND_LOGOUT_URL = "http://localhost:5000/api/auth/logout";

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
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Logo */}
        <Link className="flex items-center gap-2 min-w-0" to={"/"}>
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
            <svg
              className="w-5 h-5 text-white"
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
          <span className="text-lg font-bold tracking-wider bg-linear-to-r from-white to-purple-400 bg-clip-text text-transparent sm:text-xl">
            HaloMeet
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-zinc-400 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              className="hover:text-purple-400 transition-colors"
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: auth buttons + mobile toggle */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
              <Link
                className="text-zinc-300 hover:text-white font-medium transition-colors px-2 py-2 text-sm sm:px-4"
                to={"/signIn"}
              >
                Sign In
              </Link>
              <Link
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-2 rounded-lg transition-all shadow-md shadow-purple-600/20 active:scale-95 text-sm sm:px-5"
                to={"/signUp"}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden sm:flex bg-red-600 hover:bg-red-700 text-white font-semibold p-2.5 sm:px-6 sm:py-3 rounded-xl transition-all items-center justify-center"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden text-zinc-300 hover:text-white p-2 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown (snackbar-style menu) */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3 border-t border-zinc-800 pt-3 px-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              className="text-zinc-300 hover:text-purple-400 font-medium py-2 transition-colors"
              to={link.to}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <div className="flex items-center gap-3 pt-2">
              <Link
                className="flex-1 text-center text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-lg border border-zinc-700 transition-colors"
                to={"/signIn"}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-all"
                to={"/signUp"}
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
