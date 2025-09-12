from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import requests
import os
from datetime import datetime
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

# Debug check (remove in production)
print("DEBUG MONGODB_URI:", "Loaded" if MONGODB_URI else "Not Found")
print("DEBUG RAPIDAPI_KEY:", "Loaded" if RAPIDAPI_KEY else "Not Found")

# MongoDB connection
if not MONGODB_URI:
    print("ERROR: MONGODB_URI not set in .env")
    MONGODB_URI = "mongodb://localhost:27017/"

print(f"Raw MONGODB_URI from env: '{MONGODB_URI}'")

# For this demo, we'll use mock MongoDB data regardless of connection
# This ensures the app works even without a real MongoDB instance
print("Using mock MongoDB for development")

class MockCollection:
    def __init__(self):
        self.data = []
        self.counter = 1

    def insert_one(self, doc):
        doc["_id"] = self.counter
        self.counter += 1
        self.data.append(doc)
        class Result:
            def __init__(self, id):
                self.inserted_id = id
        return Result(doc["_id"])

    def find_one(self, query):
        for doc in self.data:
            if doc["_id"] == query["_id"]:
                return doc
        return None

    def find(self):
        return self.data

applications_collection = MockCollection()

# Attempt MongoDB connection but continue with mock if it fails
try:
    # Try to connect for real (not used in this demo but code kept for future reference)
    if MONGODB_URI and "<username>" not in MONGODB_URI:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("MongoDB connection successful ✅")
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")
    # We're already using the mock, so no need to set it up again

    class MockCollection:
        def __init__(self):
            self.data = []
            self.counter = 1

        def insert_one(self, doc):
            doc["_id"] = self.counter
            self.counter += 1
            self.data.append(doc)
            class Result:
                def __init__(self, id):
                    self.inserted_id = id
            return Result(doc["_id"])

        def find_one(self, query):
            for doc in self.data:
                if doc["_id"] == query["_id"]:
                    return doc
            return None

        def find(self):
            return self.data

    applications_collection = MockCollection()

# Helper function to convert MongoDB documents
def job_application_helper(job_application):
    return {
        "id": str(job_application["_id"]),
        "job_id": job_application["job_id"],
        "job_title": job_application["job_title"],
        "company": job_application["company"],
        "name": job_application["name"],
        "email": job_application["email"],
        "resume_filename": job_application["resume_filename"],
        "cover_letter": job_application["cover_letter"],
        "applied_at": job_application["applied_at"],
    }

# Routes
@app.route('/')
def root():
    return jsonify({"message": "Welcome to Job Portal API"})

@app.route('/search')
def search_jobs():
    query = request.args.get('query')
    location = request.args.get('location')
    page = request.args.get('page', 1, type=int)
    category = request.args.get('category')
    remote_only = request.args.get('remote_only', 'false').lower() == 'true'
    employment_type = request.args.get('employment_type')

    print(f"Search request received - query: '{query}', location: '{location}', page: {page}, category: '{category}', remote_only: {remote_only}")

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        # First, try JSearch API for more comprehensive results (requires API key)
        if RAPIDAPI_KEY:
            print("Trying JSearch API...")
            url = "https://jsearch.p.rapidapi.com/search"
            
            # Build the search query
            search_query = query
            if category:
                search_query = f"{category} {search_query}"
            if location:
                search_query += f" in {location}"
            
            params = {
                "query": search_query,
                "page": str(page),
                "num_pages": "1",
                "date_posted": "all",
                "remote_jobs_only": "true" if remote_only else "false"
            }
            
            # Add employment type filter if specified
            if employment_type:
                params["employment_types"] = employment_type

            headers = {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
            }

            print(f"JSearch API request - Query: {search_query}")
            response = requests.get(url, headers=headers, params=params)
            print(f"JSearch API status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('data') and len(data['data']) > 0:
                    print(f"JSearch API returned {len(data['data'])} jobs")
                    return jsonify(data)
                print("JSearch API returned 0 jobs, trying other APIs")
            else:
                print(f"JSearch API error: {response.text}")
        else:
            print("RAPIDAPI_KEY not set, skipping JSearch API")
        
        # Then try Remotive API as a backup
        print("Trying Remotive API...")
        remotive_url = "https://remotive.io/api/remote-jobs"
        remotive_params = {"search": query}
        
        remotive_response = requests.get(remotive_url, params=remotive_params, timeout=10)
        print(f"Remotive API status code: {remotive_response.status_code}")
        
        if remotive_response.status_code == 200:
            data = remotive_response.json()
            filtered_jobs = data.get('jobs', [])
            
            # Filter by location if provided
            if location and filtered_jobs:
                location_lower = location.lower()
                filtered_jobs = [job for job in filtered_jobs if 
                                location_lower in (job.get('candidate_required_location') or '').lower()]
            
            print(f"Remotive API returned {len(filtered_jobs)} jobs after filtering")
            
            if filtered_jobs:
                return jsonify({"jobs": filtered_jobs})
        
        # If still no jobs, try FindWork API
        print("Trying FindWork API...")
        try:
            findwork_url = "https://findwork.dev/api/jobs/"
            findwork_params = {"search": query}
            if location:
                findwork_params["location"] = location
                
            headers = {
                "Authorization": "Token 493b97799e120fcda3749a3e462e0f1dc480f04d"  # Public API key from docs
            }
            
            findwork_response = requests.get(findwork_url, params=findwork_params, headers=headers, timeout=10)
            print(f"FindWork API status code: {findwork_response.status_code}")
            
            if findwork_response.status_code == 200:
                data = findwork_response.json()
                if data.get('results') and len(data['results']) > 0:
                    # Convert to a format similar to our other APIs
                    formatted_jobs = []
                    for job in data['results']:
                        formatted_jobs.append({
                            "job_id": job.get('id'),
                            "job_title": job.get('role'),
                            "employer_name": job.get('company_name'),
                            "job_city": job.get('location'),
                            "job_country": "",
                            "job_employment_type": job.get('employment_type', 'Full-time'),
                            "job_apply_link": job.get('url'),
                            "job_description": job.get('text'),
                            "job_is_remote": job.get('remote', False)
                        })
                    
                    print(f"FindWork API returned {len(formatted_jobs)} jobs")
                    return jsonify({"data": formatted_jobs})
        except Exception as e:
            print(f"FindWork API error: {str(e)}")

        # If we got here, all APIs failed or returned no jobs
        # Generate location-specific mock data for development
        print("All APIs failed, generating relevant mock data")
        mock_location = location if location else "Anywhere"
        
        # Job types categorization
        job_categories = {
            "software-development": ["Developer", "Engineer", "Programmer", "Full Stack", "Frontend", "Backend"],
            "data-science": ["Data Scientist", "ML Engineer", "Data Engineer", "Data Analyst", "AI"],
            "design": ["Designer", "UI", "UX", "Graphic", "Creative"],
            "marketing": ["Marketing", "SEO", "Growth", "Content", "Social Media"],
            "sales": ["Sales", "Business Development", "Account", "CRM"],
            "customer-service": ["Customer Service", "Support", "Success"],
            "finance": ["Finance", "Accounting", "Financial", "Bookkeeper"],
            "healthcare": ["Healthcare", "Medical", "Doctor", "Nurse", "Clinical"],
            "hr": ["HR", "Recruiter", "Talent", "People", "Human Resources"],
            "project-management": ["Project Manager", "Product Manager", "Agile", "Scrum"]
        }
        
        # Create different mock data based on the search query and category
        mock_jobs = {"data": []}
        
        # Identify the job category from the search query or provided category
        current_category = None
        if category and category != 'all':
            current_category = category
        else:
            for cat, keywords in job_categories.items():
                if any(keyword.lower() in query.lower() for keyword in keywords):
                    current_category = cat
                    break
        
        # Get relevant job titles based on the query and category
        job_titles = []
        base_title = query.title()
        
        if current_category:
            # Use category-specific job titles
            if current_category == "software-development":
                job_titles = [
                    f"{base_title} Developer", 
                    f"Senior {base_title} Engineer",
                    f"{base_title} Architect",
                    f"Full Stack {base_title} Developer"
                ]
            elif current_category == "data-science":
                job_titles = [
                    f"{base_title} Data Scientist",
                    f"{base_title} Machine Learning Engineer",
                    f"Senior Data Engineer - {base_title}",
                    f"{base_title} AI Specialist"
                ]
            elif current_category == "design":
                job_titles = [
                    f"{base_title} Designer",
                    f"Senior UI/UX Designer - {base_title}",
                    f"{base_title} Creative Director",
                    f"Product Designer - {base_title}"
                ]
            else:
                # Generic format for other categories
                job_titles = [
                    f"{base_title} Specialist",
                    f"Senior {base_title} Consultant",
                    f"{base_title} Team Lead",
                    f"{base_title} Manager"
                ]
        else:
            # Generic titles if no category identified
            job_titles = [
                f"{base_title} Specialist",
                f"Senior {base_title} Professional",
                f"{base_title} Coordinator",
                f"{base_title} Manager"
            ]
        
        # Company names related to the search
        companies = [
            "Tech Innovations Inc.",
            "Global Solutions Ltd",
            "NextGen Technologies",
            "Industry Leaders Corp",
            "Expert Consulting Group",
            "Digital Frontiers",
            "Future Systems",
            "Strategic Partners LLC"
        ]
        
        # Employment types
        employment_types = ["Full-time", "Contract", "Part-time"]
        if employment_type:
            employment_types = [employment_type]
        
        # Generate 6-8 mock jobs based on the page number
        num_jobs = 6 + (page % 3)
        start_idx = (page - 1) * num_jobs
        
        for i in range(num_jobs):
            job_idx = (start_idx + i) % len(job_titles)
            company_idx = (start_idx + i) % len(companies)
            employment_idx = (start_idx + i) % len(employment_types)
            is_remote = remote_only or (i % 2 == 0)
            posted_days_ago = (i * 2) + ((page - 1) * 7)
            
            # Salary range based on seniority and job type
            min_salary = 60000 + (i * 10000) + ((page - 1) * 5000)
            max_salary = min_salary + 40000
            
            if "Senior" in job_titles[job_idx] or "Lead" in job_titles[job_idx] or "Manager" in job_titles[job_idx]:
                min_salary += 20000
                max_salary += 30000
            
            # Create job description based on title and category
            job_title = job_titles[job_idx]
            job_desc = f"We're seeking a skilled {job_title} to join our team. "
            
            if "Developer" in job_title or "Engineer" in job_title:
                job_desc += "You'll build innovative solutions, collaborate with cross-functional teams, and contribute to our technical roadmap. "
                technologies = ["React", "Python", "Node.js", "AWS", "Docker", "Kubernetes", "TypeScript"]
                job_desc += f"Experience with {', '.join(technologies[:3])} is required."
            elif "Data" in job_title or "ML" in job_title or "AI" in job_title:
                job_desc += "You'll analyze large datasets, build predictive models, and drive data-informed decisions. "
                technologies = ["Python", "SQL", "TensorFlow", "PyTorch", "Spark", "scikit-learn", "Tableau"]
                job_desc += f"Proficiency in {', '.join(technologies[:3])} is essential."
            elif "Design" in job_title:
                job_desc += "You'll create compelling visual experiences, collaborate with product teams, and shape our design system. "
                tools = ["Figma", "Sketch", "Adobe Creative Suite", "InVision", "Zeplin"]
                job_desc += f"Expertise in {', '.join(tools[:2])} is required."
            else:
                job_desc += f"You'll drive initiatives in {query}, collaborate with stakeholders, and contribute to our company's success. "
                job_desc += "Strong communication skills and problem-solving abilities are essential."
            
            # Create mock job
            mock_job = {
                "job_id": f"mock-{query.lower().replace(' ', '-')}-{page}-{i}",
                "job_title": job_titles[job_idx],
                "employer_name": companies[company_idx],
                "job_city": location if location else (["Remote", "New York", "San Francisco", "London", "Berlin"][i % 5]),
                "job_country": "USA" if not location else "",
                "job_employment_type": employment_types[employment_idx],
                "job_apply_link": f"https://example.com/jobs/{query.lower().replace(' ', '-')}-{i}",
                "job_description": job_desc,
                "job_is_remote": is_remote,
                "employer_website": "https://example.com",
                "employer_company_type": "Technology",
                "job_posted_at_timestamp": int(datetime.now().timestamp()) - (posted_days_ago * 86400),
                "job_salary_currency": "USD",
                "job_salary_min": min_salary,
                "job_salary_max": max_salary,
                "job_salary_period": "YEAR"
            }
            
            # Add job highlights based on the job type
            if i % 3 == 0:  # Only add detailed highlights to some jobs
                mock_job["job_highlights"] = {
                    "Qualifications": [
                        "Bachelor's degree or equivalent experience",
                        f"{3 + i} years of relevant experience",
                        "Strong problem-solving skills",
                        "Excellent communication abilities"
                    ],
                    "Responsibilities": [
                        f"Lead {job_title.lower()} initiatives",
                        "Collaborate with cross-functional teams",
                        "Drive technical excellence and best practices",
                        "Mentor junior team members"
                    ],
                    "Benefits": [
                        "Competitive salary",
                        "Health insurance",
                        "401(k) matching",
                        "Remote work flexibility",
                        "Professional development budget"
                    ]
                }
            
            mock_jobs["data"].append(mock_job)
        
        return jsonify(mock_jobs)

    except Exception as e:
        print(f"Error in search_jobs: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/apply', methods=['POST'])
def apply_for_job():
    try:
        job_id = request.form.get('job_id')
        job_title = request.form.get('job_title')
        company = request.form.get('company')
        name = request.form.get('name')
        email = request.form.get('email')
        cover_letter = request.form.get('cover_letter')

        if not all([job_id, job_title, company, name, email, cover_letter]):
            return jsonify({"error": "All fields are required"}), 400

        if 'resume' not in request.files:
            return jsonify({"error": "Resume file is required"}), 400

        resume_file = request.files['resume']
        if resume_file.filename == '':
            return jsonify({"error": "Resume file is required"}), 400

        resume_content = resume_file.read()
        resume_base64 = base64.b64encode(resume_content).decode('utf-8')

        application = {
            "job_id": job_id,
            "job_title": job_title,
            "company": company,
            "name": name,
            "email": email,
            "resume_base64": resume_base64,
            "resume_filename": resume_file.filename,
            "cover_letter": cover_letter,
            "applied_at": datetime.now()
        }

        result = applications_collection.insert_one(application)
        created_application = applications_collection.find_one({"_id": result.inserted_id})

        return jsonify(job_application_helper(created_application))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/applications')
def get_applications():
    try:
        applications = [job_application_helper(app) for app in applications_collection.find()]
        return jsonify(applications)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
