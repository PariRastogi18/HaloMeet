import { Link } from "react-router-dom";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

function LandingPage() {
  return (
    <div className="min-h-screen bg-black dark:bg-gray-900 text-white font-sans selection:bg-purple-600 selection:text-white">
      <Navbar />
      {/* Hero Section */}
      <header className="relative px-4 pt-10 pb-14 sm:px-6 md:pt-11 md:pb-16 max-w-6xl mx-auto text-center flex flex-col items-center justify-center overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-purple-950/50 text-purple-400 border border-purple-800/50 mb-6 uppercase tracking-widest">
          Next-Gen Video Conferencing
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight mb-6 px-2">
          Connect Anyone, Anywhere with{" "}
          <span className="bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Flawless Video
          </span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed px-2">
          A premium HaloMeet built for crystal-clear video calls, instant screen
          sharing, and secure real-time collaboration.
        </p>

        {/* Action Cards / Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-16 px-2 sm:px-0">
          <Link
            to={"/createMeeting"}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 group"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Meeting
          </Link>
          <Link
            to={"/joinMeeting"}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-600/50 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Join Meeting
          </Link>
        </div>

        {/* Mockup Showcase */}
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl shadow-purple-950/20 relative group">
          <div className="absolute inset-0 bg-linear-to-b from-purple-600/5 to-transparent rounded-2xl pointer-events-none group-hover:from-purple-600/10 transition-all duration-500" />
          <div className="aspect-video w-full rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <video className="w-full rounded-base" autoPlay muted>
              <source src="/videos/landingVideo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section
        id="features"
        className="px-4 py-16 sm:px-6 sm:py-20 bg-zinc-950 border-t border-zinc-900"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 px-2">
              Everything you need for seamless meetings
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto px-2 text-sm sm:text-base">
              High-performance tools integrated directly into your browser with
              zero installs required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-zinc-800 bg-black hover:border-purple-600/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-purple-950/50 border border-purple-800 text-purple-400 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
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
              <h3 className="text-lg font-semibold mb-2">HD Video & Audio</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Crystal-clear standard definition to full HD video resolution
                optimized for low bandwidth connections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-zinc-800 bg-black hover:border-purple-600/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-purple-950/50 border border-purple-800 text-purple-400 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Screen Sharing</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Share your entire screen, custom browser tabs, or specific
                application windows instantly with one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-zinc-800 bg-black hover:border-purple-600/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-purple-950/50 border border-purple-800 text-purple-400 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                End-to-End Encryption
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Your security is paramount. Every meeting room is secured with
                industry-standard modern encryptions.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
