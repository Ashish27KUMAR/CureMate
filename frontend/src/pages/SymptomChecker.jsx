import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
const backendUrl = import.meta.env.VITE_API_BASE_URL;

export default function SymptomChecker() {
  const [query, setQuery] = useState("");
  const [autocomplete, setAutocomplete] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Autocomplete fetch
  useEffect(() => {
    if (query.length < 2) {
      setAutocomplete([]);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const res = await axios.get(`${backendUrl}/suggest`, {
          params: { symptom: query },
          signal: controller.signal,
        });
        setAutocomplete(res.data.autocomplete || []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Failed to fetch suggestions. Try again.");
        }
      }
    })();
    return () => controller.abort();
  }, [query]);

  // Add symptom
  function addSymptom(s) {
    if (!selected.includes(s)) setSelected([...selected, s]);
    setQuery("");
    setAutocomplete([]);
    setError(null);
  }

  // Prediction call
  async function handlePredict() {
    if (selected.length === 0) {
      setError("Please add at least one symptom.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Please log in before predicting.");
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      const res = await axios.post(
        `${backendUrl}/predict`,
        { symptoms: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
      >
        <FaArrowLeft size={18} /> Back
      </button>

      <div className="bg-white rounded-xl shadow-2xl px-6 py-8 mb-6">
        <h2 className="text-2xl font-bold mb-2 text-blue-900 tracking-tight">
          🩺 Symptom Checker
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your symptoms to receive an AI health prediction and tailored
          recommendations.
        </p>

        {/* Input Field + Autocomplete */}
        <div className="relative mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type symptom (e.g. fever)..."
            className="w-full border-2 border-blue-100 focus:border-blue-400 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          />
          {autocomplete.length > 0 && (
            <div className="absolute w-full bg-white border border-blue-200 rounded-lg mt-1 shadow-xl max-h-48 overflow-auto z-20">
              {autocomplete.map((s) => (
                <button
                  key={s}
                  onClick={() => addSymptom(s)}
                  className="block w-full text-left px-3 py-2 hover:bg-blue-500 hover:text-white transition rounded"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Symptoms */}
        {selected.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-gray-700">
              Selected Symptoms
            </h4>
            <div className="flex flex-wrap gap-2">
              {selected.map((s) => (
                <span
                  key={s}
                  className="flex items-center bg-gradient-to-tr from-blue-600 to-indigo-400 text-white px-3 py-1 rounded-2xl text-sm shadow cursor-pointer hover:scale-105 transition-transform"
                >
                  {s}
                  <button
                    onClick={() => setSelected(selected.filter((x) => x !== s))}
                    className="ml-2 text-white font-bold px-1 hover:text-red-300"
                    aria-label={`remove ${s}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handlePredict}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-36 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
          <button
            onClick={() => {
              setSelected([]);
              setResult(null);
              setError(null);
            }}
            className="bg-gray-100 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 hover:text-black transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border-l-4 border-red-400 flex items-center shadow">
          <FaExclamationTriangle className="mr-2" /> {error}
        </div>
      )}

      {/* Result Section */}
      {result && !error && (
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl shadow-2xl p-6 mt-6 border border-blue-200 animate-fade-in">
          <h3 className="text-xl font-bold text-blue-800 mb-1 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            {result.predicted_disease || "No prediction"}
          </h3>
          {result.description && (
            <p className="mb-2 text-gray-700">{result.description}</p>
          )}

          {result.medications && (
            <div className="mb-1">
              <strong className="text-blue-700">Medications:</strong>{" "}
              {Array.isArray(result.medications)
                ? result.medications.join(", ")
                : result.medications}
            </div>
          )}
          {result.diets && (
            <div className="mb-1">
              <strong className="text-blue-700">Diets:</strong>{" "}
              {Array.isArray(result.diets)
                ? result.diets.join(", ")
                : result.diets}
            </div>
          )}
          {result.precautions && (
            <div className="mb-1">
              <strong className="text-blue-700">Precautions:</strong>{" "}
              {Array.isArray(result.precautions)
                ? result.precautions.join(", ")
                : result.precautions}
            </div>
          )}
          {result.workouts && (
            <div>
              <strong className="text-blue-700">Workouts:</strong>{" "}
              {Array.isArray(result.workouts)
                ? result.workouts.join(", ")
                : result.workouts}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
