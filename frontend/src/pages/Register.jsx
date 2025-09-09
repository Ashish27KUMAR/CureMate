import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import Eye Icons for password visibility

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const navigate = useNavigate();

  // Setup reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("Recaptcha verified"),
        }
      );
    }
  };

  // Email + Password SignUp
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  // Google SignUp/Login
  const handleGoogleRegister = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    setError("");
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (err) {
      setError(err.message);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setError("");
    try {
      await confirmationResult.confirm(otp);
      navigate("/");
    } catch (err) {
      setError("Invalid OTP, please try again.");
    }
  };

  // Toggle password visibility function
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Email + Password Register */}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="relative">
          <label className="block text-sm">Password</label>
          <input
            type={isPasswordVisible ? "text" : "password"} // Toggle password visibility
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded pr-10" // Added padding for the eye button
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility} // Use click for all devices
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 mt-2.5"
          >
            {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      {/* Google Register/Login */}
      <div className="mt-4">
        <button
          onClick={handleGoogleRegister}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Continue with Google
        </button>
      </div>

      {/* Phone Register */}
      <div className="mt-6 space-y-3">
        <label className="block text-sm">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 XXXXXXXXXX"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          onClick={handleSendOtp}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Send OTP
        </button>

        {confirmationResult && (
          <>
            <label className="block text-sm">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>

      {/* Recaptcha container (invisible) */}
      <div id="recaptcha-container"></div>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
