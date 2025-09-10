import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { FaCheckCircle } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_API_BASE_URL;

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  async function fetchHistory() {
    setError("");
    const user = auth.currentUser;
    if (!user) {
      setError("Please login to view history.");
      return;
    }
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${backendUrl}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch history.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this entry?")) return;
    const user = auth.currentUser;
    if (!user) {
      setError("Please login.");
      return;
    }
    try {
      const token = await user.getIdToken();
      await axios.delete(`${backendUrl}/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry.");
    }
  }

  // Clear all history entries on backend and frontend
  async function handleClearAll() {
    if (!window.confirm("Delete all history?")) return;
    const user = auth.currentUser;
    if (!user) {
      setError("Please login.");
      return;
    }
    try {
      const token = await user.getIdToken();
      await axios.delete(`${backendUrl}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]); // Clear frontend state
    } catch (err) {
      console.error(err);
      alert("Failed to delete all history.");
    }
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const closeModal = () => setSelected(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your History</h2>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading && <div>Loading...</div>}
      {!loading && history.length === 0 && <div>No history available.</div>}

      <div className="space-y-4 mt-4">
        {history.map((h) => (
          <div key={h.id} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <div className="text-sm text-gray-500">
                  {formatDateTime(h.created_at)}
                </div>
                <div className="font-medium">
                  Symptoms:{" "}
                  {Array.isArray(h.symptoms) ? h.symptoms.join(", ") : "—"}
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  Predicted: {h.result?.predicted_disease || "—"}
                </div>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <button
                  onClick={() => setSelected(h)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-20"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full sm:w-96 mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl text-blue-500 font-bold flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                {selected.result?.predicted_disease || "No Prediction"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              {selected.result?.description || "No description available."}
            </p>

            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <strong className="text-blue-600">Medications:</strong>{" "}
                {Array.isArray(selected.result?.medications)
                  ? selected.result.medications.join(", ")
                  : selected.result?.medications || "—"}
              </div>
              <div>
                <strong className="text-blue-600">Diets:</strong>{" "}
                {Array.isArray(selected.result?.diets)
                  ? selected.result.diets.join(", ")
                  : selected.result?.diets || "—"}
              </div>
              <div>
                <strong className="text-blue-600">Precautions:</strong>{" "}
                {Array.isArray(selected.result?.precautions)
                  ? selected.result.precautions.join(", ")
                  : selected.result?.precautions || "—"}
              </div>
              <div>
                <strong className="text-blue-600">Workouts:</strong>{" "}
                {Array.isArray(selected.result?.workouts)
                  ? selected.result.workouts.join(", ")
                  : selected.result?.workouts || "—"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
