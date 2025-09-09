# backend/symptom_suggestions.py
import os
import pandas as pd
from fastapi import FastAPI, Query

app = FastAPI(title="Symptom Suggestions API")

# -----------------------------
# 1. Load Dataset Safely
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "Symptom-severity.csv")

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

symptom_severity = pd.read_csv(DATA_PATH)
ALL_SYMPTOMS = (
    symptom_severity["Symptom"]
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
    .tolist()
)

# -----------------------------
# 2. Root Route
# -----------------------------
@app.get("/")
def root():
    return {"message": "✅ Symptom Suggestions API is running"}

# -----------------------------
# 3. Suggestion (Autocomplete + Pairing)
# -----------------------------
@app.get("/suggest")
def suggest(symptom: str = Query(..., description="Enter a symptom (partial or full)")):
    """
    Autocomplete symptom names + suggest related group if exact match.
    """
    symptom = symptom.lower().replace(" ", "_")

    # Autocomplete suggestions
    autocomplete_matches = [s for s in ALL_SYMPTOMS if symptom in s][:10]

    response = {"input": symptom, "autocomplete": autocomplete_matches, "pair_suggestions": []}

    # Pair suggestions (simple heuristic: neighbors in list)
    if symptom in ALL_SYMPTOMS:
        idx = ALL_SYMPTOMS.index(symptom)
        group = [symptom]
        if idx + 1 < len(ALL_SYMPTOMS):
            group.append(ALL_SYMPTOMS[idx + 1])
        if idx + 2 < len(ALL_SYMPTOMS):
            group.append(ALL_SYMPTOMS[idx + 2])
        response["pair_suggestions"].append({"symptoms": group})

    return response
