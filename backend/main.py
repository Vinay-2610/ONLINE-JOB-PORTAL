from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import os
import base64
import requests
import bcrypt
import re
from dotenv import load_dotenv

# Load env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
jwt = JWTManager(app)

# ✅ MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
print("DEBUG MONGODB_URI:", "Loaded" if MONGODB_URI else "Not found")
print("Raw MONGODB_URI from env:", repr(MONGODB_URI))

if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable not set. Please check your .env file.")

try:
    client = MongoClient(MONGODB_URI)
    # Force a connection to verify it works
    client.admin.command('ping')
    print("MongoDB connection successful ✅")
    db = client["online_job_portal"]  # Database name
    job_applications = db["job_applications"]  # Collection for job applications
    job_listings = db["job_listings"]  # Collection for job listings (for future use)
    users = db["users"]  # Collection for user authentication
    print(f"Using database: online_job_portal")
    print(f"Collections: job_applications, job_listings, users")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise

# ✅ RapidAPI Key
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

# ---------------- ROUTES ----------------

@app.route("/")
def home():
    return jsonify({"message": "Job Portal API is running 🚀"})


# ============ AUTHENTICATION ROUTES ============

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not all([name, email, password]):
            return jsonify({"error": "Name, email, and password are required"}), 400
            
        # Validate email format
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return jsonify({"error": "Please enter a valid email address"}), 400
            
        # Validate password strength
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400
            
        # Check if user already exists
        if users.find_one({"email": email}):
            return jsonify({"error": "User with this email already exists"}), 409
            
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert user
        result = users.insert_one(user)
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            "status": "success",
            "message": "User registered successfully",
            "access_token": access_token,
            "user": {
                "id": str(result.inserted_id),
                "name": name,
                "email": email
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        # Find user by email
        user = users.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Update last login
        users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow(), "updated_at": datetime.utcnow()}}
        )
        
        # Create access token
        access_token = create_access_token(identity=str(user["_id"]))
        
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"]
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "status": "success",
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "created_at": user.get("created_at"),
                "last_login": user.get("last_login")
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Fetch jobs from APIs
@app.route("/search")
def search_jobs():
    query = request.args.get("query")
    location = request.args.get("location")
    page = request.args.get("page", 1, type=int)

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        # Try JSearch API (RapidAPI)
        if RAPIDAPI_KEY:
            url = "https://jsearch.p.rapidapi.com/search"
            params = {"query": query, "page": str(page), "num_pages": "1"}
            if location:
                params["query"] += f" in {location}"

            headers = {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
            }

            response = requests.get(url, headers=headers, params=params, timeout=10)
            if response.status_code == 200:
                return jsonify(response.json())

        # Fallback → Remotive API
        remotive_url = "https://remotive.io/api/remote-jobs"
        remotive_params = {"search": query}
        remotive_response = requests.get(remotive_url, params=remotive_params, timeout=10)
        if remotive_response.status_code == 200:
            return jsonify(remotive_response.json())

        return jsonify({"error": "No jobs found from APIs"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Submit applicant details (Protected Route)
@app.route("/apply", methods=["POST"])
@jwt_required()
def apply_for_job():
    try:
        user_id = get_jwt_identity()
        
        job_id = request.form.get("job_id")
        job_title = request.form.get("job_title")
        company = request.form.get("company")
        cover_letter = request.form.get("cover_letter")

        if not all([job_id, job_title, company, cover_letter]):
            return jsonify({"error": "Job ID, job title, company, and cover letter are required"}), 400

        if "resume" not in request.files:
            return jsonify({"error": "Resume file is required"}), 400

        resume_file = request.files["resume"]
        if resume_file.filename == "":
            return jsonify({"error": "Resume file is required"}), 400

        # Get user details
        user = users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if user has already applied for this job
        existing_application = job_applications.find_one({
            "user_id": user_id,
            "job_id": job_id
        })
        
        if existing_application:
            return jsonify({"error": "You have already applied for this job"}), 409

        # Encode resume
        resume_content = resume_file.read()
        resume_base64 = base64.b64encode(resume_content).decode("utf-8")

        # Save into MongoDB with user information
        application = {
            "user_id": user_id,
            "applicant": user["name"],
            "email": user["email"],
            "resume": resume_file.filename,
            "resume_base64": resume_base64,
            "coverLetter": cover_letter,
            "job_id": job_id,
            "job_title": job_title,
            "company": company,
            "appliedDate": datetime.utcnow(),
            "status": "applied"
        }

        result = job_applications.insert_one(application)

        return jsonify({
            "status": "success",
            "message": "Application submitted successfully",
            "id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get user's applications (Protected Route)
@app.route("/applications", methods=["GET"])
@jwt_required()
def get_applications():
    try:
        user_id = get_jwt_identity()
        
        # Get applications for the current user only
        applications = list(job_applications.find({"user_id": user_id}, {"_id": 0, "resume_base64": 0}))
        
        return jsonify({
            "status": "success",
            "count": len(applications),
            "data": applications
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get all applications (Admin only - for development/testing)
@app.route("/admin/applications", methods=["GET"])
def get_all_applications():
    try:
        applications = list(job_applications.find({}, {"_id": 0, "resume_base64": 0}))
        return jsonify({
            "status": "success",
            "count": len(applications),
            "data": applications
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Add sample data for testing
@app.route("/seed-data", methods=["POST"])
def seed_sample_data():
    try:
        # Clear existing data
        users.delete_many({})
        job_applications.delete_many({})
        
        # Create sample users
        sample_users = [
            {
                "name": "John Doe",
                "email": "john.doe@test.com",
                "password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Jane Smith", 
                "email": "jane.smith@test.com",
                "password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        user_results = users.insert_many(sample_users)
        user_ids = [str(id) for id in user_results.inserted_ids]
        
        # Sample applications data with user IDs
        sample_applications = [
            {
                "user_id": user_ids[0],
                "applicant": "John Doe",
                "email": "john.doe@test.com",
                "resume": "john_doe_resume.pdf",
                "resume_base64": "sample_base64_content_1",
                "coverLetter": "I am very interested in this software engineer position...",
                "job_id": "job_001",
                "job_title": "Full Stack Developer",
                "company": "TechCorp Inc.",
                "appliedDate": datetime.utcnow(),
                "status": "applied"
            },
            {
                "user_id": user_ids[1],
                "applicant": "Jane Smith",
                "email": "jane.smith@test.com",
                "resume": "jane_smith_resume.pdf",
                "resume_base64": "sample_base64_content_2",
                "coverLetter": "With my experience in React and Node.js, I believe I'm a perfect fit...",
                "job_id": "job_002",
                "job_title": "Frontend Developer",
                "company": "StartupXYZ",
                "appliedDate": datetime.utcnow(),
                "status": "applied"
            },
            {
                "user_id": user_ids[0],
                "applicant": "John Doe",
                "email": "john.doe@test.com",
                "resume": "john_doe_resume_2.pdf",
                "resume_base64": "sample_base64_content_3",
                "coverLetter": "I have experience in data science and would love to contribute...",
                "job_id": "job_003",
                "job_title": "Data Scientist",
                "company": "DataTech Solutions",
                "appliedDate": datetime.utcnow(),
                "status": "applied"
            }
        ]
        
        # Insert sample data
        app_results = job_applications.insert_many(sample_applications)
        
        return jsonify({
            "status": "success",
            "message": f"Successfully inserted {len(user_results.inserted_ids)} users and {len(app_results.inserted_ids)} applications",
            "users_count": len(user_results.inserted_ids),
            "applications_count": len(app_results.inserted_ids),
            "sample_credentials": [
                {"email": "john.doe@test.com", "password": "password123"},
                {"email": "jane.smith@test.com", "password": "password123"}
            ]
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    try:
        # Check MongoDB connection
        client.admin.command('ping')
        app_count = job_applications.count_documents({})
        user_count = users.count_documents({})
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "users_count": user_count,
            "applications_count": app_count,
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
