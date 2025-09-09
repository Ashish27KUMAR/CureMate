import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# -----------------------------
# 1. Load Dataset
# -----------------------------
DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/Training.csv")
df = pd.read_csv(DATA_PATH)

# Features (all symptoms) and target (disease)
X = df.drop(columns=["prognosis"])
y = df["prognosis"]

# -----------------------------
# 2. Split Dataset
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# 3. Train Model
# -----------------------------
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# -----------------------------
# 4. Save Model
# -----------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "disease_model.pkl")
joblib.dump(model, MODEL_PATH)

print(f"✅ Model trained and saved at {MODEL_PATH}")
