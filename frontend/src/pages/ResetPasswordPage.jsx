import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sanitizeInput = (input) => input.replace(/[<>"']/g, "").normalize("NFKC");

  const validatePassword = (pwd) => {
    return (
      pwd.length >= 12 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd) &&
      !/\s/.test(pwd)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanPassword = sanitizeInput(password);
    const cleanConfirm = sanitizeInput(confirmPassword);

    if (!validatePassword(cleanPassword)) {
      setErrorMsg("Password does not meet security requirements.");
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ token, password: cleanPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.message || "Reset failed. Try again.");
        setLoading(false);
        return;
      }

      setSuccessMsg("✅ Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Reset error:", err);
      setErrorMsg("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🔒 Set New Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
          required
          maxLength={100}
          autoComplete="new-password"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
          required
          maxLength={100}
          autoComplete="new-password"
        />

        {errorMsg && <p className="text-red-600 text-sm text-center mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm text-center mb-4">{successMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-md text-white font-medium transition duration-200 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🔄 Resetting..." : "✅ Set New Password"}
        </button>
      </form>
    </div>
  );
}
