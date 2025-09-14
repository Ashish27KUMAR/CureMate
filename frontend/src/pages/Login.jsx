import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [countryCode, setCountryCode] = useState("+91"); // STD code only
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [activeLoginMethod, setActiveLoginMethod] = useState("email");

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSigningInEmail, setIsSigningInEmail] = useState(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);

  const navigate = useNavigate();

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

  // Email Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      setIsSigningInEmail(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Failed to sign in. Please try again.");
    } finally {
      setIsSigningInEmail(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");
    try {
      setIsSigningInGoogle(true);
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsSigningInGoogle(false);
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
      alert("OTP sent to your phone!");
    } catch (err) {
      window.recaptchaVerifier = null;
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
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((v) => !v);
  };

  const switchLoginMethod = (method) => {
    setActiveLoginMethod(method);
    setError("");
    setOtp("");
    setConfirmationResult(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 px-4 -mt-10">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-5 sm:p-8 mx-auto">
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
          Welcome Back
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        {/* Email Login */}
        {activeLoginMethod === "email" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <input
                id="email"
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                required
                autoComplete="current-password"
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
              disabled={isSigningInEmail}
              className={`w-full text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isSigningInEmail
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSigningInEmail ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Google Login */}
        {activeLoginMethod === "google" && (
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isSigningInGoogle}
              className={`w-full border border-gray-300 text-gray-700 py-2 rounded-md flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                isSigningInGoogle
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
                {isSigningInGoogle ? "Signing in..." : "Sign in with Google"}
              </span>
            </button>
          </div>
        )}

        {/* Phone Login */}
        {activeLoginMethod === "phone" && (
          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+971">+971</option>
                  <option value="+61">+61</option>
                </select>
                <input
                  id="phone"
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
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
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

        {/* Divider + Login method selector */}
        <div className="mt-8">
          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500">or login with</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4">
            <button
              onClick={() => switchLoginMethod("email")}
              className={`p-3 rounded-full ${
                activeLoginMethod === "email"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              } hover:bg-blue-50 transition`}
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
              onClick={() => switchLoginMethod("google")}
              className={`p-3 rounded-full ${
                activeLoginMethod === "google"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              } hover:bg-blue-50 transition`}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </button>
            <button
              onClick={() => switchLoginMethod("phone")}
              className={`p-3 rounded-full ${
                activeLoginMethod === "phone"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              } hover:bg-blue-50 transition`}
            >
              <FaPhone className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div id="recaptcha-container" />

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
