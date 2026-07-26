import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-8 px-6 text-center text-sm text-zinc-500 bg-black">
      <p>&copy; {new Date().getFullYear()} HaloMeet. All rights reserved.</p>
    </footer>
  );
}
