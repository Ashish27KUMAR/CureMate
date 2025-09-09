// src/pages/SupportPage.jsx
import React, { useState } from "react";
import emailjs from "emailjs-com"; // Import EmailJS

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation check
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("Please fill in all fields.");
      return;
    }

    setFormStatus("Submitting...");

    // EmailJS service and template configuration
    const serviceID = "service_szlixgn"; // Replace with your EmailJS service ID
    const templateID = "template_d7vgamp"; // Replace with your EmailJS template ID
    const userID = "Lwlg1_yOD-zq1sscg"; // Replace with your EmailJS user ID

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: "Support Request",
      message: formData.message,
    };

    try {
      // Send the email using EmailJS
      await emailjs.send(serviceID, templateID, templateParams, userID);
      setFormStatus(
        "Your message has been sent! We will get back to you soon."
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      setFormStatus("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Support
      </h2>

      <p className="mb-4 text-lg text-center text-gray-700">
        If you have any questions or need assistance, feel free to reach out to
        us. We are here to help!
      </p>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter your message"
            required
          />
        </div>

        <div className="flex space-x-2 justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Message
          </button>
          <button
            type="button"
            onClick={() => setFormData({ name: "", email: "", message: "" })}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Form Status */}
      {formStatus && (
        <div className="mt-4 text-sm text-center text-gray-600">
          {formStatus}
        </div>
      )}

      {/* Support Information */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Need Further Help?</h3>
        <p className="mb-2">
          You can also reach us through the following ways:
        </p>
        <ul className="list-disc pl-6">
          <li>
            Email:{" "}
            <a
              href="mailto:curemate.project@gmail.com"
              className="text-blue-500 hover:text-blue-700"
            >
              curemate.project@gmail.com
            </a>
          </li>

          <li>
            Phone:{" "}
            <span className="text-blue-500 hover:text-blue-700">
              +91 993**1 90***
            </span>
          </li>
          <li>Live Chat: Available 24/7 on our website.</li>
        </ul>
      </div>
    </div>
  );
}
