// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* App Info */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Healthcare App
          </h2>
          <p className="text-gray-400 text-sm">
            Empowering you to take control of your health with ease. Our app
            enables you to track symptoms, monitor your well-being, and make
            informed health decisions, all in a straightforward and efficient
            manner.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/how-it-works"
                className="text-gray-400 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="text-gray-400 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-6 text-2xl">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-500 transition duration-200 ease-in-out"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition duration-200 ease-in-out"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-pink-500 transition duration-200 ease-in-out"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-600 transition duration-200 ease-in-out"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Healthcare App. All rights reserved.
      </div>
    </footer>
  );
}
