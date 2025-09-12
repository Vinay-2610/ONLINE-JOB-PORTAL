# How to Verify Data in MongoDB Atlas

## 🏗️ Your Current Setup
- **Database Name**: `online_job_portal`
- **Collection Name**: `job_applications`
- **MongoDB Atlas URI**: `mongodb+srv://ivb:ivb2005@job.mx8bv2j.mongodb.net/...`

## 🔍 Step 1: Check Current Data in MongoDB Atlas

### Option A: Using MongoDB Atlas Web Interface
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login with your credentials
3. Navigate to your cluster "Job"
4. Click **"Browse Collections"**
5. Select database: `online_job_portal`
6. Select collection: `job_applications`
7. You should see 3 sample applications that were inserted

### Option B: Check via API Endpoint
Visit: `http://127.0.0.1:8000/applications` in your browser
You should see JSON response with existing applications.

## 📝 Step 2: Test Job Application Submission

### Using Postman (Recommended)

1. **Open Postman**
2. **Create New Request**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/apply`

3. **Set up Form Data** (Body > form-data):
   ```
   Key: job_id          | Value: test_job_456
   Key: job_title       | Value: Frontend Developer  
   Key: company         | Value: Your Test Company
   Key: name           | Value: Your Name
   Key: email          | Value: your.email@test.com
   Key: cover_letter   | Value: This is my test application...
   Key: resume         | Type: File | Upload any .txt/.pdf file
   ```

4. **Send Request**
   - Expected Response: Status 201 with success message

5. **Verify Data Inserted**
   - Go to `http://127.0.0.1:8000/applications`
   - You should now see 4 applications (3 original + 1 new)

## 🌐 Step 3: Verify in MongoDB Atlas

After submitting the application:

1. **Refresh MongoDB Atlas**
   - Go back to Atlas web interface
   - Refresh the `job_applications` collection
   - You should see your new application data

2. **Expected Document Structure**:
   ```json
   {
     "applicant": "Your Name",
     "email": "your.email@test.com", 
     "resume": "filename.pdf",
     "resume_base64": "base64_encoded_file_content...",
     "coverLetter": "This is my test application...",
     "job_id": "test_job_456",
     "job_title": "Frontend Developer",
     "company": "Your Test Company",
     "appliedDate": "2025-09-12T..."
   }
   ```

## 🚀 Step 4: Alternative Testing with curl (Windows PowerShell)

```powershell
# Create a test file
"Test Resume Content" | Out-File -FilePath "test_resume.txt" -Encoding UTF8

# Submit application (replace with your actual file path)
curl -X POST http://127.0.0.1:8000/apply `
  -F "job_id=curl_test_789" `
  -F "job_title=DevOps Engineer" `
  -F "company=PowerShell Test Corp" `
  -F "name=Curl Test User" `
  -F "email=curl.test@example.com" `
  -F "cover_letter=Testing application submission via curl" `
  -F "resume=@test_resume.txt"

# Check applications
curl http://127.0.0.1:8000/applications
```

## 🔧 Step 5: Health Check

Always verify system status:
- Visit: `http://127.0.0.1:8000/health`
- Should show:
  ```json
  {
    "status": "healthy",
    "database": "connected", 
    "applications_count": 4,  // Updated count
    "timestamp": "2025-09-12T..."
  }
  ```

## 🎯 What to Look For

### ✅ Success Indicators:
- POST `/apply` returns status 201
- GET `/applications` shows increased count
- MongoDB Atlas collection shows new document
- Health endpoint shows updated count

### ❌ Potential Issues:
- Status 400: Missing required fields
- Status 500: Database connection issue
- No new data in Atlas: Check network connectivity

## 📊 MongoDB Atlas Navigation

1. **Atlas Dashboard** → Your Cluster ("Job")
2. **Collections** → Browse Collections  
3. **Database**: `online_job_portal`
4. **Collection**: `job_applications`
5. **View**: Documents will show as JSON format

## 🔍 Database Verification Commands

If you want to verify via MongoDB shell:
```javascript
// Connect to your database
use online_job_portal

// Count all applications
db.job_applications.countDocuments()

// Find all applications
db.job_applications.find().pretty()

// Find specific application
db.job_applications.findOne({"applicant": "Your Name"})
```

---

**🎉 Once you see your test application in both the API response AND MongoDB Atlas, you'll know the data insertion is working perfectly!**