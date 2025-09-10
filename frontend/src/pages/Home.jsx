import React from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import AiVdo from "../assets/AI_s_Impact_on_Healthcare_Video.mp4";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        style={{
          filter: "brightness(40%)", // From first code, to match black overlay brightness
        }}
      >
        <source src={AiVdo} type="video/mp4" />
      </video>

      {/* Black Overlay for Text Visibility (from first code) */}
      <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col gap-6 items-center justify-center w-full px-6 pt-24 sm:pt-32 pb-10 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/90 rounded-full mb-2 shadow-lg animate-pulse">
          <FaHeartbeat className="w-6 h-6 text-white" />
          <span className="text-white font-medium text-md tracking-wide">
            AI Health Revolution
          </span>
        </span>
        <h1 className="text-white font-bold text-4xl sm:text-5xl lg:text-6xl drop-shadow-xl">
          Welcome to <span className="text-blue-400">CureMate</span> 🚀
        </h1>
        <p className="mt-2 text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto font-medium">
          <span className="bg-black/40 px-2 py-1 rounded-lg">
            AI-powered symptom checker and personalized care suggestions.
          </span>
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/symptom-checker"
            className="animate-bounce hover:animate-none inline-block bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-3 rounded-lg shadow-xl font-semibold text-lg transition-all duration-300"
          >
            Try Symptom Checker
          </Link>
        </div>
      </div>
    </div>
  );
}
