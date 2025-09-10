import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import APIRouter, Depends, HTTPException, Header
from dotenv import load_dotenv

# Load local .env if present (for local dev)
load_dotenv()

# First try Render-style JSON credentials
firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")

# If not available, fallback to local JSON file path
firebase_cred_path = os.getenv("FIREBASE_CRED_PATH")

if not firebase_admin._apps:
    if firebase_credentials:
        # Running on Render: credentials stored as JSON in env variable
        cred_dict = json.loads(firebase_credentials)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    elif firebase_cred_path:
        # Running locally: credentials stored in JSON file
        cred = credentials.Certificate(firebase_cred_path)
        firebase_admin.initialize_app(cred)
    else:
        raise ValueError("No Firebase credentials found. Set FIREBASE_CREDENTIALS or FIREBASE_CRED_PATH")

router = APIRouter(prefix="/auth", tags=["Auth"])

# Middleware-like function to verify token
def verify_firebase_token(authorization: str = Header(...)):
    try:
        # Ensure the authorization header starts with "Bearer "
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid auth header")
        
        # Extract the ID token from the Authorization header
        id_token = authorization.split(" ")[1]
        
        # Verify the ID token using Firebase Authentication
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

@router.get("/me")
def get_current_user(user=Depends(verify_firebase_token)):
    """
    Returns the logged-in Firebase user details
    """
    return {
        "uid": user["uid"],
        "email": user.get("email"),
        "phone": user.get("phone_number")
    }
