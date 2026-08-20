import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Copy,
  Sparkles,
  CheckCircle2,
  Link2,
  AwardIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

export default function CreateMeetingPage() {
  const navigate = useNavigate();
  const {accessToken} = useAuth();

  const [meetingName, setMeetingName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const generateMeeting = async () => {
    if (meetingName.length === 0) {
      alert("Before create meeting, require meeting name!");
      return;
    }
    const id = crypto.randomUUID().slice(0, 8).toUpperCase();

    setRoomId(id);

    try {
      const BACKEND_URL = `${API}/api/auth/createMeeting`;
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          meetingName: meetingName.trim(),
          meetingCode: id.trim(),
        }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { message: "The server returned an unexpected response. Please try again." };
      if (response.ok) {
        alert(data.message);

        setMeetingLink(`${window.location.origin}/meet/${id.trim()}`);

        console.log(setMeetingLink);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Unable to create meeting:", error);
      alert("Unable to create the meeting. Please try again.");
    }
  };

  const copyLink = async () => {
    if (!meetingLink) return;

    await navigator.clipboard.writeText(meetingLink);
    alert("Meeting Link Copied!");
  };

  const startMeeting = () => {
    if (meetingName.length === 0 || !roomId) return;

    navigate(`/meet/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#09090B] via-[#111827] to-[#1A1038]  selection:bg-purple-600 selection:text-white">
      <Navbar />
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-700/20 blur-[140px] rounded-full top-10 left-10"></div>

      <div className="absolute w-96 h-96 bg-fuchsia-700/20 blur-[140px] rounded-full bottom-10 right-10"></div>

      {/* Card */}

      <div className="relative z-10 m-auto my-4 w-full max-w-3xl rounded-3xl border border-purple-500/20 bg-[#16131F]/90 backdrop-blur-xl p-10 shadow-[0_0_60px_rgba(124,58,237,.15)]">
        {/* Header */}

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-700/40">
            <Video size={36} className="text-white" />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-white">
            Create New Meeting
          </h1>

          <p className="mt-3 text-gray-400 text-center max-w-xl">
            Generate a secure meeting room and invite your team with a single
            click.
          </p>
        </div>

        {/* Meeting Name */}

        <div className="mt-10">
          <label className="text-gray-300 font-medium">Meeting Name</label>

          <input
            type="text"
            placeholder="Team Standup"
            value={meetingName}
            required
            onChange={(e) => setMeetingName(e.target.value)}
            className="mt-3 w-full rounded-xl bg-[#23212d] border border-purple-500/20 px-5 py-4 text-white outline-none focus:border-purple-500"
          />
        </div>

        {/* Generate Button */}

        <button
          onClick={generateMeeting}
          className="mt-8 w-full bg-purple-600 hover:bg-purple-700 transition rounded-xl py-4 font-semibold text-white flex items-center justify-center gap-3"
        >
          <Sparkles size={22} />
          Generate Meeting
        </button>

        {/* Result */}

        {roomId && (
          <div className="mt-10 rounded-2xl border border-purple-500/20 bg-[#23212d] p-6">
            <div className="flex items-center gap-3 text-green-400">
              <CheckCircle2 size={24} />

              <h2 className="text-xl font-semibold">
                Meeting Created Successfully
              </h2>
            </div>

            {/* Room ID */}

            <div className="mt-6">
              <p className="text-gray-400 mb-2">Room ID</p>

              <div className="rounded-xl bg-[#15141c] border border-purple-500/20 px-5 py-4 text-white font-semibold tracking-wider">
                {roomId}
              </div>
            </div>

            {/* Meeting Link */}

            <div className="mt-6">
              <p className="text-gray-400 mb-2 flex items-center gap-2">
                <Link2 size={18} />
                Meeting Link
              </p>

              <div className="rounded-xl bg-[#15141c] border border-purple-500/20 px-5 py-4 break-all text-purple-300">
                {meetingLink}
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-8 flex gap-5">
              <button
                onClick={copyLink}
                className="flex-1 py-4 rounded-xl border border-purple-500 text-white hover:bg-purple-600 transition flex items-center justify-center gap-2"
              >
                <Copy size={20} />
                Copy Link
              </button>
              <button
                onClick={startMeeting}
                className="flex-1 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white flex items-center justify-center gap-2"
              >
                <Video size={20} />
                Start Meeting
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
