import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [passwordScore, setPasswordScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("lockoutUntil");
    if (saved) {
      const until = new Date(saved);
      if (until > new Date()) {
        setLockoutUntil(until);
      } else {
        localStorage.removeItem("lockoutUntil");
        localStorage.removeItem("failCount");
      }
    }
  }, []);

  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, lockoutUntil - now);
      setTimeLeft(Math.floor(diff / 1000));
      if (diff <= 0) {
        clearInterval(interval);
        setLockoutUntil(null);
        setTimeLeft(0);
        localStorage.removeItem("lockoutUntil");
        localStorage.removeItem("failCount");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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

  const sanitizeInput = (input) => input.replace(/[<>"']/g, "").normalize("NFKC");

  const formatTimeLeft = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    let score = 0;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) score++;
    setPasswordScore(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (lockoutUntil && new Date() < lockoutUntil) {
      setErrorMsg("Too many failed attempts. Try again later.");
      return;
    }

    const cleanEmail = sanitizeInput(email.trim());
    const cleanPassword = sanitizeInput(password);

    if (!validateEmail(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(cleanPassword)) {
      setErrorMsg("Invalid email or password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const csrfToken = localStorage.getItem("csrfToken") || "";
      const nonce = crypto.randomUUID();

      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Nonce": nonce,
          "X-CSRF-Token": csrfToken,
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errData = await res.json();
        setErrorMsg(errData.message || "Invalid email or password.");

        const attempts = parseInt(localStorage.getItem("failCount") || "0", 10) + 1;
        if (attempts >= 3) {
          const until = new Date(Date.now() + 5 * 60 * 1000);
          localStorage.setItem("lockoutUntil", until);
          setLockoutUntil(until);
        } else {
          localStorage.setItem("failCount", attempts);
        }

        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.token && data.csrfToken) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("csrfToken", data.csrfToken);
        localStorage.removeItem("failCount");
        localStorage.removeItem("lockoutUntil");
        navigate("/scan");
      } else {
        setErrorMsg("Invalid server response. Please try again.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setErrorMsg("Login request timed out. Please try again.");
      } else {
        console.error("Login error:", err);
        setErrorMsg("Unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🔐 Secure Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="current-password"
          onPaste={(e) => e.preventDefault()}
        />

        {passwordScore !== null && (
          <p className={`text-xs mb-2 text-center ${
            passwordScore >= 5 ? "text-green-600" : "text-yellow-600"
          }`}>
            Password strength: {passwordScore}/5
          </p>
        )}

        {errorMsg && (
          <p className="text-red-600 text-sm text-center mb-4">{errorMsg}</p>
        )}

        {timeLeft > 0 && (
          <p className="text-orange-500 text-sm text-center mb-4">
            ⏳ Locked out. Please wait {formatTimeLeft(timeLeft)} before trying again.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || timeLeft > 0}
          className={`w-full py-3 px-6 rounded-md text-white font-medium transition duration-200 ${
            loading || timeLeft > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🔄 Logging in..." : "➡️ Login"}
        </button>

        <div className="mt-4 text-sm text-center text-gray-600">
          <p>
            Don't have an account? {" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
          <p className="mt-1">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
