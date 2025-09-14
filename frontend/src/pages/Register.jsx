import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";

const Register = () => {
  // Shared with Login
  const [activeRegisterMethod, setActiveRegisterMethod] = useState("email"); // "email" | "google" | "phone"
  const [error, setError] = useState("");

  // Email/password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Google
  const [isGoogle, setIsGoogle] = useState(false);

  // Phone/OTP
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const navigate = useNavigate();

  // Ensure the invisible reCAPTCHA container exists
  useEffect(() => {
    const el = document.getElementById("recaptcha-container");
    if (!el) {
      const div = document.createElement("div");
      div.id = "recaptcha-container";
      document.body.appendChild(div);
    }
  }, []);

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) return window.recaptchaVerifier;
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
    return window.recaptchaVerifier;
  };

  const togglePasswordVisibility = () => setIsPasswordVisible((v) => !v);

  const switchRegisterMethod = (method) => {
    setActiveRegisterMethod(method);
    setError("");
    setOtp("");
    setConfirmationResult(null);
  };

  // Email + Password Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      setIsRegistering(true);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Failed to register. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Google Register/Login
  const handleGoogle = async () => {
    setError("");
    try {
      setIsGoogle(true);
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsGoogle(false);
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    setError("");
    const formatted = `${countryCode}${phone.replace(/\D/g, "")}`;
    if (!formatted.startsWith("+") || formatted.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    try {
      setIsSendingOtp(true);
      const appVerifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, formatted, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (err) {
      window.recaptchaVerifier = null; // allow retry
      setError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setError("");
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    if (!confirmationResult) {
      setError("Please request an OTP first.");
      return;
    }
    try {
      setIsVerifyingOtp(true);
      await confirmationResult.confirm(otp.trim());
      navigate("/");
    } catch (err) {
      setError("Invalid OTP, please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 px-4 -mt-10">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-5 sm:p-8 mx-auto">
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
          Create your account
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        {/* EMAIL REGISTER (matches login styles) */}
        {activeRegisterMethod === "email" && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-9 right-3 text-gray-600"
                aria-label="Toggle password visibility"
              >
                {isPasswordVisible ? (
                  <FaEyeSlash className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <FaEye className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isRegistering
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRegistering ? "Creating account..." : "Register"}
            </button>
          </form>
        )}

        {/* GOOGLE (same as login) */}
        {activeRegisterMethod === "google" && (
          <div className="mt-6">
            <button
              onClick={handleGoogle}
              disabled={isGoogle}
              className={`w-full border border-gray-300 text-gray-700 py-2 rounded-md flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                isGoogle
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span className="text-sm sm:text-base">
                {isGoogle ? "Processing..." : "Continue with Google"}
              </span>
            </button>
          </div>
        )}

        {/* PHONE (same as login styles) */}
        {activeRegisterMethod === "phone" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="STD code"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+971">+971</option>
                  <option value="+61">+61</option>
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="XXXXXXXXXX"
                  className="flex-1 min-w-0 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className={`w-full mt-4 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  isSendingOtp
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>

            {confirmationResult && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp}
                  className={`w-full mt-4 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    isVerifyingOtp
                      ? "bg-purple-300 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Divider + Method Selector (identical to Login) */}
        <div className="mt-8">
          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500">or continue with</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4">
            <button
              onClick={() => switchRegisterMethod("email")}
              className={`p-3 rounded-full ${
                activeRegisterMethod === "email"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              } hover:bg-blue-50 transition`}
              aria-label="Register with Email"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </button>

            <button
              onClick={() => switchRegisterMethod("google")}
              className={`p-3 rounded-full ${
                activeRegisterMethod === "google"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              } hover:bg-blue-50 transition`}
              aria-label="Register with Google"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </button>

            <button
              onClick={() => switchRegisterMethod("phone")}
              className={`p-3 rounded-full ${
                activeRegisterMethod === "phone"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              } hover:bg-blue-50 transition`}
              aria-label="Register with Phone"
            >
              <FaPhone className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container" />

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
