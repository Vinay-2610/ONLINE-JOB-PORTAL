# 🚀 SkillMate Job Portal - Complete Setup Guide

## ✅ **READY TO USE APPLICATION**

Your SkillMate Job Portal is fully configured and ready to run! Both backend and frontend are working perfectly with the AI chatbot powered by Google Gemini.

---

## 🏃‍♂️ **Quick Start (Easy Method)**

### **Option 1: Start Everything at Once**
Double-click: **`start-application.bat`**

This will automatically:
- Start the backend server on `http://127.0.0.1:8000`
- Start the frontend server on `http://localhost:3000`
- Open both in separate command windows

### **Option 2: Start Individually**
1. **Backend**: Double-click **`start-backend.bat`**
2. **Frontend**: Double-click **`start-frontend.bat`**

---

## 🌐 **Access Your Application**

1. **Open your browser** and go to: `http://localhost:3000`
2. **Create an account** or login with test credentials:
   - Email: `john.doe@test.com`
   - Password: `password123`

---

## ✨ **Key Features Working**

### 🔐 **Authentication System**
- ✅ User Registration with validation
- ✅ Secure Login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes for authenticated users

### 💼 **Job Search & Application**
- ✅ Search jobs from multiple APIs (JSearch, Remotive)
- ✅ Apply for jobs with resume upload
- ✅ View application history
- ✅ User-specific applications

### 🤖 **AI Chatbot Assistant**
- ✅ Google Gemini AI integration
- ✅ Job-focused responses with specific advice
- ✅ Quick question buttons
- ✅ Only visible after login (hidden on auth pages)
- ✅ Career guidance, salary info, company insights

### 💾 **Database**
- ✅ MongoDB Atlas connection
- ✅ User data storage
- ✅ Job applications tracking
- ✅ Secure data handling

---

## 🔧 **Technical Stack**

### **Frontend**
- ⚛️ React 18.2.0
- 🎨 Tailwind CSS for styling
- 🛣️ React Router for navigation
- 🔐 JWT authentication
- 📱 Responsive design

### **Backend**
- 🐍 Python Flask
- 🍃 MongoDB with PyMongo
- 🔐 JWT & bcrypt for security
- 🤖 Google Gemini AI integration
- 🌐 CORS enabled for cross-origin requests

---

## 🗂️ **Project Structure**
```
ONLINE-JOB-PORTAL/
│
├── 🚀 start-application.bat      # Start everything at once
├── 🔧 start-backend.bat          # Start backend only
├── 🔧 start-frontend.bat         # Start frontend only
│
├── backend/
│   ├── main.py                   # Flask API server
│   ├── requirements.txt          # Python dependencies
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatbotButton.js  # Floating chatbot button
│   │   │   ├── ChatWindow.js     # Chat interface
│   │   │   ├── Login.js          # Login component
│   │   │   ├── Register.js       # Registration component
│   │   │   └── ...
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js            # API calls including chatbot
│   │   └── App.js                # Main app with conditional chatbot
│   ├── package.json
│   └── build/                    # Production build
│
└── 📚 Documentation files
```

---

## 🛠️ **Environment Variables**

Your `.env` file is configured with:
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://ivb:ivb2005@job.mx8bv2j.mongodb.net/?retryWrites=true&w=majority&appName=Job

# JWT Secret Key
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Google Gemini API Key (for chatbot)
GEMINI_API_KEY=AIzaSyDtSfhOIJjstmvYXOvwB4kmNZmz9dfmGZQ
```

---

## 🤖 **Chatbot Features**

The AI assistant can help with:
- 💰 **Salary Information**: "What's the average salary for React developers?"
- 🏢 **Company Insights**: "Which companies are hiring freshers?"
- 📈 **Career Trends**: "What are the latest job trends in IT?"
- 🛠️ **Skills Development**: "What skills should I learn for software development?"
- 📝 **Resume Tips**: "How to improve my resume for tech jobs?"
- 🎯 **Interview Prep**: "Common interview questions for data science roles"

---

## 🔍 **Testing the Application**

### 1. **Registration & Login**
- Go to `http://localhost:3000`
- Create a new account
- Login successfully

### 2. **Job Search**
- Search for jobs (e.g., "developer", "python", "react")
- View job listings
- Apply for jobs with resume upload

### 3. **Chatbot**
- Look for the floating blue chat button (bottom-right)
- Click to open chat window
- Try questions like:
  - "What are the highest paying IT jobs?"
  - "Which companies hire React developers?"
  - "How much do software engineers earn?"

### 4. **Applications**
- View your job applications in the Applications page
- See application history and status

---

## 🚨 **Troubleshooting**

### **If Backend Doesn't Start:**
1. Make sure Python is installed
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Check if `.env` file exists with correct API keys

### **If Frontend Doesn't Start:**
1. Make sure Node.js is installed
2. Install dependencies: `npm install` in frontend folder
3. Clear cache: `npm start -- --reset-cache`

### **If Chatbot Doesn't Work:**
1. Verify Gemini API key is valid
2. Check backend server is running on port 8000
3. Look for error messages in browser console

---

## 📊 **Server Status**

✅ **Backend Server**: Running on `http://127.0.0.1:8000`
✅ **Frontend Server**: Running on `http://localhost:3000`
✅ **Database**: Connected to MongoDB Atlas
✅ **AI Chatbot**: Integrated with Google Gemini
✅ **Authentication**: JWT-based secure login
✅ **File Upload**: Resume upload functionality

---

## 🎯 **Ready to Use!**

Your application is **100% functional** with:
- Complete authentication system
- Job search and application features
- AI-powered career chatbot
- Responsive design
- Secure backend API
- Cloud database integration

**Just double-click `start-application.bat` and enjoy your SkillMate Job Portal!** 🚀

---

## 📞 **Support**

If you encounter any issues:
1. Check that both servers are running
2. Verify environment variables are set
3. Look at console logs for error messages
4. Ensure ports 3000 and 8000 are available

**Happy job hunting with SkillMate! 🎉**