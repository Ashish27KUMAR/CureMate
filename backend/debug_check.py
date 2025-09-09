import pandas as pd
import os

BASE_DIR = os.path.dirname(__file__)

# FIX: use backend/data instead of ../data
symptom_severity = pd.read_csv(os.path.join(BASE_DIR, "data/Symptom-severity.csv"))
train_df = pd.read_csv(os.path.join(BASE_DIR, "data/Training.csv"))

print("=== From Symptom-severity.csv ===")
print(symptom_severity.head())
print("Unique symptoms (first 20):")
print(symptom_severity['Symptom'].unique()[:20])

print("\n=== From Training.csv ===")
print("Columns (first 20):")
print(train_df.columns[:20].tolist())
