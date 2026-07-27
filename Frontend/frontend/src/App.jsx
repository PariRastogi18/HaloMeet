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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signIn" element={<SignInPage />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/notfound" element={<NotFoundPage />} />
      <Route path="/features" element={<FeaturePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/:url" element={<VideoMeetComponent />} />
    </Routes>
  );
}

export default App;
