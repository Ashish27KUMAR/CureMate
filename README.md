# 🏥 CureMate – Smart Healthcare Assistance Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-precuremate.vercel.app-blue)](https://precuremate.vercel.app/)

CureMate is a **web-based intelligent healthcare assistant** built to help users check symptoms, access medical information, and maintain their personal health profile.  
The system uses **React + TailwindCSS** for UI and a **Python-based Machine Learning backend** for prediction tasks.  
**Firebase Authentication & Firestore Database** ensure secure login and real-time data storage.

---

## 🚀 Features

### 🔹 Core User Features
- **ML-Based Symptom Checker**  
- **Disease & Medicine Information Lookup**
- **User Health Dashboard**
- **Daily Health Tips**
- **Emergency Care Information**
- **Chat-Based Support System**

### 🔹 System Features
- **Firebase Authentication (Secure Login)**
- **Firebase Firestore Database**
- **Python Machine Learning Model (Scikit-learn)**
- **Modern UI with React + TailwindCSS**
- **High-Performance API Integration**

---

## 🏗️ System Architecture

              ┌───────────────────────────┐
              │         Frontend           │
              │   React + TailwindCSS      │
              └──────────────┬────────────┘
                             │
                             ▼
                 FastAPI Request/Response
                             │
                             ▼
        ┌──────────────────────────────────────┐
        │          ML Backend (Python)         │
        │  NumPy | Pandas | Scikit-learn       │
        └──────────────────────┬───────────────┘
                               │
                               ▼
    ┌───────────────────────────────────────────┐
    │                Firebase                    │
    │  Authentication | Firestore Database       │
    └───────────────────────────────────────────┘

---

## ⚙️ Tech Stack

### **Frontend**
- React.js  
- TailwindCSS  
- Axios for API requests

### **Backend (Machine Learning)**
- Python  
- NumPy  
- Pandas  
- Scikit-learn  
- Flask / FastAPI (for API integration)

### **Database**
- **Firebase Firestore Database** (User profiles, symptoms, history)

### **Authentication**
- **Firebase Authentication**  
  - Email/Password signup  
  - Google Authentication (optional)
  - Phone Number (optional)

### **Deployment**
- Frontend → **Vercel**  
- Backend (Python ML API) → **Render**  
- Firebase → **Google Cloud**

---

## 📸 Screenshots

### 🖥️ **Homepage**
<p align="center">
  <img src="https://github.com/user-attachments/assets/03fd56d1-58b8-47e6-b8c5-d2fc60e8a582" 
       alt="CureMate Homepage" 
       width="700">
</p>

---

### 🧠 **Symptom Checker**
<p align="center">
  <img src="https://github.com/user-attachments/assets/f529c08a-5bb4-4326-8739-61b023765715"
       alt="Symptom Checker" 
       width="700">
</p>

---

### 📊 **Profile Dashboard**
<p align="center">
  <img src="https://github.com/user-attachments/assets/87c5a5e1-59cc-4d65-b97f-269373824147"
       alt="User Dashboard" 
       width="700">
</p>

---

### 🔐 **Login & Authentication**
<p align="center">
  <img src="https://github.com/user-attachments/assets/34902443-2288-458e-9aca-eb868f44008f"
       alt="Login Page" 
       width="700">
</p>

---

### 👨‍⚕️ **Support**
<p align="center">
  <img src="https://github.com/user-attachments/assets/a09d2b00-829e-4073-854e-12add7126297"
       alt="Doctor Info Page" 
       width="700">
</p>
