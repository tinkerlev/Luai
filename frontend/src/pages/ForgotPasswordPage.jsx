import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const sanitizeInput = (input) => input.replace(/[<>"']/g, "").normalize("NFKC");
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    const cleanEmail = sanitizeInput(email.trim());

    if (!validateEmail(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const csrfToken = localStorage.getItem("csrfToken") || "";

      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email: cleanEmail }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errData = await res.json();
        setErrorMsg(errData.message || "Password reset request failed.");
        return;
      }

      setMessage("✅ If your email is valid, a reset link has been sent.");
    } catch (err) {
      if (err.name === "AbortError") {
        setErrorMsg("Request timed out. Please try again.");
      } else {
        console.error("Forgot password error:", err);
        setErrorMsg("Unexpected error occurred. Try again later.");
      }
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
          🔑 Forgot Password
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
          required
          maxLength={100}
          autoComplete="off"
        />

        {errorMsg && <p className="text-red-600 text-sm text-center mb-4">{errorMsg}</p>}
        {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-md text-white font-medium transition duration-200 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🔄 Sending..." : "📧 Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
