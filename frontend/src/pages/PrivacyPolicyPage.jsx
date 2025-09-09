// src/pages/PrivacyPolicyPage.jsx
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 leading-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          We are committed to protecting and respecting your privacy. Please
          read this Privacy Policy to understand how we collect, use, and
          protect your personal information.
        </p>
      </div>

      {/* Introduction */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Introduction
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          This Privacy Policy outlines the information we collect, how we use
          it, and the measures we take to ensure your privacy is protected. By
          using our services, you agree to the terms outlined in this policy.
        </p>
      </section>

      {/* Information We Collect */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Information We Collect
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We collect personal information to provide you with a more
          personalized experience. The information we may collect includes:
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700 mt-4">
          <li>
            Personal details such as your name, email address, and phone number.
          </li>
          <li>
            Health information like medical history, symptoms, and health
            conditions.
          </li>
          <li>
            Usage data, such as how you interact with our app and services.
          </li>
          <li>
            Location information, if enabled by you, to provide location-based
            services.
          </li>
        </ul>
      </section>

      {/* How We Use Your Information */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          How We Use Your Information
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We use the information we collect for the following purposes:
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700 mt-4">
          <li>
            To provide healthcare insights, symptom checking, and relevant
            advice.
          </li>
          <li>To personalize and improve your experience with our services.</li>
          <li>
            To communicate with you about your account, updates, and relevant
            services.
          </li>
          <li>
            To comply with legal obligations, such as data protection laws.
          </li>
        </ul>
      </section>

      {/* Sharing Your Information */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Sharing Your Information
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We do not share your personal information with third parties except in
          the following cases:
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700 mt-4">
          <li>
            With your explicit consent or when necessary to provide services you
            request.
          </li>
          <li>
            With trusted service providers who help us operate our app and
            perform necessary functions.
          </li>
          <li>
            When required by law or in response to legal requests, such as
            subpoenas or court orders.
          </li>
        </ul>
      </section>

      {/* Data Security */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Data Security
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We take the security of your personal information seriously and
          implement appropriate technical and organizational measures to protect
          it from unauthorized access, disclosure, alteration, or destruction.
        </p>
      </section>

      {/* Your Rights */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Your Rights
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700 mt-4">
          <li>
            The right to access the personal information we hold about you.
          </li>
          <li>
            The right to request corrections or updates to your information.
          </li>
          <li>
            The right to request the deletion of your information under certain
            circumstances.
          </li>
          <li>
            The right to object to or restrict the processing of your data in
            some cases.
          </li>
        </ul>
      </section>

      {/* Changes to This Privacy Policy */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Changes to This Privacy Policy
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and we will update the "Last Updated" date at
          the bottom. We encourage you to review this page periodically.
        </p>
      </section>

      {/* Contact Us */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          If you have any questions about this Privacy Policy or our practices,
          please contact us at:
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Email:{" "}
          <a
            href="mailto:support@healthcareapp.com"
            className="text-blue-500 hover:text-blue-700 "
          >
            curemate.project@gmail.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">Last Updated: September 2025</p>
      </div>
    </div>
  );
}
