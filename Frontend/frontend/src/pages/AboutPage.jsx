import React from "react";
import {
  Video,
  MessageCircle,
  MonitorUp,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Video,
    title: "HD Video Meetings",
    desc: "Crystal-clear video and audio for seamless communication.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    desc: "Stay connected with instant messaging during meetings.",
  },
  {
    icon: MonitorUp,
    title: "Screen Sharing",
    desc: "Present your ideas by sharing your entire screen instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Meetings",
    desc: "Built with WebRTC for secure and encrypted communication.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Work together with your team from anywhere.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized connections with low latency and high quality.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#0B1120] text-white">
      <Navbar />
      {/* Hero */}
      <section className="py-24 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold">
          Connecting People,
          <span className="text-purple-500"> Anywhere.</span>
        </h1>

        <p className="max-w-3xl mx-auto mt-6 text-gray-400 text-lg">
          HaloMeet is a modern video conferencing platform inspired by Zoom,
          designed for seamless collaboration through HD video calls, screen
          sharing, and real-time messaging.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <Link
            to={"/createMeeting"}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl"
          >
            Create Meeting
          </Link>

          <Link
            to={"/joinMeeting"}
            className="border border-purple-500 px-8 py-3 rounded-xl hover:bg-purple-500/20"
          >
            Join Meeting
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold">About HaloMeet</h2>

          <p className="mt-6 text-gray-400 leading-8">
            HaloMeet brings teams, students, and professionals together through
            reliable online meetings. With secure WebRTC technology, users can
            create meeting rooms, invite participants, chat in real time, and
            share their screens effortlessly.
          </p>
        </div>

        <div className="h-96 rounded-3xl bg-linear-to-br from-purple-600/30 to-transparent border border-purple-500/30 flex items-center justify-center">
          <Video size={120} className="text-purple-400" />
          <img
            src="/images/videoCallImg.png"
            alt="VideoCallImg"
            height={"24rem"}
            style={{ borderRadius: "1.5rem" }}
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center">Why Choose HaloMeet?</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#111827] border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500 transition"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center">
                <feature.icon size={30} />
              </div>

              <h3 className="mt-6 text-2xl font-semibold">{feature.title}</h3>

              <p className="mt-4 text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-linear-to-r from-purple-700 to-indigo-700 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold">Our Mission</h2>

          <p className="mt-6 text-lg text-gray-100">
            To make online communication simple, secure, and accessible for
            everyone through an elegant and high-performance meeting platform.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto py-20 grid grid-cols-2 md:grid-cols-4 text-center gap-10">
        <div>
          <h2 className="text-5xl font-bold text-purple-500">10K+</h2>
          <p className="text-gray-400 mt-2">Meetings</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-purple-500">50K+</h2>
          <p className="text-gray-400 mt-2">Users</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-purple-500">99.9%</h2>
          <p className="text-gray-400 mt-2">Uptime</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-purple-500">24/7</h2>
          <p className="text-gray-400 mt-2">Support</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
