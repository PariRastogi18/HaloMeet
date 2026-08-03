import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import VideoMeetComponent from "./pages/VideoMeetComponent";
import Pricing from "./pages/Pricing";
import NotFoundPage from "./pages/NotFoundPage";
import FeaturePage from "./pages/FeaturePage";
import AboutPage from "./pages/AboutPage";
import ForgotPassword from "./pages/ForgotPassword";
import CreateMeetingPage from "./pages/CreateMeetingPage";
import JoinMeetingPage from "./pages/JoinMeetingPage";
import VerifyOtp from "./pages/VerifyOtp";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signIn" element={<SignInPage />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/*" element={<NotFoundPage />} />
      <Route path="/features" element={<FeaturePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/verifyOtp" element={<VerifyOtp />} />
      <Route path="/changePassword" element={<ChangePassword />} />
      <Route
        path="/createMeeting"
        element={
          <ProtectedRoute>
            <CreateMeetingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/joinMeeting"
        element={
          <ProtectedRoute>
            <JoinMeetingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meet/:url"
        element={
          <ProtectedRoute>
            <VideoMeetComponent />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
