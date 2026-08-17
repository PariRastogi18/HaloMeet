import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, ArrowRight, Hash, UserCircle2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function JoinMeetingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetingName, setMeetingName] = useState("");
  const API = import.meta.env.VITE_API_URL;

  // Login user
  const username = user.username; // Replace with logged-in user

  const [roomId, setRoomId] = useState("");

  const joinMeeting = async () => {
    if (!roomId.trim()) {
      alert("Please enter a Room ID");
      return;
    }
    try {
      const BACKEND_URL = `${API}/api/auth/joinMeeting`;
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingCode: roomId.trim(),
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate(`/meet/${roomId.trim()}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#09090B] via-[#111827] to-[#1A1038]  selection:bg-purple-600 selection:text-white">
      <Navbar />
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-700/20 blur-[140px] rounded-full top-10 left-10 "></div>
      <div className="absolute w-96 h-96 bg-fuchsia-700/20 blur-[140px] rounded-full bottom-10 right-10"></div>

      <div className="relative m-auto my-4 z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Section */}
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
            <Video size={18} />
            HaloMeet
          </span>

          <h1 className="mt-6 text-5xl font-bold text-white leading-tight">
            Join Your
            <span className="text-purple-500"> Meeting</span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg leading-8">
            Enter the Room ID shared by the host and start collaborating with
            your team instantly using secure HD video, chat, and screen sharing.
          </p>

          <div className="mt-10 flex items-center gap-3 bg-[#1F1B2E] border border-purple-500/20 rounded-xl px-5 py-4 w-fit">
            <UserCircle2 className="text-purple-400" />

            <div>
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="text-white font-semibold">{username}</p>
            </div>
          </div>
        </div>

        {/* Right Card */}

        <div className="rounded-3xl border border-purple-500/20 bg-[#16131F]/90 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(124,58,237,.2)]">
          <h2 className="text-3xl font-bold text-white">Join Meeting</h2>

          <p className="mt-2 text-gray-400">Enter the meeting Room ID below.</p>

          {/* meeting name */}

          {/* <div className="mt-8">
            <label className="text-gray-300 mb-2 block">Meeting Name</label>

            <div className="flex items-center rounded-xl bg-[#23212d] border border-purple-500/20 px-4">
              <Hash className="text-purple-400" size={20} />

              <input
                type="text"
                placeholder="Meeting Name"
                value={meetingName}
                required
                onChange={(e) => setMeetingName(e.target.value)}
                className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div> */}

          {/* Room ID */}

          <div className="mt-8">
            <label className="text-gray-300 mb-2 block">Room ID</label>

            <div className="flex items-center rounded-xl bg-[#23212d] border border-purple-500/20 px-4">
              <Hash className="text-purple-400" size={20} />

              <input
                type="text"
                placeholder="HM-AB12-CD34"
                value={roomId}
                required
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Button */}

          <button
            onClick={joinMeeting}
            className="mt-8 w-full rounded-xl bg-purple-600 hover:bg-purple-700 transition py-4 text-lg font-semibold text-white flex items-center justify-center gap-2"
          >
            Join Meeting
            <ArrowRight size={20} />
          </button>

          {/* Info */}

          <div className="mt-8 rounded-xl bg-[#23212d] border border-purple-500/20 p-4">
            <h3 className="text-white font-semibold">Need a Room ID?</h3>

            <p className="mt-2 text-gray-400 text-sm leading-6">
              Ask the meeting host to share the Room ID or meeting link with you
              before joining.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
