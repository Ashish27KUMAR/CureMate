import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import APIRouter, Depends, HTTPException, Header
from dotenv import load_dotenv

# Load local .env if present (for local dev)
load_dotenv()

# Get Firebase credentials from environment variables
firebase_credentials_json = os.getenv("FIREBASE_CREDENTIALS")  # JSON string for Render
firebase_cred_path = os.getenv("FIREBASE_CRED_PATH")          # File path for local dev

if not firebase_admin._apps:
    if firebase_credentials_json:
        # Running on Render or similar: load credentials from JSON string env var
        try:
            cred_dict = json.loads(firebase_credentials_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("Firebase initialized using JSON string from env variable")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in FIREBASE_CREDENTIALS: {str(e)}")
    elif firebase_cred_path:
        # Running locally: load credentials from local JSON file path
        if not os.path.exists(firebase_cred_path):
            raise FileNotFoundError(f"Firebase credential file not found at {firebase_cred_path}")
        cred = credentials.Certificate(firebase_cred_path)
        firebase_admin.initialize_app(cred)
        print(f"Firebase initialized using credential file at {firebase_cred_path}")
    else:
        raise ValueError(
            "No Firebase credentials found. "
            "Set FIREBASE_CREDENTIALS (JSON string) or FIREBASE_CRED_PATH (file path)"
        )

router = APIRouter(prefix="/auth", tags=["Auth"])

def verify_firebase_token(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid auth header")
        id_token = authorization.split(" ")[1]
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

@router.get("/me")
def get_current_user(user=Depends(verify_firebase_token)):
    return {
        "uid": user["uid"],
        "email": user.get("email"),
        "phone": user.get("phone_number"),
    }
