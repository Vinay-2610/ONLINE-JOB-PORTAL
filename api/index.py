import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the Flask app from backend
from backend.main import app

# Vercel expects the app to be available as 'app'
# The Flask app is already configured in backend/main.py