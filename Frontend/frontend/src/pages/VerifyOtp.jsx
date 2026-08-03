import { useRef, useState } from "react";
import { ShieldCheck, ArrowLeft, Mail, AwardIcon } from "lucide-react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;
  if (!email) {
    return <Navigate to={"/forgotPassword"} replace />;
  }
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }

    console.log("OTP:", typeof enteredOtp);

    try {
      const BACKEND_URL = "http://localhost:5000/api/auth/verifyOtp";
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: enteredOtp,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/changePassword", {
          state: email,
        });
      } else {
        // This will tell you exactly what the backend didn't like
        console.error(
          "Verification failed:",
          data.message || data.error || "Unknown error",
        );
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#09090B] via-[#111827] to-[#1A1038] flex items-center justify-center px-5">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-700/20 blur-[150px] rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-fuchsia-700/20 blur-[150px] rounded-full bottom-10 right-10"></div>

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#16131F]/90 backdrop-blur-xl border border-purple-500/20 p-8 shadow-[0_0_60px_rgba(124,58,237,.2)]">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
            <ShieldCheck className="text-white" size={30} />
          </div>
        </div>

        <h1 className="mt-6 text-3xl text-center font-bold text-white">
          Verify OTP
        </h1>

        <p className="text-center text-gray-400 mt-3">
          We've sent a verification code to
        </p>

        <p className="text-center text-purple-400 mt-1 font-semibold">
          {email}
        </p>

        {/* OTP Boxes */}

        <div className="flex justify-center gap-3 mt-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              className="w-14 h-14 rounded-xl bg-[#23212d] border border-purple-500/30 text-center text-2xl text-white outline-none focus:border-purple-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="mt-8 w-full bg-purple-600 hover:bg-purple-700 transition py-4 rounded-xl text-white font-semibold"
        >
          Verify OTP
        </button>

        {/* <div className="mt-6 text-center">
          <p className="text-gray-400">Didn't receive the code?</p>

          <button className="mt-2 text-purple-400 hover:text-purple-300">
            Resend OTP
          </button>
        </div> */}

        <div className="mt-8 text-center">
          <Link
            to="/forgotPassword"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
          >
            <ArrowLeft size={18} />
            Back to Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}
