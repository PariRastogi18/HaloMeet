import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import VideoMeetComponent from "./pages/VideoMeetComponent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signIn" element={<SignInPage />} />
      <Route path="/signUp" element={<SignUp />} />

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
