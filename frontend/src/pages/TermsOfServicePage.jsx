// src/pages/TermsOfServicePage.jsx
import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 leading-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          Please read these Terms of Service carefully before using our
          services. By accessing or using our CureMate, you agree to comply with
          and be bound by the terms outlined in this agreement.
        </p>
      </div>

      {/* Introduction */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Introduction
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          These Terms of Service govern your use of our app and services. By
          accessing or using our app, you acknowledge and agree to these terms.
          If you do not agree with any part of these terms, you should not use
          our services.
        </p>
      </section>

      {/* Acceptance of Terms */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Acceptance of Terms
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          By using our app or services, you agree to be bound by these Terms of
          Service and our Privacy Policy. If you are using the services on
          behalf of an organization, you represent and warrant that you have the
          authority to bind the organization to these terms.
        </p>
      </section>

      {/* User Accounts */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          User Accounts
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          To access certain features of the app, you may be required to create
          an account. You are responsible for maintaining the confidentiality of
          your account credentials and agree to notify us immediately of any
          unauthorized access or use of your account.
        </p>
      </section>

      {/* Use of Services */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Use of Services
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our CureMate and services are intended for informational and
          educational purposes only. The app does not replace professional
          medical advice, diagnosis, or treatment. You should always seek the
          advice of a qualified healthcare provider for any medical conditions.
        </p>
      </section>

      {/* Restrictions on Use */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Restrictions on Use
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          You agree not to use our services for any unlawful purpose, including
          but not limited to:
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700 mt-4">
          <li>
            Engaging in activities that violate any applicable laws or
            regulations.
          </li>
          <li>
            Attempting to gain unauthorized access to our app or other systems.
          </li>
          <li>
            Using the app to spread malicious code or engage in data theft.
          </li>
          <li>
            Posting content that is abusive, defamatory, or otherwise harmful.
          </li>
        </ul>
      </section>

      {/* Limitation of Liability */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Limitation of Liability
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          To the maximum extent permitted by law, we are not liable for any
          direct, indirect, incidental, special, or consequential damages
          arising from your use or inability to use our services, even if we
          have been advised of the possibility of such damages.
        </p>
      </section>

      {/* Termination */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Termination
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We reserve the right to suspend or terminate your account or access to
          the services at our discretion, without notice, for any reason,
          including but not limited to violation of these Terms of Service.
        </p>
      </section>

      {/* Indemnification */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Indemnification
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          You agree to indemnify and hold harmless our company, employees,
          officers, and agents from any claims, damages, liabilities, or
          expenses arising from your use of the services or violation of these
          Terms of Service.
        </p>
      </section>

      {/* Governing Law */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Governing Law
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          These Terms of Service shall be governed by and construed in
          accordance with the laws of the jurisdiction in which we operate,
          without regard to its conflict of law principles.
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Changes to Terms
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We may update these Terms of Service from time to time. Any changes
          will be effective immediately upon posting on this page. It is your
          responsibility to review these terms periodically for any updates.
        </p>
      </section>

      {/* Contact Information */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          If you have any questions about these Terms of Service, please contact
          us at:
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Email:{" "}
          <a
            href="mailto:curemate.project@gmail.com"
            className="text-blue-500 hover:text-blue-700"
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
