// src/components/History.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { FaCheckCircle } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

const backendUrl = import.meta.env.VITE_API_BASE_URL;

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  // Selection states
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Dropdown menu states
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchHistory();

    // Close menu when clicking outside
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return;
    if (!window.confirm("Delete selected entries?")) return;

    const user = auth.currentUser;
    if (!user) {
      setError("Please login.");
      return;
    }

    try {
      const token = await user.getIdToken();
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${backendUrl}/history/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setHistory((prev) => prev.filter((h) => !selectedIds.includes(h.id)));
      setSelectedIds([]);
      setSelectMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected entries.");
    }
  }

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
      setHistory([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete all history.");
    }
  }

  // Toggle selection when tapping the card
  function toggleCardSelection(id) {
    if (!selectMode) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
          <>
            {/* Desktop buttons */}
            <div className="hidden sm:flex gap-3">
              <button
                onClick={() => {
                  setSelectMode(!selectMode);
                  setSelectedIds([]);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                {selectMode ? "Deselect" : "Select"}
              </button>
              {selectMode ? (
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Mobile menu (3-dot) */}
            <div className="relative sm:hidden" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <HiDotsVertical size={22} />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30 
                             animate-fade-slide"
                >
                  <button
                    onClick={() => {
                      setSelectMode(!selectMode);
                      setSelectedIds([]);
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {selectMode ? "Deselect" : "Select"}
                  </button>
                  {selectMode ? (
                    <button
                      onClick={() => {
                        handleDeleteSelected();
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleClearAll();
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading && <div>Loading...</div>}
      {!loading && history.length === 0 && <div>No history available.</div>}

      <div className="space-y-4 mt-4">
        {history.map((h) => {
          const isSelected = selectedIds.includes(h.id);
          return (
            <div
              key={h.id}
              onClick={() => toggleCardSelection(h.id)}
              className={`p-4 border rounded shadow-sm cursor-pointer transition 
                ${
                  selectMode && isSelected
                    ? "bg-blue-100 border-blue-400"
                    : "bg-white"
                }`}
            >
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

                {!selectMode && (
                  <div className="flex gap-4 mt-4 sm:mt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(h);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(h.id);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

      {/* Animations */}
      <style>{`
        @keyframes fade-slide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
          animation: fade-slide 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
