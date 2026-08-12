import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      navigate("/signIn?error=missing_code");
      return;
    }

    fetch("/api/auth/exchange", {
      method: "POST",
      credentials: "include", // zaroori hai — cookie set hone ke liye
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Exchange failed");
        return res.json();
      })
      .then(() => navigate("/"))
      .catch(() => navigate("/signIn?error=exchange_failed"));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Signing you in...</p>
      </div>
    </div>
  );
}
