import React from "react";
import { Video, MonitorUp, MessageCircle, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = [
  {
    name: "HD Video Meetings",
    description:
      "Experience smooth, high-quality video and audio calls with low latency making virtual meetings feel natural and reliable.",
    icon: Video,
  },
  {
    name: "Screen Sharing",
    description:
      "Share your entire screen or a specific window instantly to present idea, demonstrate applications, or collaborate in real time.",
    icon: MonitorUp,
  },
  {
    name: "Real-Time Chat",
    description:
      "Stay connected during meetings with instant messaging. Share updates, links, and important information without interrupting the conversation.",
    icon: MessageCircle,
  },
  {
    name: "Secure Communication",
    description:
      "Built with secure authentication and WebRTC technology to provide private, encrypted, and reliable video conferencing.",
    icon: ShieldCheck,
  },
];

export default function FeaturePage() {
  return (
    <div className="bg-white dark:bg-gray-900 selection:bg-purple-600 selection:text-white ">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 my-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty leading-14 text-gray-900 sm:text-5xl lg:text-balance dark:text-white">
            Everything you need for seamless online meetings
          </p>
          <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
            HaloMeet provides a fast, secure, and interactive video conferencing
            experience. Connect with your team through HD video calls, real-time
            chat, screen sharing, and collaboration tools—all in one place.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-purple-600 dark:bg-purple-500">
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Footer />
    </div>
  );
}
