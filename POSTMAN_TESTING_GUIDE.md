# Postman Testing Guide for Online Job Portal Backend

## Server Information
- **Base URL**: `http://127.0.0.1:8000`
- **Database**: `online_job_portal`
- **Collections**: `job_applications`, `job_listings`

## Prerequisites
1. Ensure the backend server is running: `cd backend && python main.py`
2. MongoDB connection is established (MongoDB Atlas)
3. All dependencies are installed: `pip install -r requirements.txt`

---

## 🚀 API Endpoints Testing

### 1. Health Check
**Test if the server and database are working properly**

- **Method**: `GET`
- **URL**: `http://127.0.0.1:8000/health`
- **Expected Response**:
```json
{
    "status": "healthy",
    "database": "connected",
    "applications_count": 3,
    "timestamp": "2025-09-12T10:30:00.000Z"
}
```

---

### 2. Root Endpoint
**Basic server status check**

- **Method**: `GET`
- **URL**: `http://127.0.0.1:8000/`
- **Expected Response**:
```json
{
    "message": "Job Portal API is running 🚀"
}
```

---

### 3. Seed Sample Data
**Insert test data into the database**

- **Method**: `POST`
- **URL**: `http://127.0.0.1:8000/seed-data`
- **Expected Response**:
```json
{
    "status": "success",
    "message": "Successfully inserted 3 sample applications",
    "inserted_count": 3
}
```

**Note**: This will clear existing applications and insert fresh sample data.

---

### 4. Get All Applications
**Retrieve all job applications from the database**

- **Method**: `GET`
- **URL**: `http://127.0.0.1:8000/applications`
- **Expected Response**:
```json
{
    "status": "success",
    "count": 3,
    "data": [
        {
            "applicant": "John Doe",
            "email": "john.doe@email.com",
            "resume": "john_doe_resume.pdf",
            "resume_base64": "sample_base64_content_1",
            "coverLetter": "I am very interested in this software engineer position...",
            "job_id": "job_001",
            "job_title": "Full Stack Developer",
            "company": "TechCorp Inc.",
            "appliedDate": "2025-09-12T10:30:00.000Z"
        },
        // ... more applications
    ]
}
```

---

### 5. Submit Job Application
**Submit a new job application with resume file**

- **Method**: `POST`
- **URL**: `http://127.0.0.1:8000/apply`
- **Content-Type**: `multipart/form-data`

**Form Data Parameters**:
| Field | Type | Value | Required |
|-------|------|-------|----------|
| `job_id` | text | `job_004` | ✅ |
| `job_title` | text | `Backend Developer` | ✅ |
| `company` | text | `TechStartup Inc.` | ✅ |
| `name` | text | `Alice Johnson` | ✅ |
| `email` | text | `alice.johnson@email.com` | ✅ |
| `cover_letter` | text | `I am excited to apply for this position...` | ✅ |
| `resume` | file | Upload any PDF/DOC file | ✅ |

**Steps to test in Postman**:
1. Set method to `POST`
2. In the `Body` tab, select `form-data`
3. Add all the text fields as shown above
4. For the `resume` field, change type from `Text` to `File` and upload a test file
5. Send the request

**Expected Response**:
```json
{
    "status": "success",
    "message": "Application submitted successfully",
    "id": "64f1234567890abcdef12345"
}
```

---

### 6. Search Jobs
**Search for jobs using external APIs**

- **Method**: `GET`
- **URL**: `http://127.0.0.1:8000/search`

**Query Parameters**:
| Parameter | Type | Example | Required |
|-----------|------|---------|----------|
| `query` | string | `software engineer` | ✅ |
| `location` | string | `New York` | ❌ |
| `page` | integer | `1` | ❌ |

**Example URLs**:
- `http://127.0.0.1:8000/search?query=software engineer`
- `http://127.0.0.1:8000/search?query=developer&location=California`
- `http://127.0.0.1:8000/search?query=data scientist&page=2`

**Expected Response**: 
*Response will vary based on external API data*

---

## 🧪 Testing Scenarios

### Scenario 1: Fresh Start Testing
1. **POST** `/seed-data` - Insert sample data
2. **GET** `/health` - Check system status
3. **GET** `/applications` - View all applications

### Scenario 2: Application Flow Testing
1. **POST** `/apply` - Submit a new application
2. **GET** `/applications` - Verify the new application was saved
3. **GET** `/health` - Check updated count

### Scenario 3: Job Search Testing
1. **GET** `/search?query=developer` - Search for developer jobs
2. **GET** `/search?query=python&location=Remote` - Search with location
3. **GET** `/search?query=invalidjobquery` - Test with invalid query

### Scenario 4: Error Testing
1. **POST** `/apply` without required fields - Should return 400 error
2. **POST** `/apply` without resume file - Should return 400 error
3. **GET** `/search` without query parameter - Should return 400 error

---

## 🔧 Common Issues & Solutions

### Issue 1: Connection Refused
- **Problem**: `Unable to connect to server`
- **Solution**: Make sure the Flask server is running with `python main.py`

### Issue 2: MongoDB Connection Error
- **Problem**: Database connection failed
- **Solution**: Check your `.env` file has the correct `MONGODB_URI`

### Issue 3: File Upload Issues
- **Problem**: Resume upload failing
- **Solution**: Ensure you select `File` type for resume field in Postman form-data

### Issue 4: External API Rate Limits
- **Problem**: Job search returns errors
- **Solution**: The API falls back to different providers automatically

---

## 📝 Sample Test Data

Use this data for manual testing:

```json
{
    "job_id": "test_job_001",
    "job_title": "Python Developer",
    "company": "Test Company Ltd",
    "name": "Test User",
    "email": "test.user@example.com",
    "cover_letter": "This is a test application for the Python Developer position. I have experience with Flask, MongoDB, and REST APIs."
}
```

---

## 🚀 Quick Start Commands

```bash
# Start the server
cd backend
python main.py

# The server will be available at:
# http://127.0.0.1:8000
# http://localhost:8000
```

## 📊 Database Schema

**Collection: job_applications**
```json
{
    "applicant": "string",
    "email": "string",
    "resume": "string (filename)",
    "resume_base64": "string (base64 encoded file)",
    "coverLetter": "string",
    "job_id": "string",
    "job_title": "string", 
    "company": "string",
    "appliedDate": "datetime"
}
```

---

**✅ All endpoints are working and ready for testing with Postman!**