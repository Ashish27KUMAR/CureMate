import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  // Load profile data
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setFullName(data.fullName || "");
          setDob(data.dob || "");
          setBloodGroup(data.bloodGroup || "");
          setGender(data.gender || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
    loadProfile();
  }, [user]);

  // Handle Save
  async function handleSave(e) {
    e.preventDefault();
    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      setSaving(true);
      await setDoc(
        doc(db, "users", user.uid),
        { fullName, dob, bloodGroup, gender },
        { merge: true }
      );
      alert("✅ Profile saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("❌ Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  // Handle Delete
  async function handleDeleteAccount() {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const password = prompt(
          "Please enter your password to confirm account deletion:"
        );

        if (password) {
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);
          await deleteUser(user);
          alert("Your account has been deleted.");
          window.location.href = "/login"; // Redirect to login page
        } else {
          alert("Account deletion cancelled.");
        }
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/requires-recent-login") {
        setError("You need to sign in again to delete your account.");
      } else {
        setError("Failed to delete account. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  }

  // Display Helpers
  const avatarLetter = fullName
    ? fullName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "?";

  const accountCreationDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "N/A";

  const accountCreationTime = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleTimeString()
    : "N/A";

  const accountCreationDay = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString("en-US", {
        weekday: "long",
      })
    : "N/A";

  const userId = user?.phoneNumber || user?.email || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-blue-600 text-white text-3xl font-bold shadow-md">
              {avatarLetter}
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
              Edit Your Profile
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Update your personal information below
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSave}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Button Row */}
            <div className="col-span-full flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setShowAccountDetails(!showAccountDetails)}
                className="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
              >
                {showAccountDetails ? "Hide Account Info" : "Show Account Info"}
              </button>
            </div>
          </form>

          {/* Account Info Section */}
          {showAccountDetails && (
            <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-inner text-sm text-gray-700 space-y-1">
              <p>
                <strong>Date:</strong> {accountCreationDate}
              </p>
              <p>
                <strong>Time:</strong> {accountCreationTime}
              </p>
              <p>
                <strong>Day:</strong> {accountCreationDay}
              </p>
              <p>
                <strong>ID:</strong> {userId}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
          )}

          {/* Delete Button */}
          <div className="mt-10">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="w-full bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
