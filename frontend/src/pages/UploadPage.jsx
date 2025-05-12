import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleScanResult = (fileName, result) => {
    setResults((prev) => [...prev, { fileName, result }]);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-start p-4">
      <header className="bg-white/90 backdrop-blur border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-2xl mx-auto mt-12 text-center animate-fade-in">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2 tracking-tight">Nuvai Scan</h1>
        <p className="text-gray-600 text-base sm:text-lg mb-4">
          Scan your code and detect vulnerabilities — fast, easy, and secure.
        </p>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 underline hover:text-red-600 mb-4"
        >
          🔓 Logout
        </button>
        <UploadForm onScan={handleScanResult} />
      </header>

      {/* Display scan results here */}
      <div className="mt-10 w-full max-w-2xl">
        {results.map((r, idx) => (
          <div key={idx} className="bg-white shadow p-4 rounded mb-4">
            <h3 className="font-semibold text-gray-800">{r.fileName}</h3>
            {r.result.error ? (
              <p className="text-red-600">❌ Failed to scan</p>
            ) : r.result.vulnerabilities?.length ? (
              <ul className="list-disc ml-5 text-sm text-gray-700">
                {r.result.vulnerabilities.map((v, i) => (
                  <li key={i}>
                    <strong>[{v.severity.toUpperCase()}]</strong> {v.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600">✅ No vulnerabilities found</p>
            )}
            {r.result.explanation && (
              <p className="mt-2 text-gray-600 italic text-sm">
                💡 <span dangerouslySetInnerHTML={{ __html: r.result.explanation }}></span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
