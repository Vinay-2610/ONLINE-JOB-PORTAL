# Job Portal Application

A full-stack job portal application built with React frontend and FastAPI backend.

## Features

- Search for jobs using keywords and location
- View job details and apply for jobs
- Upload resume and submit cover letter
- Track job applications

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** MongoDB Atlas (cloud NoSQL database)
- **API Integration:** JSearch API (RapidAPI) or Remotive API

## Project Structure

```
job-portal/
├── backend/              # FastAPI backend
│   ├── main.py           # Main FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── .env              # Environment variables
│
└── frontend/             # React frontend
    ├── public/           # Static files
    ├── src/              # React source code
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Application pages
    │   └── services/     # API service
    ├── package.json      # Node.js dependencies
    └── tailwind.config.js # Tailwind CSS configuration
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

## API Endpoints

- `GET /search?query=<query>&location=<location>` - Search for jobs
- `POST /apply` - Submit job application
- `GET /applications` - Retrieve all job applications

## MongoDB Collections

- `applications` - Stores job applications with resume files

## License

MIT
