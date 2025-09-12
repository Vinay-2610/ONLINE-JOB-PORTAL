#!/usr/bin/env python3
"""
Simple script to test the job portal API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print("Health check:", response.status_code)
        print("Response:", response.json())
        return True
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_login():
    """Test login with sample user"""
    try:
        # First, seed the database to ensure we have a user
        response = requests.post(f"{BASE_URL}/seed-data")
        print("Seed data:", response.status_code)
        
        # Try to login
        login_data = {
            "email": "john.doe@test.com",
            "password": "password123"
        }
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print("Login:", response.status_code)
        
        if response.status_code == 200:
            data = response.json()
            print("Login successful!")
            print("User:", data.get('user'))
            return data.get('access_token')
        else:
            print("Login failed:", response.text)
            return None
    except Exception as e:
        print(f"Login test failed: {e}")
        return None

def test_protected_route(token):
    """Test a protected route"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/profile", headers=headers)
        print("Profile endpoint:", response.status_code)
        if response.status_code == 200:
            print("Profile data:", response.json())
            return True
        else:
            print("Profile failed:", response.text)
            return False
    except Exception as e:
        print(f"Profile test failed: {e}")
        return False

def test_application_submission(token):
    """Test submitting a job application"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a dummy file for testing
        files = {
            'resume': ('test_resume.pdf', b'dummy pdf content', 'application/pdf')
        }
        
        data = {
            'job_id': 'test_job_123',
            'job_title': 'Test Developer',
            'company': 'Test Company',
            'cover_letter': 'This is a test cover letter'
        }
        
        response = requests.post(f"{BASE_URL}/apply", headers=headers, files=files, data=data)
        print("Application submission:", response.status_code)
        if response.status_code == 201:
            print("Application submitted successfully!")
            print("Response:", response.json())
            return True
        else:
            print("Application submission failed:", response.text)
            return False
    except Exception as e:
        print(f"Application submission test failed: {e}")
        return False

def main():
    print("=== Testing Job Portal API ===\n")
    
    # Test 1: Health check
    print("1. Testing health endpoint...")
    if not test_health():
        print("Backend is not running or accessible!")
        return
    
    print("\n" + "="*50)
    
    # Test 2: Authentication
    print("\n2. Testing authentication...")
    token = test_login()
    if not token:
        print("Authentication failed!")
        return
    
    print("\n" + "="*50)
    
    # Test 3: Protected route
    print("\n3. Testing protected route...")
    if not test_protected_route(token):
        print("Protected route failed!")
        return
    
    print("\n" + "="*50)
    
    # Test 4: Application submission
    print("\n4. Testing application submission...")
    if test_application_submission(token):
        print("All tests passed! ✅")
    else:
        print("Application submission failed! ❌")

if __name__ == "__main__":
    main()