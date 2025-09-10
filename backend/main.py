# health_care/backend/main.py
import os
import json
from datetime import datetime
import pandas as pd
from fastapi import FastAPI, Query, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.security import HTTPBearer
from firebase_admin import auth as firebase_auth

# ML predictor (your existing module)
from model.predictor import predict_disease

# Firebase Admin
import firebase_admin
from firebase_admin import credentials, firestore

# -----------------------------
# App init
# -----------------------------
app = FastAPI(
    title="Healthcare ML Backend 🚀",
    description="FastAPI backend for symptom suggestion and disease prediction",
    version="1.0.0",
)

# Allow frontend (during dev) - tighten before production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # set ["http://localhost:5173"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -----------------------------
# Firebase Admin init
# -----------------------------
firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")  # JSON string env var
firebase_cred_path = os.getenv("FIREBASE_CRED_PATH")  # optional file path env var fallback

if not firebase_admin._apps:
    if firebase_credentials:
        # Initialize Firebase from JSON string env var (production)
        try:
            cred_dict = json.loads(firebase_credentials)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Failed to parse FIREBASE_CREDENTIALS env var: {e}")
    elif firebase_cred_path and os.path.exists(firebase_cred_path):
        # Initialize Firebase from local file path (dev)
        cred = credentials.Certificate(firebase_cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback: check default local file (for local dev)
        default_path = os.path.join(BASE_DIR, "firebase-service-account.json")
        if os.path.exists(default_path):
            cred = credentials.Certificate(default_path)
            firebase_admin.initialize_app(cred)
        else:
            raise FileNotFoundError(
                "Missing Firebase credentials. "
                "Set FIREBASE_CREDENTIALS env var (JSON string), or "
                "FIREBASE_CRED_PATH env var (file path), or place 'firebase-service-account.json' locally."
            )

# Firestore client
db = firestore.client()


# -----------------------------
# Load dataset files
# -----------------------------
DATA_DIR = os.path.join(BASE_DIR, "data")
SYMPTOM_FILE = os.path.join(DATA_DIR, "Symptom-severity.csv")
TRAIN_FILE = os.path.join(DATA_DIR, "Training.csv")
BUNDLE_FILE = os.path.join(DATA_DIR, "symptom_bundles.json")

if not os.path.exists(SYMPTOM_FILE) or not os.path.exists(TRAIN_FILE):
    raise FileNotFoundError("Missing dataset files in /data directory")

symptom_severity = pd.read_csv(SYMPTOM_FILE)
ALL_SYMPTOMS = (
    symptom_severity["Symptom"].str.strip().str.lower().str.replace(" ", "_").tolist()
)

train_df = pd.read_csv(TRAIN_FILE)
SYMPTOM_COLUMNS = train_df.drop(columns=["prognosis"]).columns.str.strip().str.lower().tolist()

if os.path.exists(BUNDLE_FILE):
    with open(BUNDLE_FILE, "r") as f:
        SYMPTOM_BUNDLES = json.load(f)
else:
    SYMPTOM_BUNDLES = {}
    for symptom in SYMPTOM_COLUMNS:
        subset = train_df[train_df[symptom] == 1]
        co_counts = subset[SYMPTOM_COLUMNS].sum().sort_values(ascending=False)
        co_counts = co_counts.drop(symptom, errors="ignore")
        top_related = co_counts.head(3).index.tolist()
        if top_related:
            SYMPTOM_BUNDLES[symptom] = [symptom] + top_related
    with open(BUNDLE_FILE, "w") as f:
        json.dump(SYMPTOM_BUNDLES, f, indent=2)

# -----------------------------
# Request models
# -----------------------------
class SymptomRequest(BaseModel):
    symptoms: list[str]


# -----------------------------
# Helper: verify firebase token dependency
# -----------------------------
def verify_firebase_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    id_token = authorization.split(" ", 1)[1].strip()
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded  # contains 'uid', 'email', etc.
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")


# -----------------------------
# Root & suggest endpoints
# -----------------------------
@app.get("/")
def root():
    return {"message": "✅ Healthcare ML Backend is running 🚀"}


@app.get("/suggest")
def suggest(symptom: str = Query(..., description="Enter a symptom (partial or full)")):
    if not symptom.strip():
        raise HTTPException(status_code=400, detail="❌ Query cannot be empty")
    normalized = symptom.lower().replace(" ", "_")
    autocomplete_matches = [s for s in ALL_SYMPTOMS if normalized in s][:10]
    response = {"input": normalized, "autocomplete": autocomplete_matches, "pair_suggestions": []}
    if normalized in SYMPTOM_BUNDLES:
        response["pair_suggestions"].append({"symptoms": SYMPTOM_BUNDLES[normalized]})
    return response


# -----------------------------
# /predict - protected
# -----------------------------
@app.post("/predict")
def predict_endpoint(req: SymptomRequest, user=Depends(verify_firebase_token)):
    if not req.symptoms:
        raise HTTPException(status_code=400, detail="❌ Symptoms list cannot be empty")

    try:
        result = predict_disease(req.symptoms)

        uid = user["uid"]
        doc = {
            "symptoms": req.symptoms,
            "result": result,
            "predicted_disease": result.get("predicted_disease"),
            "description": result.get("description"),
            "created_at": datetime.utcnow(),
        }
        db.collection("users").document(uid).collection("history").add(doc)

        return {"input_symptoms": req.symptoms, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# -----------------------------
# /history - list user's history
# -----------------------------
@app.get("/history")
def get_history(user=Depends(verify_firebase_token)):
    uid = user["uid"]
    docs = (
        db.collection("users")
        .document(uid)
        .collection("history")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .stream()
    )
    history = []
    for d in docs:
        row = d.to_dict()
        row["id"] = d.id
        ts = row.get("created_at")
        if hasattr(ts, "isoformat"):
            row["created_at"] = ts.isoformat()
        history.append(row)
    return {"history": history}


# -----------------------------
# /history/{doc_id} - delete single entry
# -----------------------------
@app.delete("/history/{doc_id}")
def delete_history(doc_id: str, user=Depends(verify_firebase_token)):
    uid = user["uid"]
    doc_ref = db.collection("users").document(uid).collection("history").document(doc_id)
    snap = doc_ref.get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Not found")
    doc_ref.delete()
    return {"status": "deleted", "id": doc_id}


# -----------------------------
# /history - clear all entries
# -----------------------------
@app.delete("/history")
def clear_all_history(user=Depends(verify_firebase_token)):
    uid = user["uid"]
    collection_ref = db.collection("users").document(uid).collection("history")
    docs = collection_ref.stream()

    deleted_count = 0
    for doc in docs:
        collection_ref.document(doc.id).delete()
        deleted_count += 1

    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="No history found")

    return {"message": f"Deleted {deleted_count} history records"}
