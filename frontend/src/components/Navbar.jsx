import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/Navbar_logo.png"; // Adjust the path as necessary

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) {
      setMenuOpen(false);
    }
  }, [user]);

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const navLinks = (
    <>
      {[
        { path: "/", label: "Home" },
        { path: "/how-it-works", label: "How It Works" },
        { path: "/faq", label: "FAQ" },
        { path: "/support", label: "Support" },
        { path: "/about-us", label: "About Us" },
        { path: "/privacy-policy", label: "Privacy Policy" },
        { path: "/terms", label: "Terms" },
      ].map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `px-2 py-1 rounded ${
              isActive
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "hover:text-blue-600"
            }`
          }
          onClick={() => setMobileMenu(false)}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <nav className="bg-white shadow p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <NavLink to="/" className="flex items-center">
          <img src={logo} alt="CureMate Logo" className="h-8 w-auto mr-2" />
          <span className="text-lg font-bold text-blue-600">CureMate</span>
        </NavLink>

        <div className="hidden lg:flex space-x-4 items-center">
          {navLinks}

          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
              }
            >
              Login
            </NavLink>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center focus:outline-none"
              >
                <FaUserCircle className="text-2xl text-gray-700 hover:text-blue-500 cursor-pointer" />
              </button>

              <div
                className={`absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg p-3 z-50 transform transition-all duration-200 ease-out ${
                  menuOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `block px-2 py-1 rounded ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  History
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `block px-2 py-1 rounded ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Edit Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="lg:hidden text-2xl text-gray-700"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle menu"
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {mobileMenu && (
        <>
          <div
            onClick={() => setMobileMenu(false)}
            className="fixed left-0 right-0 bottom-0 z-40 backdrop-blur-[2px]"
            style={{ top: "64px" }} // Change to navbar height if different
            aria-hidden="true"
          ></div>

          <div
            ref={mobileMenuRef}
            className="lg:hidden absolute right-4 top-16 bg-white border rounded shadow-lg w-56 p-2 flex flex-col z-50"
          >
            {[
              { path: "/", label: "Home" },
              { path: "/how-it-works", label: "How It Works" },
              { path: "/faq", label: "FAQ" },
              { path: "/support", label: "Support" },
              { path: "/about-us", label: "About Us" },
              { path: "/privacy-policy", label: "Privacy Policy" },
              { path: "/terms", label: "Terms" },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block w-full px-4 py-2 rounded text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
                onClick={() => setMobileMenu(false)}
              >
                {link.label}
              </NavLink>
            ))}

            {!user ? (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block w-full px-4 py-2 rounded text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
                onClick={() => setMobileMenu(false)}
              >
                Login
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `block w-full px-4 py-2 rounded text-left ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`
                  }
                  onClick={() => setMobileMenu(false)}
                >
                  History
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `block w-full px-4 py-2 rounded text-left ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`
                  }
                  onClick={() => setMobileMenu(false)}
                >
                  Edit Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
