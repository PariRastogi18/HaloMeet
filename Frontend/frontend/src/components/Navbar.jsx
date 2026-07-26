import React from "react";
import { Link } from "react-router-dom";
export default function () {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link className="flex items-center gap-2" to={"/"}>
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
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
        <span className="text-xl font-bold tracking-wider bg-linear-to-r from-white to-purple-400 bg-clip-text text-transparent">
          HaloMeet
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-zinc-400 font-medium">
        <Link
          className="hover:text-purple-400 transition-colors"
          to={"/features"}
        >
          Features
        </Link>
        <Link className="hover:text-purple-400 transition-colors" to={"/about"}>
          About
        </Link>
        <Link
          className="hover:text-purple-400 transition-colors"
          to={"/pricing"}
        >
          Pricing
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          className="text-zinc-300 hover:text-white font-medium transition-colors px-4 py-2"
          to={"/signIn"}
        >
          Sign In
        </Link>
        <Link
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2 rounded-lg transition-all shadow-md shadow-purple-600/20 active:scale-95"
          to={"/signUp"}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
