# 🔐 Authentication System Testing Guide

## 🚀 **Complete Authentication System Implemented!**

Your job portal now has a full authentication system with user registration, login, and personalized job applications.

---

## 🏗️ **What's Been Added**

### Backend Features:
- ✅ User registration with password hashing (bcrypt)
- ✅ User login with JWT token authentication  
- ✅ Protected routes requiring authentication
- ✅ User-specific job applications (each user sees only their applications)
- ✅ Duplicate application prevention (can't apply twice to same job)
- ✅ New MongoDB collection: `users` for storing user credentials

### Frontend Features:
- ✅ Login and Register components with form validation
- ✅ Authentication context for state management
- ✅ Protected routes (requires login to access)
- ✅ Updated Navbar with user info and logout
- ✅ JWT token handling with automatic logout on expiry
- ✅ Improved ApplyPage (auto-fills user info)

---

## 🧪 **How to Test the System**

### Step 1: Start Both Servers
```bash
# Backend (Terminal 1)
cd backend
python main.py
# Server runs on http://127.0.0.1:8000

# Frontend (Terminal 2) 
cd frontend
npm start
# App runs on http://localhost:3000
```

### Step 2: Seed Sample Data
**Option A: Use Postman**
- POST to `http://127.0.0.1:8000/seed-data`
- This creates 2 test users and sample applications

**Option B: Test Sample Credentials**
After seeding, you can login with:
- Email: `john.doe@test.com` | Password: `password123`
- Email: `jane.smith@test.com` | Password: `password123`

### Step 3: Test Registration Flow
1. Visit `http://localhost:3000`
2. You'll be redirected to login (protected routes)
3. Click "create a new account"
4. Fill the registration form:
   - Name: Your Name
   - Email: yourname@test.com
   - Password: password123
   - Confirm Password: password123
5. Click "Create account"
6. You should be automatically logged in and redirected to home

### Step 4: Test Login Flow
1. Logout using the navbar button
2. Visit `http://localhost:3000/login`
3. Enter credentials:
   - Email: yourname@test.com
   - Password: password123
4. Click "Sign in"
5. You should be logged in and redirected to home

### Step 5: Test Job Applications
1. Search for jobs on the home page
2. Click "Apply" on any job
3. Notice:
   - Name and email are auto-filled from your profile
   - Only cover letter and resume upload are required
4. Submit an application
5. Visit "My Applications" to see your submitted applications
6. Each user will only see their own applications

---

## 🔧 **API Endpoints**

### Authentication Endpoints:
```
POST /register          - Register new user
POST /login            - Login user  
GET  /profile          - Get user profile (protected)
```

### Protected Endpoints (require JWT token):
```
POST /apply            - Submit job application
GET  /applications     - Get user's applications
```

### Public Endpoints:
```
GET  /                 - Health check
GET  /search           - Search jobs
POST /seed-data        - Insert sample data
GET  /health           - System health status
GET  /admin/applications - Get all applications (admin)
```

---

## 📊 **Database Schema Updates**

### New `users` Collection:
```json
{
  "_id": ObjectId,
  "name": "John Doe",
  "email": "john.doe@test.com", 
  "password": "hashed_password_with_bcrypt",
  "created_at": "2025-09-12T10:30:00.000Z",
  "updated_at": "2025-09-12T10:30:00.000Z",
  "last_login": "2025-09-12T11:00:00.000Z"
}
```

### Updated `job_applications` Collection:
```json
{
  "user_id": "user_object_id_string",
  "applicant": "John Doe",
  "email": "john.doe@test.com",
  "resume": "filename.pdf",
  "resume_base64": "base64_content...",
  "coverLetter": "Cover letter text...",
  "job_id": "job_123",
  "job_title": "Software Developer",
  "company": "TechCorp Inc.",
  "appliedDate": "2025-09-12T10:30:00.000Z",
  "status": "applied"
}
```

---

## 🎯 **Key Features Highlights**

### 🔒 Security Features:
- Passwords hashed with bcrypt (never stored in plain text)
- JWT tokens with 7-day expiration
- Protected routes requiring authentication
- Automatic logout on token expiry

### 👥 User Experience:
- Smooth registration and login flows
- Persistent login state (survives page refresh)
- User-specific job applications
- Duplicate application prevention
- Auto-filled user details in application forms

### 📱 Responsive Design:
- Mobile-friendly login/register forms
- Updated navbar with user info
- Professional form styling with validation

---

## 🚨 **Testing Scenarios**

### Scenario 1: New User Registration
1. Register new account → Should create user and auto-login
2. Check MongoDB Atlas → New user should appear in `users` collection
3. Apply for job → Application should be linked to user

### Scenario 2: Existing User Login  
1. Login with test credentials → Should work
2. Apply for multiple jobs → All applications should be user-specific
3. Logout and login as different user → Should see different applications

### Scenario 3: Security Testing
1. Try accessing `/applications` without login → Should redirect to login
2. Inspect JWT token in browser storage → Should be present after login
3. Clear token manually → Should be logged out automatically

### Scenario 4: Error Handling
1. Try invalid login credentials → Should show error
2. Try registering with existing email → Should show error
3. Try applying for same job twice → Should prevent duplicate

---

## 🎉 **Success Indicators**

✅ **Registration works**: New users can create accounts  
✅ **Login works**: Users can sign in with credentials  
✅ **Protected routes**: Unauthorized users redirected to login  
✅ **User-specific data**: Each user sees only their applications  
✅ **JWT handling**: Tokens stored/retrieved correctly  
✅ **Logout works**: Users can sign out properly  
✅ **MongoDB storage**: Users and applications stored correctly  
✅ **Duplicate prevention**: Can't apply to same job twice  
✅ **Form validation**: Proper error handling throughout  

---

## 🔧 **Troubleshooting**

### Common Issues:
1. **"jwt-decode" error**: Make sure you installed `npm install jwt-decode`
2. **CORS errors**: Ensure backend is running on port 8000
3. **Token not persisting**: Check browser localStorage for 'token' and 'user'
4. **MongoDB errors**: Verify connection string in .env file
5. **Routes not protecting**: Ensure AuthProvider wraps the entire app

### Debug Tips:
- Check browser console for errors
- Inspect Network tab for API calls
- Verify MongoDB Atlas has new `users` collection
- Test API endpoints directly with Postman

---

**🎊 Your job portal now has enterprise-level authentication! Users can register, login, and manage their personalized job applications securely.**