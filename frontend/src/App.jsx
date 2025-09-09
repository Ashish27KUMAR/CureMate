// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home.jsx";
import SymptomChecker from "./pages/SymptomChecker.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import Footer from "./components/Footer.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import TermsOfServicePage from "./pages/TermsOfServicePage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import PageWrapper from "./components/PageWrapper.jsx";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/symptom-checker"
          element={
            <PageWrapper>
              <SymptomChecker />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/history"
          element={
            <PageWrapper>
              <History />
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper>
              <Profile />
            </PageWrapper>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <PageWrapper>
              <HowItWorks />
            </PageWrapper>
          }
        />
        <Route
          path="/faq"
          element={
            <PageWrapper>
              <FAQPage />
            </PageWrapper>
          }
        />
        <Route
          path="/support"
          element={
            <PageWrapper>
              <SupportPage />
            </PageWrapper>
          }
        />
        <Route
          path="/about-us"
          element={
            <PageWrapper>
              <AboutUsPage />
            </PageWrapper>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageWrapper>
              <PrivacyPolicyPage />
            </PageWrapper>
          }
        />
        <Route
          path="/terms"
          element={
            <PageWrapper>
              <TermsOfServicePage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className=" h-screen flex-1 w-full">
          <ScrollToTop />
          <AnimatedRoutes /> {/* ✅ Now animated */}
        </main>
        <Footer />
      </div>
    </Router>
  );
}
