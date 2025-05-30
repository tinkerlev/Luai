import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UploadPage from "./pages/UploadPage";
import PrivateRoute from "./components/PrivateRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/Home";
import Footer from "./components/Footer";
import { ThemeToggle } from "./theme/theme-toggle";

export default function AppRouter() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
        <ThemeToggle />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/Home" element={<HomePage />} />

            <Route
              path="/scan"
              element={
                <PrivateRoute>
                  <UploadPage />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/Home" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
