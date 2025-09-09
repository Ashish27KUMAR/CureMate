import os
import joblib
import pandas as pd
import ast  # safer than eval()

# -----------------------------
# 1. Load Trained Model
# -----------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "disease_model.pkl")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"❌ Model file not found: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

# -----------------------------
# 2. Load Datasets
# -----------------------------
BASE_DIR = os.path.dirname(__file__)

train_df = pd.read_csv(os.path.join(BASE_DIR, "../data/Training.csv"))
SYMPTOM_COLUMNS = (
    train_df.drop(columns=["prognosis"])
    .columns.str.strip()
    .str.lower()
    .str.replace(" ", "_")
    .tolist()
)

symptom_severity = pd.read_csv(os.path.join(BASE_DIR, "../data/Symptom-severity.csv"))
VALID_SYMPTOMS = set(
    symptom_severity["Symptom"].str.strip().str.lower().str.replace(" ", "_").tolist()
)

desc_df = pd.read_csv(os.path.join(BASE_DIR, "../data/description.csv"))
meds_df = pd.read_csv(os.path.join(BASE_DIR, "../data/medications.csv"))
diets_df = pd.read_csv(os.path.join(BASE_DIR, "../data/diets.csv"))
prec_df = pd.read_csv(os.path.join(BASE_DIR, "../data/precautions_df.csv"))
workout_df = pd.read_csv(os.path.join(BASE_DIR, "../data/workout_df.csv"))

# -----------------------------
# 3. Aliases (user-friendly → dataset)
# -----------------------------
SYMPTOM_ALIASES = {
    "fever": "high_fever",
    "high fever": "high_fever",
    "cold": "chills",
    "chill": "chills",
    "tired": "fatigue",
    "tiredness": "fatigue",
    "head pain": "headache",
    "stomach ache": "stomach_pain",
    "vomit": "vomiting",
    "loss of appetite": "loss_of_appetite",
}

# -----------------------------
# 4. Helpers
# -----------------------------
def normalize_symptom(symptom: str) -> str:
    """Standardize symptom to match dataset format"""
    s = symptom.strip().lower().replace(" ", "_")
    return SYMPTOM_ALIASES.get(s, s)


def clean_values(values):
    """Clean messy CSV values into a unique list of strings"""
    cleaned = []
    for v in values:
        if pd.isna(v):
            continue
        if isinstance(v, (int, float)):
            continue
        if isinstance(v, str):
            v = v.strip()
            # Handle list-like strings safely
            if v.startswith("[") and v.endswith("]"):
                try:
                    v_list = ast.literal_eval(v)
                    if isinstance(v_list, (list, tuple)):
                        cleaned.extend([x for x in v_list if isinstance(x, str)])
                        continue
                except Exception:
                    pass
        cleaned.append(v)
    return sorted(set(cleaned)) if cleaned else ["Not available"]

# -----------------------------
# 5. Prediction Function
# -----------------------------
def predict_disease(symptoms: list[str]) -> dict:
    """
    symptoms: list of user-provided symptom names
    returns: dictionary with disease info
    """
    # Normalize
    normalized = [normalize_symptom(s) for s in symptoms]

    # Keep only valid symptoms (warn but don’t fail)
    valid = [s for s in normalized if s in VALID_SYMPTOMS or s in SYMPTOM_COLUMNS]
    invalid = [s for s in normalized if s not in VALID_SYMPTOMS and s not in SYMPTOM_COLUMNS]

    if not valid:
        return {
            "symptoms": symptoms,
            "normalized": normalized,
            "error": "No valid symptoms provided."
        }

    # Create input vector
    input_data = [0] * len(SYMPTOM_COLUMNS)
    for s in valid:
        if s in SYMPTOM_COLUMNS:
            idx = SYMPTOM_COLUMNS.index(s)
            input_data[idx] = 1

    # Predict disease
    disease = model.predict([input_data])[0]

    # Fetch info
    description = (
        desc_df.loc[desc_df["Disease"] == disease, "Description"].values[0]
        if disease in desc_df["Disease"].values else "Not available"
    )

    medications = (
        meds_df[meds_df["Disease"] == disease].drop(columns=["Disease"]).values.flatten().tolist()
        if disease in meds_df["Disease"].values else []
    )
    diets = (
        diets_df[diets_df["Disease"] == disease].drop(columns=["Disease"]).values.flatten().tolist()
        if disease in diets_df["Disease"].values else []
    )
    precautions = (
        prec_df[prec_df["Disease"] == disease].drop(columns=["Disease"]).values.flatten().tolist()
        if disease in prec_df["Disease"].values else []
    )
    workouts = (
        workout_df[workout_df["Disease"] == disease].drop(columns=["Disease"]).values.flatten().tolist()
        if disease in workout_df["Disease"].values else []
    )

    # Final response
    return {
        "symptoms": symptoms,
        "normalized": valid,
        "invalid": invalid,
        "predicted_disease": disease,
        "description": description,
        "medications": clean_values(medications),
        "diets": clean_values(diets),
        "precautions": clean_values(precautions),
        "workouts": clean_values(workouts),
    }
