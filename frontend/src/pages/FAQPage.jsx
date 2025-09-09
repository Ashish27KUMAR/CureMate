import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing the search icon from react-icons

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ data with updated answers
  const faqs = [
    {
      category: "General",
      question: "What is Symptom Checker?",
      answer:
        "Symptom Checker is a tool that helps you identify possible diseases based on the symptoms you provide.",
    },
    {
      category: "Usage",
      question: "How do I use the Symptom Checker?",
      answer:
        "You simply type the symptoms you are experiencing in the input field, and the tool will provide predictions based on your symptoms.",
    },
    {
      category: "Account",
      question: "Do I need to be logged in to use the Symptom Checker?",
      answer:
        "Yes, you need to be logged in to use the Symptom Checker. Logging in allows you to save your symptoms and predictions for future reference in the History page.",
    },
    {
      category: "Accuracy",
      question: "How accurate is the Symptom Checker?",
      answer:
        "The Symptom Checker provides general predictions based on available data, but it’s important to consult a healthcare professional for an accurate diagnosis.",
    },
    {
      category: "Functionality",
      question: "Can I add multiple symptoms?",
      answer:
        "Yes, you can add multiple symptoms and the tool will predict possible conditions based on the combination of symptoms.",
    },
    {
      category: "Cost",
      question: "Is the Symptom Checker free to use?",
      answer: "Yes, the Symptom Checker is completely free to use.",
    },
    {
      category: "Privacy",
      question: "Is my data stored when I use the Symptom Checker?",
      answer:
        "Yes, your data is securely stored in your account history so you can review your past predictions anytime. We prioritize your privacy and ensure your data is protected.",
    },
    {
      category: "Privacy",
      question: "Is my information shared with third parties?",
      answer:
        "No, we do not share your personal information with third parties. Your data is confidential and only used for providing predictions during your session.",
    },
    {
      category: "Troubleshooting",
      question: "Why am I not getting results from the Symptom Checker?",
      answer:
        "If you're not getting results, please ensure you're entering the symptoms correctly and try again. If the issue persists, refresh the page or try using a different browser.",
    },
    {
      category: "Technical",
      question: "What browsers are supported for Symptom Checker?",
      answer:
        "The Symptom Checker works best with modern browsers such as Chrome, Firefox, Safari, and Edge. Ensure you're using the latest version of your browser for optimal performance.",
    },
    {
      category: "Account",
      question: "How do I reset my password?",
      answer:
        "Password reset functionality is coming soon. Please check back later for updates.",
    },
    {
      category: "Account",
      question: "How can I delete my account?",
      answer:
        "You can delete your account from the account settings page. If you need assistance, please contact our support team.",
    },
    {
      category: "Accuracy",
      question: "Can Symptom Checker diagnose all diseases?",
      answer:
        "No, the Symptom Checker is a general tool for predicting possible conditions based on symptoms. It cannot diagnose every disease and should not replace professional medical advice.",
    },
    {
      category: "Cost",
      question: "Are there any paid features in Symptom Checker?",
      answer:
        "Currently, Symptom Checker is completely free with no paid features. We aim to provide access to all users without any cost barriers.",
    },
    {
      category: "Miscellaneous",
      question: "Can I use Symptom Checker on mobile devices?",
      answer:
        "Yes, the Symptom Checker is fully responsive and can be used on mobile devices, including smartphones and tablets.",
    },
    {
      category: "Miscellaneous",
      question: "How do I contact customer support?",
      answer:
        "You can contact our customer support team by visiting the 'Support Page' in the menu. Our team is available to assist you with any questions or issues you may have.",
    },
  ];

  // Toggle FAQ visibility
  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle the search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear the search query
  const handleClearSearch = () => {
    setSearchQuery(""); // Reset search query to empty
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-blue-600">
        ❓Frequently Asked Questions❓
      </h2>

      {/* Search Input with Clear Button */}
      <div className="mb-6 relative">
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaSearch className="h-5 w-5" />
        </div>

        <input
          type="text"
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* Clear Button (visible when text is present) */}
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            ✖️
          </button>
        )}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => handleToggle(index)}
                className={`w-full flex justify-between items-center text-left text-base sm:text-lg font-medium py-3 px-4 rounded-t-lg transition-colors duration-200 ${
                  activeIndex === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-blue-500 hover:text-white"
                }`}
                aria-expanded={activeIndex === index}
              >
                {faq.question}
                <span className="ml-2 text-xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {/* Answer with animation */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 py-3 bg-gray-50 text-gray-700 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No FAQs found for your search.
          </p>
        )}
      </div>

      {/* Scroll to Top Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
        >
          Back to Top
        </button>
      </div>
    </div>
  );
}
