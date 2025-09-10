// src/pages/HowItWorks.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  // Check login state (example: token stored in localStorage after login)
  const isLoggedIn = !!localStorage.getItem("token");

  const steps = [
    {
      title: "Step 1: Sign Up",
      description:
        "Create your free account to get started. You can register using your email or social login.",
      link: !isLoggedIn ? "/register" : null,
      linkText: "Register Now",
    },
    {
      title: "Step 2: Complete Your Profile",
      description:
        "Fill in your personal details and medical history in your profile. This helps us provide better insights for you.",
    },
    {
      title: "Step 3: Use the Symptom Checker",
      description:
        "Enter your symptoms and get AI-powered health insights instantly. This helps you understand possible conditions.",
      link: "/symptom-checker",
      linkText: "Try Symptom Checker",
    },
    {
      title: "Step 4: Track Your History",
      description:
        "All your past symptom checks are saved in your history. You can revisit them anytime for easy reference.",
      link: "/history",
      linkText: "View History",
    },
    {
      title: "Step 5: Get Support",
      description:
        "Need help? Reach out to our support team directly from the app for guidance and assistance.",
      link: "/support",
      linkText: "Contact Support",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-blue-600 mb-10">
        How It Works
      </h1>

      {/* Intro */}
      <section className="mb-12 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-500 mb-4">
          Introduction
        </h2>
        <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Our CureMate app helps you check symptoms, manage your health history,
          and stay in control of your well-being. The process is quick, simple,
          and user-friendly.
        </p>
      </section>

      {/* Steps */}
      <div className="grid gap-8 sm:grid-cols-2">
        {steps.map((step, index) => (
          <section
            key={index}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-blue-500 mb-3">
              {step.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{step.description}</p>
            {step.link && (
              <div className="mt-4">
                <Link
                  to={step.link}
                  className="inline-block px-5 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  {step.linkText}
                </Link>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <section className="mt-16 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-500 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
          Join us today and start using the Symptom Checker to take charge of
          your health. Your journey to better healthcare starts here.
        </p>

        {!isLoggedIn && (
          <Link
            to="/register"
            className="inline-block px-6 py-3 text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition-colors text-base sm:text-lg"
          >
            Register Now
          </Link>
        )}
      </section>
    </div>
  );
}
