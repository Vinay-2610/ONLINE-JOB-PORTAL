from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
import base64
import requests
from dotenv import load_dotenv

# Load env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

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
    print(f"Using database: online_job_portal")
    print(f"Collections: job_applications, job_listings")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise

# ✅ RapidAPI Key
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

# ---------------- ROUTES ----------------

@app.route("/")
def home():
    return jsonify({"message": "Job Portal API is running 🚀"})


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


# ✅ Submit applicant details
@app.route("/apply", methods=["POST"])
def apply_for_job():
    try:
        job_id = request.form.get("job_id")
        job_title = request.form.get("job_title")
        company = request.form.get("company")
        name = request.form.get("name")
        email = request.form.get("email")
        cover_letter = request.form.get("cover_letter")

        if not all([job_id, job_title, company, name, email, cover_letter]):
            return jsonify({"error": "All fields are required"}), 400

        if "resume" not in request.files:
            return jsonify({"error": "Resume file is required"}), 400

        resume_file = request.files["resume"]
        if resume_file.filename == "":
            return jsonify({"error": "Resume file is required"}), 400

        # Encode resume
        resume_content = resume_file.read()
        resume_base64 = base64.b64encode(resume_content).decode("utf-8")

        # Save into MongoDB
        application = {
            "applicant": name,
            "email": email,
            "resume": resume_file.filename,
            "resume_base64": resume_base64,
            "coverLetter": cover_letter,
            "job_id": job_id,
            "job_title": job_title,
            "company": company,
            "appliedDate": datetime.utcnow()
        }

        result = job_applications.insert_one(application)

        return jsonify({
            "status": "success",
            "message": "Application submitted successfully",
            "id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get all applicants
@app.route("/applications", methods=["GET"])
def get_applications():
    try:
        applications = list(job_applications.find({}, {"_id": 0}))
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
        job_applications.delete_many({})
        
        # Sample applications data
        sample_applications = [
            {
                "applicant": "John Doe",
                "email": "john.doe@email.com",
                "resume": "john_doe_resume.pdf",
                "resume_base64": "sample_base64_content_1",
                "coverLetter": "I am very interested in this software engineer position...",
                "job_id": "job_001",
                "job_title": "Full Stack Developer",
                "company": "TechCorp Inc.",
                "appliedDate": datetime.utcnow()
            },
            {
                "applicant": "Jane Smith",
                "email": "jane.smith@email.com",
                "resume": "jane_smith_resume.pdf",
                "resume_base64": "sample_base64_content_2",
                "coverLetter": "With my experience in React and Node.js, I believe I'm a perfect fit...",
                "job_id": "job_002",
                "job_title": "Frontend Developer",
                "company": "StartupXYZ",
                "appliedDate": datetime.utcnow()
            },
            {
                "applicant": "Mike Johnson",
                "email": "mike.johnson@email.com",
                "resume": "mike_johnson_resume.pdf",
                "resume_base64": "sample_base64_content_3",
                "coverLetter": "I have 5+ years of experience in data science and machine learning...",
                "job_id": "job_003",
                "job_title": "Data Scientist",
                "company": "DataTech Solutions",
                "appliedDate": datetime.utcnow()
            }
        ]
        
        # Insert sample data
        result = job_applications.insert_many(sample_applications)
        
        return jsonify({
            "status": "success",
            "message": f"Successfully inserted {len(result.inserted_ids)} sample applications",
            "inserted_count": len(result.inserted_ids)
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
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
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
