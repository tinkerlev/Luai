// file: RegisterPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profession: "",
    company: "",
    plan: "monthly"
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const navigate = useNavigate();

  const sanitizeInput = (input) => input.replace(/[<>"']/g, "").normalize("NFKC");
  const escapeHTML = (str) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.endsWith("@example.com");
  const validatePhone = (phone) => /^[0-9]{7,15}$/.test(phone);
  const isAlphaOnly = (text) => /^[a-zA-Z\-'\s]{1,50}$/.test(text);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const COOLDOWN_MS = 10000;
    if (Date.now() - lastSubmitTime < COOLDOWN_MS) {
      setErrorMsg("Please wait before trying again.");
      return;
    }
    setLastSubmitTime(Date.now());

    if (!isAlphaOnly(form.firstName) || !isAlphaOnly(form.lastName)) {
      setErrorMsg("Names must contain only letters and basic characters.");
      return;
    }
    if (!validateEmail(form.email)) {
      setErrorMsg("Invalid email address.");
      return;
    }
    if (!validatePhone(form.phone)) {
      setErrorMsg("Invalid phone number.");
      return;
    }
    if (!validatePassword(form.password)) {
      setErrorMsg("Password must be 12+ chars, include upper/lowercase, number, special character.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const csrfToken = localStorage.getItem("csrfToken") || "";

      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await fetch(`${apiUrl}/auth/register`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errData = await res.json();
        setErrorMsg(escapeHTML(errData.message || "Registration failed."));
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (err) {
      if (err.name === "AbortError") {
        setErrorMsg("Request timed out. Please try again.");
      } else {
        console.error("Register error:", err);
        setErrorMsg("Unexpected error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">📝 Creat an account</h2>

        {[
          ["firstName", "First Name"],
          ["lastName", "Last Name"],
          ["email", "Email"],
          ["phone", "Phone Number"],
          ["profession", "Profession"],
          ["company", "Company (if applicable)"]
        ].map(([key, label]) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={label}
            value={form[key]}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
            maxLength={50}
            required={key !== "company"}
            autoComplete="off"
          />
        ))}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
          required
          maxLength={100}
          autoComplete="new-password"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
          required
          maxLength={100}
          autoComplete="new-password"
        />

        <select
          name="plan"
          value={form.plan}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md mb-4"
        >
          <option value="monthly">📆 Monthly Plan</option>
          <option value="yearly">📅 Yearly Plan</option>
          <option value="business">🏢 Business Plan</option>
        </select>

        {errorMsg && (
          <p className="text-red-600 text-sm text-center mb-4">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-md text-white font-medium transition duration-200 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🔄 Registering..." : "✅ Register"}
        </button>
      </form>
    </div>
  );
}
