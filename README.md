# Job Portal Application

A full-stack job portal application built with React frontend and FastAPI backend.

## Features

- Search for jobs using keywords and location
- View job details and apply for jobs
- Upload resume and submit cover letter
- Track job applications

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Flask (Python)
- **Database:** MongoDB Atlas (cloud NoSQL database)
- **API Integration:** JSearch API (RapidAPI) or Remotive API
- **Authentication:** JWT-based authentication with Flask-JWT-Extended

## Project Structure

```
job-portal/
├── backend/              # Flask backend
│   ├── main.py           # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   ├── .env              # Environment variables (not in git)
│   └── test_application.py # Backend tests
│
├── frontend/             # React frontend
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── pages/        # Application pages
│   │   └── services/     # API service
│   ├── package.json      # Node.js dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
│
└── test_api.py           # API testing script
```

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.8 or higher
- MongoDB Atlas account

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   - Update the `.env` file with your MongoDB URI and RapidAPI key:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/job_portal
     RAPIDAPI_KEY=your_rapidapi_key
     ```

6. Run the FastAPI server:
   ```
   python main.py
   ```
   The server will run at http://localhost:8000.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The application will open at http://localhost:3000.

## Testing

### API Testing Script

A comprehensive API test script is included to verify all backend functionality:

```bash
python test_api.py
```

This script tests:
- Health check endpoint
- User authentication (register/login)
- Protected routes
- Job application submission
- MongoDB connectivity

### Manual Testing

1. **Register/Login**: Create an account or use test credentials:
   - Email: `john.doe@test.com`
   - Password: `password123`

2. **Search Jobs**: Use the search form to find jobs
3. **Apply for Jobs**: Select a job and submit an application with resume and cover letter
4. **View Applications**: Check "My Applications" to see submitted applications

## API Endpoints

- `GET /` - Health check
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)
- `GET /search?query=<query>&location=<location>` - Search for jobs
- `POST /apply` - Submit job application (protected)
- `GET /applications` - Get user's applications (protected)
- `GET /admin/applications` - Get all applications (admin)
- `POST /seed-data` - Add sample data for testing
- `GET /health` - System health check

## MongoDB Collections

- `users` - User accounts and authentication
- `job_applications` - Job applications with resume files
- `job_listings` - Job listings (for future use)

## License

MIT
