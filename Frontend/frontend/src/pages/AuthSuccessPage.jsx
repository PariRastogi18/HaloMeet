import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Signing you in...</p>
      </div>
    </div>
  );
}
