import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import APIRouter, Depends, HTTPException, Header
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the Firebase credentials file path from the environment variable
FIREBASE_CRED_PATH = os.getenv("FIREBASE_CRED_PATH")

if not FIREBASE_CRED_PATH:
    raise ValueError("FIREBASE_CRED_PATH is not set in the environment variables")

# Initialize Firebase Admin SDK with the service account credentials
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred)

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
        # Return an HTTP error if the token verification fails
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

@router.get("/me")
def get_current_user(user=Depends(verify_firebase_token)):
    """
    Returns the logged-in Firebase user details
    """
    return {"uid": user["uid"], "email": user.get("email"), "phone": user.get("phone_number")}
